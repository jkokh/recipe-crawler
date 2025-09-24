import 'dotenv/config';
import { readFileSync } from "fs";
import {prisma} from "../../lib/iterator";
import {RecipeJson} from "../../types";
import {ClaudeBatchProvider} from "../../lib/ai-providers/claude-batch";

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

                // Group results by recipe ID for batch processing
                const resultsByRecipe: { [recipeId: string]: { imageIndex: number, altText: string }[] } = {};

                for (const result of results) {
                    if (result.status === 'completed' && result.result) {
                        const [recipeIdStr, imageIndexStr] = result.customId.split('_');
                        const recipeId = recipeIdStr;
                        const imageIndex = parseInt(imageIndexStr);

                        if (!resultsByRecipe[recipeId]) {
                            resultsByRecipe[recipeId] = [];
                        }

                        resultsByRecipe[recipeId].push({
                            imageIndex,
                            altText: result.result
                        });
                    }
                }

                // Update each recipe
                for (const [recipeIdStr, imageResults] of Object.entries(resultsByRecipe)) {
                    const recipeId = parseInt(recipeIdStr);

                    const recipe = await prisma.source.findUnique({
                        where: { id: recipeId }
                    });

                    if (recipe) {
                        const json = recipe.json as RecipeJson;

                        // Update image alt texts
                        if (json.images && json.images.length) {
                            imageResults.sort((a, b) => a.imageIndex - b.imageIndex);

                            for (const { imageIndex, altText } of imageResults) {
                                if (json.images[imageIndex]) {
                                    const oldAlt = json.images[imageIndex].alt;
                                    json.images[imageIndex].alt = altText;

                                    console.log(`\n📸 Recipe ${recipeId}, Image ${imageIndex}:`);
                                    console.log(`  FROM: "${oldAlt}"`);
                                    console.log(`  TO:   "${altText}"`);
                                }
                            }
                        }

                        await prisma.source.update({
                            where: { id: recipeId },
                            data: { json: json as any }
                        });

                        console.log(`Updated recipe ${recipeId} with ${imageResults.length} image alt texts`);
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