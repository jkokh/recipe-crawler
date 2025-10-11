import { prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import {BATCH_ID_FILE, VERSION} from "../../constants";

/** Prompt builder */
function makePrompt(text: string): string {
    return `Rewrite the text to be neutral and instructional using new wording.

Rules (apply silently):
- Remove first-person, nostalgia, speculation, and marketing tone
- Preserve all facts, measurements, times, and proper nouns exactly; do not add details.
- Keep overall length similar to the original; target 100% of the source characters (±20%)
- No newline characters
- Output ONLY the rewritten text. No headings, notes, or commentary

Text to rewrite:
${text}`;
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
        batchIdsFile: BATCH_ID_FILE,
    });

    await processor.createAndSubmitBatches({
        sources,
        textExtractor: (source: typeof sources[number]): string[] => {
            const data = source.jsonParsed as RecipeJson;
            if (!data?.steps?.length) {
                console.log(`⚠️ Source ${source.id}: No steps found`);
                return [];
            }
            return data.steps
                .map(p => p.instructions)
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
