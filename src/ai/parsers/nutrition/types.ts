import { Prisma } from "@prisma/client";

export type Source = 'DOM' | 'TEXT' | 'GPT' | 'OLLAMA';

export type Row = {
    recipeId: number;
    ingredientId: number | null;
    text: string;
    source: Source;
};

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
