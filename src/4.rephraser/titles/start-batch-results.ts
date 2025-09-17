import 'dotenv/config';
import {ClaudeBatchProvider} from "../../ai-providers/claude-batch";
import { readFileSync } from "fs";
import {prisma} from "../../lib/iterator";
import {RecipeJson} from "../../types";

const claude = new ClaudeBatchProvider();

export async function process() {
    try {
        const batchIds = readFileSync('batch-ids.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        console.log(`Found ${batchIds.length} batch IDs to process`);

        for (const batchId of batchIds) {
            console.log(`\n--- Processing batch: ${batchId} ---`);

            try {
                const results = await claude.getBatchResults(batchId);

                for (const result of results) {
                    const recipe = await prisma.recipeUrl.findUnique({
                        where: { id: parseInt(result.customId) }
                    });

                    if (recipe) {
                        const json = recipe.json as RecipeJson;
                        json.title = result.result!;

                        await prisma.recipeUrl.update({
                            where: { id: parseInt(result.customId) },
                            data: { json: json as any }
                        });

                        console.log(`Updated recipe ${result.customId}`);
                    }
                }
            } catch (err: any) {
                console.error(`Error with batch ${batchId}:`, err?.message ?? err);
            }
        }

        console.log("\x1b[32m%s\x1b[0m", "\nDone!");
    } catch (err: any) {
        console.error('Error:', err?.message ?? err);
    }
}

void process();