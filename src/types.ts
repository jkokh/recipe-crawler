import {Ingredient, Nutrition, RecipeMeta, Step} from "./2.parser-all-to-json/types";
import {SourceImage} from "@prisma/client";


export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition?: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta?: RecipeMeta | null;
    categories?: number[];
    tags?: number[];
    images?: SourceImage[] | null;
}

export type ImagesParsed = {
    id?: number;
    stableId: string;
    url: string;
    alt: string;
    lead: boolean;
}

export type Paragraph = {
    header?: string;
    text?: string;
    list?: string[];
    images?: number[];
}

