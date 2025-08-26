import { iterate, prisma } from '../../iterator';
import { Prisma } from "@prisma/client";
import {Ingredient, parseIngredients} from "./parser";
import {ensureIngredientId, normalizeIngredientName} from "./ensureIngredient";
import {extractIngredientTextsFromArticle} from "./extract";
import {findIngredientId, LoadedIng, preloadIngredients} from "./ingredientMatch";

export type Recipe = Prisma.RecipeGetPayload<{
    select: {
        id: true
        title: true
        description: true
        recipeUrl: {
            select: {
                htmlContent: true,
                json: true
            }
        }
    }
}>
const result: number[] = [];

let totalParsed = 0;
let totalMissing = 0;
let noIngredients = 0;

// helper: build normalized text for RecipeIngredient.text
function buildIngredientText(i: Ingredient): string {
    const nameNorm = normalizeIngredientName(i.name);
    const parts = [i.quantity?.trim(), i.unit?.trim(), nameNorm].filter(Boolean);
    return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 255);
}

export async function process() {
    await prisma.recipeIngredient.deleteMany();

    const ingIndex: LoadedIng[] = await preloadIngredients();

    await iterate(prisma.recipe)
        .select({
            id: true,
            title: true,
            description: true,
            recipeUrl: {
                select: {
                    htmlContent: true,
                    json: true
                }
            }

        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            const ingredients = parseIngredients(recipe.recipeUrl!.htmlContent!);
            const rows: { recipeId: number; ingredientId: number | null; text: string }[] = [];
            if (!ingredients || ingredients.length === 0) {

                try {
                    const textLines = extractIngredientTextsFromArticle(
                        JSON.parse(recipe.recipeUrl!.json!)
                    );

                    for (const line of textLines) {
                        const ingredientId = findIngredientId(line, ingIndex); // may be null
                        const text = line.replace(/\s+/g, " ").trim().slice(0, 255);
                        rows.push({ recipeId: recipe.id, ingredientId, text });
                    }
                } catch {
                    console.log('not valid');
                }
                totalMissing++;
            }

            for (const ing of ingredients) {
                const ingredientId = await ensureIngredientId(ing.name); // ensure + validate inside

                const text = buildIngredientText(ing);
                rows.push({ recipeId: recipe.id, ingredientId, text });
            }

            if (rows.length) {
                await prisma.recipeIngredient.createMany({ data: rows });
            } else {
                noIngredients++;
            }

            totalParsed++;
        });
    console.log(
        '\x1b[32m%s\x1b[0m',
        `Parsed ${totalParsed} recipes, ${totalMissing} missing, no ingredients: ${noIngredients}`
    );
}

async function main() {
    try {
        await process();
        console.log("Marked: ", result);
    } catch (error) {
        console.error('Error processing recipes:', error);
    }
}

void main();
