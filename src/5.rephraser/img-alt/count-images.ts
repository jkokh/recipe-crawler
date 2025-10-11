// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeJson } from "../../types";
import {Source} from "@prisma/client";


export async function processRecipes() {
    let  totalCount = 0;

    await iterate(prisma.source)
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
        .forEachAsync(async (recipe: Source) => {
            const json = recipe.jsonParsed as RecipeJson;
            const images = json?.images;
            if (!images?.length) {
                console.log(`NO IMAGES!!!!`);
                return;
            }

            if (images) totalCount += images!.length;
        });
    console.log(`Total images: ${totalCount}`);
}

void processRecipes();