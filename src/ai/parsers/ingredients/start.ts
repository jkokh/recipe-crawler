import {Ingredient} from "./parser";
import {ensureIngredientId, normalizeIngredientName} from "./ensureIngredient";
import {findIngredientId, LoadedIng, preloadIngredients} from "./ingredientMatch";
import {iterate, prisma} from "../../../lib/iterator";
import {Source} from "@prisma/client";
import {RecipeJson} from "../../../types";


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

    await iterate(prisma.source)
        .select({
            id: true,
            jsonParsed: true
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (source: Source) => {

            const jsonParsed = source.jsonParsed as RecipeJson;
            if (!jsonParsed.ingredients?.length) {
                return;
            }
            const rows: Row[] = [];


            const norm255 = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 255);

            const pushUnique = (ingredientId: bigint | null, text: string, source: Source) => {
                const t = norm255(text);
                if (!t) return;
                rows.push({ recipeId: source.id, ingredientId: Number(ingredientId), text: t, source });
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


            // --- Stage 2: JSON block fallback ---
            // const lines = extractIngredientTextsFromArticle(jsonObj);

            // --- Stage 3: AI fallback ---

            // --- Insert & counters ---
            /*if (rows.length) {
                await prisma.recipeIngredient.deleteMany({
                    where: { recipeId: source.id }
                });
                await prisma.recipeIngredient.createMany({ data: rows });
                totalParsed++;
            } else {
                totalMissing++;
            }*/
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
