import * as cheerio from "cheerio";
import {Ingredient} from "../../types";


interface IngredientsResult {
    data: Ingredient[] | null;
    needsReview: boolean;
}

export const getIngredients = ($article: cheerio.Cheerio): IngredientsResult => {

    const $ = cheerio.load($article[0]);
    const $ingredients = $('.section--ingredients ul.structured-ingredients__list li.structured-ingredients__list-item');

    if (!$ingredients.length) {
        return { data: null, needsReview: false };
    }

    const data: Ingredient[] = [];
    const needsReview = false;

    // Find all ingredient list items
    $ingredients.each((_index, element) => {
        const $item = $(element);

        // Extract ingredient parts
        const name = $item.find('[data-ingredient-name="true"]').text().trim();
        const quantity = $item.find('[data-ingredient-quantity="true"]').text().trim();
        const unit = $item.find('[data-ingredient-unit="true"]').text().trim();

        if (name) {
            const ingredient: Ingredient = { name };

            // Only add quantity and unit if they exist and are different from name
            if (quantity && quantity !== name) {
                ingredient.quantity = quantity;
            }
            if (unit && unit !== name && unit !== quantity) {
                ingredient.unit = unit;
            }

            data.push(ingredient);
        }
    });

    $ingredients.remove();

    return { data: data.length ? data : null, needsReview };


}