export const prompts = [
    `You are a function that outputs JSON only.

TASK
From DATA TO PROCESS, get an array of ingredient lines from this recipe. i.e. I want to receive an array of ingredients.

QUALIFYING LINE (any ONE is enough)
1) Starts with a quantity token: integers/decimals ("1", "1.5"), mixed numbers ("1 1/2"), fractions ("1/2", "¼", "⅔"), or ranges ("2–3", "2 to 3"), optionally followed by a unit/packaging word.
2) Contains a unit/packaging word: cup(s), tablespoon(s)/tbsp, teaspoon(s)/tsp, ounce(s)/oz, pound(s)/lb(s), gram(s)/g, kg, ml, liter(s)/l, clove(s), stick(s), slice(s), can(s), jar(s), bottle(s), bag(s), package/pkg.
3) Short single-ingredient noun phrase. Examples: "Boursin cheese", "Whole grain bread", "Fresh basil leaves", "Kosher salt", "Unsalted butter".

OUTPUT FORMAT (STRICT)
Return ONLY a valid JSON object of this exact shape:
{ "ingredients": ["..."] }

If none qualify, return:
{ "ingredients": [] }

DATA TO PROCESS:
<%data%>`
];
