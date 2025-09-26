import "dotenv/config";

import { prisma } from "../../../lib/iterator";
import {cryptoHash} from "../../../2.parser-all-to-json/modules/parserUtils";

async function fetchContext(sourceId: number): Promise<{ title?: string; paragraphs?: unknown } | null> {
    const src = await prisma.source.findUnique({
        where: { id: sourceId },
        select: { jsonParsed: true }
    });
    const data: any = src?.jsonParsed;
    if (!data || typeof data !== "object") return null;
    const { title, paragraphs } = data as { title?: string; paragraphs?: unknown };
    if (!title && !paragraphs) return null;
    return { title, paragraphs };
}

export async function process() {
    try {
        const rows = await prisma.phrase.findMany({
            select: { sourceId: true, text: true },
            orderBy: { sourceId: "asc" }
        });

        console.log(`Processing ${rows.length} phrase(s)`);

        for (const r of rows) {
            try {
                const ctx = await fetchContext(r.sourceId!);
                if (!ctx) continue;
                const title = typeof ctx.title === "string" ? ctx.title : r.text;
                const hash = cryptoHash(title);

                console.log(`Title: ${title}`);

                await prisma.phrase.updateMany({
                    where: {
                        type: 'title',
                        sourceId: r.sourceId
                    },
                    data: {
                        hash,
                        updatedAt: new Date()
                    }
                });


            } catch (err: any) {
                console.error(`❌ Error processing sourceId ${r.sourceId}:`, err?.message ?? err);
            }
        }

        console.log("\x1b[32m%s\x1b[0m", "Done!");
    } catch (err: any) {
        console.error("❌ Failed to fetch phrases:", err?.message ?? err);
    }
}

void process();