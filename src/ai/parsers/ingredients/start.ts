import {Ingredient, parseIngredients} from "./parser";
import {ensureIngredientId, normalizeIngredientName} from "./ensureIngredient";
import {extractIngredientTextsFromArticle} from "./extract";
import {findIngredientId, LoadedIng, preloadIngredients} from "./ingredientMatch";
import {aiPipeline} from "./ai-pipeline";
import {iterate, prisma} from "../../../lib/iterator";
import {Recipe} from "../../../types";

type Source =  'DOM' | 'TEXT' | 'GPT' | 'OLLAMA';

type Row = {
    recipeId: number;
    ingredientId: number | null;
    text: string;
    source: Source;
};


let totalParsed = 0;
let totalMissing = 0;

// helper: build normalized text for RecipeIngredient.text
function buildIngredientText(i: Ingredient): string {
    const nameNorm = normalizeIngredientName(i.name);
    const parts = [i.quantity?.trim(), i.unit?.trim(), nameNorm].filter(Boolean);
    return parts.join(" ").replace(/\s+/g, " ").trim().slice(0, 255);
}

export async function process() {
    //await prisma.recipeIngredient.deleteMany();

    const preloadedIngredients: LoadedIng[] = await preloadIngredients();

    await iterate(prisma.recipe)
        .select({
            id: true,
            title: true,
            description: true,
            ingredients: true,
            recipeUrl: {
                select: {
                    htmlContent: true,
                    htmlClean: true,
                    json: true
                }
            }

        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            if (recipe.ingredients.length) {
                return;
            }
            const rows: Row[] = [];

            const html = recipe.sources?.htmlContent ?? "";
            const jsonObj = (() => { try { return recipe.sources!.json ?? null; } catch { return null; } })();

            const norm255 = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 255);

            const pushUnique = (ingredientId: bigint | null, text: string, source: Source) => {
                const t = norm255(text);
                if (!t) return;
                rows.push({ recipeId: recipe.id, ingredientId: Number(ingredientId), text: t, source });
            };

            const addFromParsed = async (ings: Ingredient[], source: Source) => {
                for (const ing of ings ?? []) {
                    const id = await ensureIngredientId(ing.name);
                    pushUnique(id, buildIngredientText(ing), source);
                }
            };

            const addFromLines = (lines: string[], source: Source) => {
                for (const line of lines ?? []) {
                    const id = findIngredientId(line, preloadedIngredients);
                    pushUnique(id, line, source);
                }
            };

            // --- Stage 1: HTML ---
            if (html) {
                await addFromParsed(parseIngredients(html), 'DOM');
            }

            // --- Stage 2: JSON block fallback ---
            if (!rows.length && jsonObj) {
                const lines = extractIngredientTextsFromArticle(jsonObj);
                addFromLines(lines, 'TEXT');
            }

            // --- Stage 3: AI fallback ---
            if (!rows.length && jsonObj) {
                const lines = await aiPipeline(recipe.recipeUrl!.htmlClean);
                addFromLines(lines, 'GPT');
            }

            // --- Insert & counters ---
            if (rows.length) {
                await prisma.recipeIngredient.deleteMany({
                    where: { recipeId: recipe.id }
                });
                await prisma.recipeIngredient.createMany({ data: rows });
                totalParsed++;
            } else {
                totalMissing++;
            }
        });


    console.log(
        '\x1b[32m%s\x1b[0m',
        `Parsed ${totalParsed} recipes, ${totalMissing} missing`
    );
}

async function main() {
    try {
        await process();
    } catch (error) {
        console.error('Error processing recipes:', error);
    }
}

void main();
