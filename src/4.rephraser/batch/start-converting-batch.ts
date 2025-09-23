import { iterate, prisma } from "../../lib/iterator";
import {Prisma, RecipeUrl} from "@prisma/client";
import {Batch} from "../../types";


export async function process() {
    await iterate(prisma.recipeUrl)
        .select({
            id: true,
            json: true,
            batchId: true,
        })
        .where({

        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: RecipeUrl) => {

        });
    console.log("\x1b[32m%s\x1b[0m", "Result retrieval and JSON restoration complete");
}

void process();