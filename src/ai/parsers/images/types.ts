import {Prisma} from "@prisma/client";

export type Recipe = Prisma.RecipeGetPayload<{
    select: {
        id: true;
        title: true;
        description: true;
        ingredients: true;
        recipeUrl: {
            select: {
                htmlClean: true;
                htmlContent: true;
                json: true;
                images: true;
            };
        };
    };
}>;