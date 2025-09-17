import { Prisma } from "@prisma/client";

export type Step = { title: string; instructions: string; images: string[] };

export type Recipe = Prisma.RecipeGetPayload<{
    select: {
        id: true;
        title: true;
        description: true;
        ingredients: true;
        steps: true;
        recipeUrl: {
            select: {
                id: true;
                htmlContent: true;
                json: true;
                images: true;
            };
        };
    };
}>;
