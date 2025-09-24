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

