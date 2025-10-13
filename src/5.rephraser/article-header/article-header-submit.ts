// article-submit-headers.ts
import { prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import { BATCH_ID_FILE, VERSION } from "../../constants";

/** Prompt builder for paragraph headers */
function makePrompt(text: string): string {
    return `Rewrite this header/heading to be neutral and instructional using new wording.

Rules (apply silently):
- Remove first-person, nostalgia, speculation, and marketing tone
- Keep it concise and clear
- Preserve meaning and key terms
- Keep overall length similar; target 100% of the source characters (±20%)
- No newline characters
- Output ONLY the rewritten header. No notes or commentary

Header to rewrite:
${text}`;
}

async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true, jsonParsed: true },
        where: {
            version: VERSION
        },
        orderBy: { id: "asc" },
        //take: 2
    });

    console.log(`Found ${sources.length} sources\n`);

    const processor = new OpenAIBatchProcessor<typeof sources[number]>({
        batchIdsFile: BATCH_ID_FILE
    });

    await processor.createAndSubmitBatches({
        sources,
        textExtractor: (source: typeof sources[number]): string[] => {
            const data = source.jsonParsed as RecipeJson;
            if (!data?.paragraphs?.length) {
                return [];
            }
            return data.paragraphs
                .map(p => p.header)
                .filter((h): h is string => !!h && h.trim().length > 0);
        },
        promptMaker: makePrompt,
    });

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("❌ Batch processing failed:", err);
    await prisma.$disconnect();
});