import {Ingredient, Nutrition, Paragraph, RecipeMeta, Step} from "./parser-all-to-json/types";

export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition?: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta?: RecipeMeta | null;
    needsReview?: boolean;
}

export type Batch = {
    id: string;
    name: string;
}

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
                jsonAltered: true,
                recipeUrl: true
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
        categories: {
            select: {
                categoryId: true;
                score: true;
            };
        };
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
