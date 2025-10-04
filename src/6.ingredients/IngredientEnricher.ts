/*
Module: IngredientEnricher
Purpose: Enriches existing ingredient items by assigning ingredientId based on name.
- Normalizes and slugifies each ingredient name
- Looks up the slug in the provided dictionary (slug → id)
- Returns the same items with ingredientId populated (or null when not found)
*/
import { IngredientNormalizer } from './IngredientNormalizer';
import { IngredientItem } from './types';

export class IngredientEnricher {
    static enrich(
        ingredients: IngredientItem[],
        dictionary: Map<string, bigint>
    ): IngredientItem[] {
        return ingredients.map(ing => {
            const rawName = ing?.name?.trim();

            if (!rawName) {
                return { ...ing, ingredientId: null };
            }

            const normalized = IngredientNormalizer.normalize(rawName);
            const slug = IngredientNormalizer.slugify(normalized);
            const ingredientId = dictionary.get(slug) || null;

            return {
                ...ing,
                ingredientId: ingredientId ? Number(ingredientId) : null
            };
        });
    }
}