import { iterate, prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import { appendFileSync } from "fs";
import {ClaudeBatchProvider} from "../../lib/ai-providers/claude-batch";
import {Source} from "@prisma/client";

const claude = new ClaudeBatchProvider();

function makePrompt(title: string): string {
    return `Rephrase this recipe image alt text: ${title}

RULES (apply silently):
- Output only the rephrased sentence
- No comments, notes, or explanations
- Keep it concise and natural
- Use correct grammar and capitalization
- Do not add details not in the original`;
}


export async function processRecipes() {
    const batchIdsFile = 'batch-ids.txt';

    await iterate(prisma.source)
        .select({
            id: true,
            recipeId: true,
            recipeUrl: true,
            jsonParsed: true,
        })
        .where({
        })
        .orderBy({ id: 'asc' })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .getPageResults(async (source: Source[]) => {
            try {
                const requests: { customId: string; prompt: string }[] = [];
                source.forEach((source) => {
                    const json = source.jsonParsed as RecipeJson;
                    json.images!.forEach((img, index) => {
                        const customId = source.id.toString() + '_' + index;
                        requests.push({
                            customId, prompt: makePrompt(img.alt)
                        });
                    });
                });
                const batchId = await claude.submitBatch(requests);
                const logEntry = `${batchId}\n`;
                try {
                    appendFileSync(batchIdsFile, logEntry);
                } catch (fileErr) {
                    console.error('Error writing to batch IDs file:', fileErr);
                }
                console.log(`Recipes: submitted batch ${batchId} and saved to file`);
            } catch (err: any) {
                console.error(`Error processing recipe batch:`, err?.message ?? err);

                // Log the error to file as well
                const errorEntry = `${new Date().toISOString()} - ERROR: ${err?.message ?? err}\n`;
                try {
                    appendFileSync(batchIdsFile, errorEntry);
                } catch (fileErr) {
                    console.error('Error writing error to batch IDs file:', fileErr);
                }
            }
        });

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
    console.log("\x1b[36m%s\x1b[0m", `Batch IDs written to: ${batchIdsFile}`);
}

void processRecipes();