import {Ingredient, Nutrition, RecipeMeta, Step} from "./2.parser-all-to-json/types";

export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition?: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta?: RecipeMeta | null;
    categories?: number[];
    tags?: number[];
    images?: ImagesParsed[] | null;
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
        sources: { select: {
                id: true,
                json: true,
                recipeUrl: true,
                images: true,
                htmlContent: true,
            } }
        steps: {
            select: {
                id: true;
                order: true;
                title: true;
                source: true;
                recipeId: true;
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


export type ImagesParsed = {
    id?: number;
    stableId: string;
    url: string;
    alt: string;
    lead: boolean;
}

export type RecipeUrl = Prisma.RecipeGetPayload<{
    select: {
        id: true,
        recipeId: true,
        recipeUrl: true,
        json: true,
        batchId: true,
        jsonAltered: true,
        recipe: {
            select: {
                title: true
            }
        }
    };
}>;

export type Source = Prisma.RecipeGetPayload<{
    select: {
        id: true,
        recipeId: true,
        recipeUrl: true,
        json: true,
        batchId: true,
        jsonAltered: true,
        htmlContent: true,
        images: true,
        recipe: {
            select: {
                id: true,
                title: true
            }
        }
    };
}>;

export interface TextParagraph {
    text: string;
}

export interface HeaderParagraph {
    header: string;
}

export interface ListParagraph {
    list: string[];
}

export interface ImagesParagraph {
    images: number[];
}

export type Paragraph = {
    header?: string;
    text?: string;
    list?: string[];
    images?: number[];
}

