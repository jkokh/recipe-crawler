import { iterate, prisma } from "../../lib/iterator";
import {Prisma} from "@prisma/client";
import {Recipe, RecipeJson} from "../../types";


export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            recipeUrl: true,
            categories: true
        })
        .where({

        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: Recipe) => {
            const json = recipe.recipeUrl!.json as RecipeJson;
            json.categories = recipe.categories.map(c => c.categoryId);
            await prisma.recipeUrl.update({
                where: { recipeId: recipe.id },
                data: {
                    json: json as Prisma.InputJsonValue
                }
            });
        });
    console.log("\x1b[32m%s\x1b[0m", "Result retrieval and JSON restoration complete");
}

void process();