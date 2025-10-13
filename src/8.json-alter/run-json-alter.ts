import { Prisma, PrismaClient } from "@prisma/client";
import { RecipeJson } from "../types";
import { VERSION } from "../constants";
import {alterImages, alterParagraphs, alterSteps, getPhrasedText} from "./utils";

const prisma = new PrismaClient();

async function processSource(
    source: {
        id: number;
        jsonParsed: any;
    }
): Promise<void> {
    const jsonParsed = source.jsonParsed as RecipeJson;

    if (!jsonParsed) {
        console.warn(`[${source.id}] Skipped (no jsonParsed)`);
        return;
    }

    try {
        let alteredTitle = jsonParsed.title;
        if (jsonParsed.title) {
            const rephrased = await getPhrasedText(source.id, jsonParsed.title, prisma);
            if (rephrased) alteredTitle = rephrased;
        }

        const jsonAltered: RecipeJson = {
            ...jsonParsed,
            title: alteredTitle,
            paragraphs: await alterParagraphs(source.id, jsonParsed.paragraphs, prisma),
            steps: await alterSteps(source.id, jsonParsed.steps, prisma),
            images: await alterImages(source.id, jsonParsed.images, prisma),
        };

        await prisma.source.update({
            where: { id: source.id },
            data: {
                jsonAltered: jsonAltered as Prisma.InputJsonValue
            }
        });
    } catch (err: any) {
        console.error(`[${source.id}] Error:`, err.message);
    }
}

export async function processAlter(): Promise<void> {
    const sources = await prisma.source.findMany({
        where: { version: VERSION },
        select: {
            id: true,
            jsonParsed: true
        },
        orderBy: { id: "asc" }
    });

    console.log(`Found ${sources.length} sources to process.\n`);

    for (let i = 0; i < sources.length; i++) {
        await processSource(sources[i]);
        if ((i + 1) % 50 === 0 || i === sources.length - 1) {
            process.stdout.write(`\rProgress: ${i + 1}/${sources.length}`);
        }
    }
    console.log(`\n\n✅ All done! Processed ${sources.length} sources.`);
}

void processAlter();