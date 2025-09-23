import { Prisma } from "@prisma/client";



export type RecipeUrl = Prisma.RecipeGetPayload<{
    select: {
        id: true,
        recipeId: true,
        recipeUrl: true,
        json: true,
        jsonHistory: true,
        batchId: true,
        recipe: {
            select: {
                title: true

            }
        }
    };
}>;
