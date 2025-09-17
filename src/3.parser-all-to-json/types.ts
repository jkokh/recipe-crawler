import { Prisma } from "@prisma/client";

export type Recipe = Prisma.RecipeGetPayload<{
    select: {
        id: true;
        slug: true;
        title: true;
        description: true;
        seo: true;
        createdAt: true;
        updatedAt: true;
        recipeUrl: { select: {
                json: true,
                recipeUrl: true
                htmlContent: true
            } }
        steps: {
            select: {
                id: true;
                order: true;
                title: true;
                text: true;
                titleAlt: true;
                textAlt: true;
            };
        };
        ingredients: {
            select: {
                id: true;
                text: true;
                createdAt: true;
                updatedAt: true;
            };
        };
        categories: true;
        tags: {
            select: {
                tag: {
                    select: {
                        id: true;
                        name: true;
                        slug: true;
                    };
                };
            };
        };
        images: {
            select: {
                id: true;
                altText: true;
                main: true;
                order: true;
            };
        };
    };
}>;


export interface Ingredient {
    name: string;
    quantity?: string;
    unit?: string;
}

export type NutritionRow = {
    label: string;
    value?: string;
};

export type Nutrition = {
    servings: string;
    rows: NutritionRow[];
}

export type Paragraph = {
    header?: string;
    text?: string;
    list?: string[];
    images?: number[];
}

export type Step = {
    title: string;
    instructions: string;
    images?: number[];
}

export interface RecipeMeta {
    title?: string;
    prepTime?: string;
    totalTime?: string;
    servings?: string;
    yield?: string;
}

