import * as cheerio from 'cheerio';

export interface Ingredient {
    name: string;
    quantity?: string;
    unit?: string;
}


export function parseIngredients(htmlContent: string): Ingredient[] {
    const $ = cheerio.load(htmlContent);
    const ingredients: Ingredient[] = [];

    // Find all ingredient list items
    $('ul.structured-ingredients__list li.structured-ingredients__list-item').each((index, element) => {
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

            ingredients.push(ingredient);
        }
    });

    return ingredients;
}
