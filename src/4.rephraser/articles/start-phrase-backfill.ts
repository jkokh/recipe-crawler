import { prisma } from "../../lib/iterator";
import {RecipeJson} from "../../types";
import {ClaudeBatchProvider} from "../../lib/ai-providers/claude-batch";
import {PhraseService} from "../../lib/Phrase";

type Paragraph = { text?: string; [k: string]: any };

const claude = new ClaudeBatchProvider();

type Item = { id: string; name: string };

const phraseService = new PhraseService();

function getIdByName(items: Item[], name: string): string | undefined {
    return items.find(item => item.name === name)?.id;
}

export async function process() {
    try {
        console.log("Starting process...");

        const sources = await prisma.source.findMany({
            select: {
                id: true,
                batchId: true,
                json: true
            },
            take: 50
        });

        console.log(`Found ${sources.length} sources to process`);

        for (const recipe of sources) {
            console.log(`Processing recipe ${recipe.id}`);

            const batchId = getIdByName(recipe!.batchId as any, 'article');
            if (!batchId) {
                console.log(`Recipe ${recipe.id}: no batchId, skipping`);
                continue;
            }

            try {
                const results = await claude.getBatchResults(batchId);
                const parsed = recipe.json as RecipeJson;
                const paragraphs: Paragraph[] | null = parsed?.paragraphs;

                if (!Array.isArray(paragraphs)) {
                    console.log(`Recipe ${recipe.id}: No paragraphs to update, skipping`);
                    continue;
                }

                // Store paragraphs with proper awaiting
                const storePromises = paragraphs.map(async (_paragraph, index) => {
                    const result = results.find(r => r.customId === String(index));

                    if (result && result.status === "completed" && result.result) {
                        try {
                            await phraseService.store({
                                phrase: result.result,
                                sourceId: recipe.id,
                                type: 'paragraph',
                                version: `claudebatch-${result.customId}`
                            });
                            return true;
                        } catch (err) {
                            console.error(`Failed to store paragraph ${result.customId} for recipe ${recipe.id}:`, err);
                            return false;
                        }
                    }
                    return false;
                });

                const storeResults = await Promise.all(storePromises);
                const storedCount = storeResults.filter(Boolean).length;

                console.log(`Recipe ${recipe.id}: Stored ${storedCount}/${results.length} paragraphs`);

            } catch (err: any) {
                console.error(`Error processing recipe ${recipe.id} (batch ${batchId}):`, err?.message ?? err);
            }
        }

        console.log("\x1b[32m%s\x1b[0m", "Paragraph storage complete");
    } catch (err: any) {
        console.error('Critical error in process:', err?.message ?? err);
        throw err;
    }
}
void process();