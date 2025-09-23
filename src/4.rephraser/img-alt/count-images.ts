// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeUrl } from "./types";
import { ClaudeBatchProvider } from "../../ai-providers/claude-batch";
import { RecipeJson } from "../../types";
import { appendFileSync } from "fs";


export async function processRecipes() {
    const batchIdsFile = 'batch-ids.txt';

    let  totalCount = 0;

    await iterate(prisma.recipeUrl)
        .select({
            id: true,
            recipeId: true,
            recipeUrl: true,
            json: true,
            jsonHistory: true
        })
        .where({
        })
        .orderBy({ id: 'asc' })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: RecipeUrl) => {
            const json = recipe.json as RecipeJson;
            const images = json?.images;
            if (!images?.length) {
                console.log(`NO IMAGES!!!!`);
                return;
            }

            if (images) totalCount += images!.length;
        });
    console.log(`Total images: ${totalCount}`);

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
    console.log("\x1b[36m%s\x1b[0m", `Batch IDs written to: ${batchIdsFile}`);
}

void processRecipes();