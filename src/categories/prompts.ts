export const prompts = [
    `You are a function that validates categories for a recipe.

INPUTS:
- CATEGORIES: list of categories with id and name
- RECIPE: title, text, ingredients, steps

OUTPUT:
- Always return a single JSON object with key "categories"
- The value must be an array of numeric ids, e.g. { "categories": [12, 23, 34] }
- Keep all valid categories as is, remove only irrelevant ones
- If none are valid, return { "categories": [] }

CATEGORIES:
<%categories%>

RECIPE:
<%data%>`
];
