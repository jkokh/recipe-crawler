import { iterate, prisma } from '../../iterator';
import {NutritionJSON, NutritionRow, Recipe} from "./types";


let totalParsed = 0;
let totalMissing = 0;

async function upsertRecipeMetaString(recipeId: number, key: string, value: string) {
    await prisma.recipeMeta.upsert({
        where: { recipeId_key: { recipeId, key } },
        update: { value: value as any }, // works for Json or String column
        create: { recipeId, key, value: value as any },
    });
}

const fit255 = (s: unknown) =>
    String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, 255);

function normalizeNutritionRows(
    n: NutritionJSON | null | undefined,
    recipeId: number
): NutritionRow[] {
    if (!n?.rows || !Array.isArray(n.rows)) return [];
    return n.rows
        .map((r) => ({
            recipeId,
            label: fit255(r?.label),
            value: fit255(r?.value),
        }))
        .filter((r) => r.label.length > 0);
}


export async function process() {
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
            const jsonObj = (() => { try { return JSON.parse(recipe.recipeUrl?.json ?? "null"); } catch { return null; } })();
            console.log(jsonObj.nutrition);

            const nutri: NutritionJSON | null = jsonObj?.nutrition ?? null;

            if (!nutri) {
                totalMissing++;
                return;
            }

            // 1) Save servings to recipe_meta (store as string for portability)
            if (nutri.servings != null && nutri.servings !== '') {
                await upsertRecipeMetaString(recipe.id, 'servings', String(nutri.servings));
            }

            // 2) Replace nutrition rows for this recipe
            const rows: NutritionRow[] = normalizeNutritionRows(nutri, recipe.id);
            await prisma.nutrition.deleteMany({ where: { recipeId: recipe.id } });
            if (rows.length) {
                await prisma.nutrition.createMany({ data: rows });
            }

            totalParsed++;


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
