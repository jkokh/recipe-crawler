import { prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import {BATCH_ID_FILE, VERSION} from "../../constants";

/** Strict, deterministic prompt for content review */
function makePrompt(text: string): string {
    return `You are a compliance reviewer.

TASK:
Scan the following text and check if it contains ANY of the following:
1. Personal information (names, emails, phone numbers, addresses)
2. References to specific people or individuals
3. Attributions or credits (authors, photographers, contributors)
4. Copyright notices or statements
5. Brand names or product mentions (e.g., Simply Recipes, AllRecipes, etc.)
6. Website URLs or social media handles
7. First-person language (I, we, my, our)
8. Personal anecdotes tied to specific people

RESPONSE RULES:
- If you find ANY such content → respond **only** with:
  FOUND: [very brief description of each issue]
- If there are NO such issues → respond **only** with:
  CLEAN
- Do NOT include any extra text, explanations, or summaries.

RESPONSE FORMAT:
Your reply must be exactly one short line:
Either "CLEAN" or "FOUND: <issues>".

Text to review:
---
${text}
---`;
}

async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true, jsonAltered: true },
        //where: { flagged: true, checked: false },
        where: { version: VERSION },
        orderBy: { id: "asc" },
    });

    console.log(`Found ${sources.length} flagged sources\n`);

    if (sources.length === 0) {
        console.log("No flagged sources to process");
        await prisma.$disconnect();
        return;
    }

    const processor = new OpenAIBatchProcessor<typeof sources[number]>({
        batchIdsFile: BATCH_ID_FILE,
    });

    await processor.createAndSubmitBatches({
        sources,
        textExtractor: (source: typeof sources[number]): string[] => {
            const data = source.jsonAltered as RecipeJson;
            delete (data as any).images;
            delete (data as any).categories;
            delete (data as any).tags;
            return [JSON.stringify(data)];
        },
        promptMaker: makePrompt,
    });

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("❌ Content review submission failed:", err);
    await prisma.$disconnect();
});
