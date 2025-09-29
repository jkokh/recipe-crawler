export const prompts = [
    `You are a function that validates candidate categories for a recipe.

INPUT:
- CANDIDATE CATEGORIES: list of categories with id and name
- RECIPE: title, text, ingredients, steps

OUTPUT:
- Always return a single JSON object with key "categories"
- The value must be an array of numeric ids, e.g. { "categories": [12, 23, 34] }
- Preserve the original order of candidate categories; do not add new ones
- Remove only categories that are clearly irrelevant or explicitly contradicted
- !! Include Dairy only when dairy is a main component itself (e.g. milk, condensed milk, cheese, butter, cream, yogurt)
- Let's say dairy is a part Dessert, don't include it in Dessert category
- Broad ingredient categories (Fruits, Vegetables, Dairy, Grains) only if they are primary ingredients in title or core recipe; ignore if garnish, minor flavoring, or descriptive
- Low-alcohol still counts as Alcoholic Drinks

CANDIDATE CATEGORIES:
<%categories%>

RECIPE:
<%data%>`
];
