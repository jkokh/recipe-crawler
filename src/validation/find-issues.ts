import { prisma } from "../lib/iterator";
import { Prisma } from "@prisma/client";
import { RecipeJson } from "../types";
import nlp from "compromise";
import { suspiciousPatterns } from "./patterns";

async function main() {
    const sources = await prisma.source.findMany({
        where: { jsonParsed: { not: Prisma.JsonNull } },
        select: { id: true, jsonParsed: true, jsonAltered: true, recipeUrl: true },
    });

    const matches: { id: number; recipeUrl: string; matched: string; pattern: string; nlpDetected?: string[] }[] = [];
    const flaggedIds = new Set<number>();

    for (const s of sources) {
        const json = (s.jsonAltered || s.jsonParsed) as Partial<RecipeJson>;
        if (!json) continue;

        delete (json as any).images;

        const combined = JSON.stringify(json).replace(/\s+/g, " ");
        for (const pattern of suspiciousPatterns) {
            const match = combined.match(pattern);
            if (!match) continue;

            const record: {
                id: number;
                recipeUrl: string;
                matched: string;
                pattern: string;
                nlpDetected?: string[];
            } = {
                id: s.id,
                recipeUrl: s.recipeUrl,
                matched: match[0],
                pattern: pattern.toString(),
            };

            // If pattern involves "by", use NLP to verify person names
            if (pattern.toString().includes("\\bby")) {
                const afterBy = match[0].split("by")[1]?.trim();
                if (afterBy) {
                    const people = nlp(afterBy).people().out("array");
                    if (people.length > 0) record.nlpDetected = people;
                }
            }

            matches.push(record);
            flaggedIds.add(s.id);
            break; // only mark one match per source
        }
    }

    console.log(`\n=== DETECTED REFERENCES REPORT ===\n`);
    console.log(`Scanned ${sources.length} sources.`);
    console.log(`Found ${matches.length} with potential issues.\n`);

    for (const m of matches) {
        console.log(`[ID ${m.id}] ${m.recipeUrl}`);
        console.log(`→ Match: ${m.matched}`);
        console.log(`→ Pattern: ${m.pattern}`);
        if (m.nlpDetected?.length) {
            console.log(`→ NLP Detected Name(s): ${m.nlpDetected.join(", ")}`);
        }
        console.log("");
    }

    const unique = new Set(matches.map((m) => m.id));
    console.log(`Unique sources flagged: ${unique.size}\n`);

    // === Update flagged field in DB ===
    console.log("Updating flagged status in database...\n");

    await Promise.allSettled(
        sources.map((s) =>
            prisma.source.update({
                where: { id: s.id },
                data: { flagged: flaggedIds.has(s.id), checked: true },
            })
        )
    );

    console.log(`✅ Database updated: ${flaggedIds.size} flagged, ${sources.length - flaggedIds.size} clear.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
