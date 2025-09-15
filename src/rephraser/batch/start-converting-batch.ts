import { iterate, prisma } from "../../lib/iterator";
import { RecipeUrl } from "./types";
import {Prisma} from "@prisma/client";
import {Batch} from "../../types";


export async function process() {
    await iterate(prisma.recipeUrl)
        .select({
            id: true,
            articleBatchId: true,
            json: true,
            jsonAltered: true,
            batchId: true,
        })
        .where({

        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: RecipeUrl) => {
            const articleBatchId = recipe.articleBatchId as unknown as string;
            const batchId: Batch[] = [{
                id: articleBatchId,
                name: 'article'
            }];
            await prisma.recipeUrl.update({
                where: { id: recipe.id },
                data: {
                    batchId: batchId as Prisma.InputJsonValue
                }
            });
        });
    console.log("\x1b[32m%s\x1b[0m", "Result retrieval and JSON restoration complete");
}

void process();