import { Prisma } from "@prisma/client";

export type Source = 'DOM' | 'TEXT' | 'GPT' | 'OLLAMA';

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
                htmlClean: true;
                htmlContent: true;
                json: true;
                images: true;
            };
        };
    };
}>;

export type NutritionJSON = {
    servings?: string | number | null;
    rows?: NutritionJSONRow[] | null;
};

export type NutritionJSONRow = {
    label?: string | null;
    value?: string | number | null;
};

export type NutritionRow = { recipeId: number; label: string; value: string };
