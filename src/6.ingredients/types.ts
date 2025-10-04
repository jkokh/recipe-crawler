/*
Module: types
Purpose: Shared type definitions for the 6.ingredients pipeline.
- IngredientItem: shape of an ingredient line in recipe JSON (with optional quantity/unit and resolved ingredientId)
- RecipeJson: shape of the recipe JSON blob we read/update on sources
*/
export type IngredientItem = {
    name: string;
    quantity?: string;
    unit?: string;
    ingredientId?: number | null;
};

export type RecipeJson = {
    ingredients?: IngredientItem[] | null;
    title?: string;
    paragraphs?: string[];
    steps?: string[];
    [key: string]: unknown;
};