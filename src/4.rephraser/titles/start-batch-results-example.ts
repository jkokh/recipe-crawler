import "dotenv/config";

import { readFileSync } from "fs";
import { prisma } from "../../lib/iterator";
import { ClaudeBatchProvider } from "../../lib/ai-providers/claude-batch";
import { PhraseService } from "../../lib/Phrase";
import { GPTProvider } from "../../lib/ai-providers/gpt";

const claude = new ClaudeBatchProvider();
const phraseService = new PhraseService();
const gpt = new GPTProvider();

function makePrompt(title: string, json: any): string {
    const jsonStr = JSON.stringify(json);
    return `
Rewrite this recipe title to be clear, descriptive, and SEO-friendly.
Avoid generic adjectives like "delicious" or "tasty."
Return only the rewritten title.

TITLE: ${title}
DATA: ${jsonStr}
  `.trim();
}

async function fetchSourceData(sourceId: number): Promise<any> {
    const source = await prisma.source.findUnique({
        where: { id: sourceId },
        select: { json: true, jsonParsed: true, recipeUrl: true }
    });
    if (!source) return null;
    const data: any = source.jsonParsed || source.json;
    if (!data || typeof data !== "object") return { url: source.recipeUrl };
    const { title, paragraphs } = data as { title?: string; paragraphs?: unknown };
    return title || paragraphs ? { title, paragraphs } : { url: source.recipeUrl };
}

export async function process() {
    const batchIds = readFileSync("batch-ids.txt", "utf8")
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    console.log(`Processing ${batchIds.length} batch(es)`);

    for (const batchId of batchIds) {
        console.log(`--- Batch ${batchId} ---`);
        try {
            const results = await claude.getBatchResults(batchId);

            for (const result of results) {
                const sourceId = parseInt(result.customId, 10);
                if (typeof result.result !== "string") {
                    console.error(`❌ Non-string result for sourceId ${sourceId}`);
                    continue;
                }
                const title1 = result.result;

                try {
                    await phraseService.store({
                        phrase: title1,
                        sourceId,
                        type: "title",
                        version: "2.0 claude batch"
                    });
                } catch (storeErr: any) {
                    if (storeErr?.message?.includes("Unique constraint failed")) {
                        console.warn(`Duplicate for sourceId ${sourceId}, using GPT fallback`);
                        try {
                            const sourceData = await fetchSourceData(sourceId);
                            if (!sourceData) {
                                console.error(`❌ No source data for sourceId ${sourceId}`);
                                continue;
                            }

                            const gptRaw = await gpt.ask(makePrompt(title1, sourceData));
                            if (typeof gptRaw !== "string") {
                                console.error(`❌ GPT returned non-string for sourceId ${sourceId}`);
                                continue;
                            }

                            await phraseService.store({
                                phrase: gptRaw,
                                sourceId,
                                type: "title",
                                version: "2.0 gpt rewritten"
                            });

                            console.log(`✅ GPT fallback stored for sourceId ${sourceId}`);
                        } catch (gptErr: any) {
                            console.error(`❌ GPT fallback failed for sourceId ${sourceId}:`, gptErr?.message ?? gptErr);
                        }
                    } else {
                        console.error(`❌ Store error for sourceId ${sourceId}:`, storeErr?.message ?? storeErr);
                    }
                }
            }
        } catch (err: any) {
            console.error(`❌ Batch error ${batchId}:`, err?.message ?? err);
        }
    }

    console.log("\x1b[32m%s\x1b[0m", "Done!");
}

void process();
