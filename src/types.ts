import {SourceImage} from "@prisma/crawler";


export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition?: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta?: RecipeMeta | null;
    categories?: number[];
    tags?: number[];
    images: SourceImage[] | null;
}

export type ImagesParsed = {
    id?: number;
    stableId: string;
    url: string;
    alt: string;
    lead: boolean;
}

export type IngredientItem = {
    name: string;
    quantity?: string;
    unit?: string;
    ingredientId?: number | null;
};


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


