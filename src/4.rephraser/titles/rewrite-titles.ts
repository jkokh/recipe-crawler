// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import {Recipe} from "../steps/types";
import {Source} from "@prisma/client";


export async function processRecipes() {
    const batchIdsFile = 'batch-ids.txt';

    await iterate(prisma.source)
        .select({
            id: true,
            recipeId: true,
            recipeUrl: true,
            jsonAltered: true,
            recipe: true
        })
        .where({
        })
        .orderBy({ id: 'asc' })
        .startPosition(1)
        .perPage(100)
        .entityName("recipes")
        .forEachAsync(async (recipeUrl: Source) => {
            const recipe: Recipe = recipeUrl.recipe;
            const json: RecipeJson = recipeUrl.jsonAltered;
            const newTitle = json.title;
            await prisma.recipe.update({
                where: { id: recipe.id },
                data: {
                    title: newTitle
                }
            });
        });

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
    console.log("\x1b[36m%s\x1b[0m", `Batch IDs written to: ${batchIdsFile}`);
}

void processRecipes();