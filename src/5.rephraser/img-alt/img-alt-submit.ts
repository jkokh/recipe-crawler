import { prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import {BATCH_ID_FILE, VERSION} from "../../constants";

function makePrompt(title: string): string {
    return `Rephrase this recipe image alt text: ${title}

RULES (apply silently):
- Output only the rephrased sentence
- No comments, notes, or explanations
- Keep it concise and natural
- Use correct grammar and capitalization
- Do not add details not in the original`;
}

async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true, jsonParsed: true },
        where: { version: VERSION },
        orderBy: { id: "asc" },
        // take: 2
    });

    console.log(`Found ${sources.length} sources\n`);

    const processor = new OpenAIBatchProcessor<typeof sources[number]>({
        batchIdsFile: BATCH_ID_FILE
    });

    await processor.createAndSubmitBatches({
        sources,
        textExtractor: (source: typeof sources[number]): string[] => {
            const data = source.jsonParsed as RecipeJson;
            if (!data?.images?.length) {
                console.log(`⚠️ Source ${source.id}: No images found`);
                return [];
            }
            return data.images
                .map(p => p.alt)
                .filter((t): t is string => !!t && t.trim().length > 0);
        },
        promptMaker: makePrompt,
    });
    
    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("❌ Batch processing failed:", err);
    await prisma.$disconnect();
});
