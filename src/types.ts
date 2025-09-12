import {Ingredient, Nutrition, Paragraph, RecipeMeta, Step} from "./parser-all-to-json/types";

export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta: RecipeMeta | null;
    needsReview: boolean;
}