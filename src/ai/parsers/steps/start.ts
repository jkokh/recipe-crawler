import { iterate, prisma } from '../../iterator';
import {Recipe, Source, Step} from './types';
import {pl} from "./pipeline";

function getImageIdsForTheStep(stepImageUrls: string[], recipe: Recipe): number[] {
    const src = recipe.recipeUrl?.images ?? [];
    if (!stepImageUrls?.length || !src.length) return [];
    const urlToId = new Map<string, number>();
    for (const img of src) if (img?.imageUrl && typeof img.id === 'number') urlToId.set(img.imageUrl, img.id);
    const out: number[] = [];
    const seen = new Set<number>();
    for (const url of stepImageUrls) {
        const id = urlToId.get(url);
        if (id != null && !seen.has(id)) { out.push(id); seen.add(id); }
    }
    return out;
}

let totalParsed = 0;
let totalMissing = 0;

export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            steps: true,
            recipeUrl: {
                select: {
                    json: true,
                    images: { select: { id: true, imageUrl: true } },
                    htmlClean: true
                },
            },
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            if (recipe.steps && recipe.steps.length) {
                return;
            }
            let steps: Step[] = (() => {
                try {
                    const j = JSON.parse(recipe.recipeUrl?.json ?? 'null');
                    return (j?.steps?.steps ?? j?.steps ?? []) as Step[];
                } catch { return []; }
            })();
            let source: Source = 'DOM';



            await prisma.$transaction(async (tx) => {
                // 1) Unlink any existing step-image relations for this recipe
                await tx.recipeImage.updateMany({
                    where: { recipeId: recipe.id },
                    data: { stepId: null },
                });

                // 2) Replace steps
                await tx.recipeStep.deleteMany({ where: { recipeId: recipe.id } });

                for (let i = 0; i < steps.length; i++) {
                    const s = steps[i];
                    const title = (s.title ?? '').replace(/:\s*$/, '').trim();
                    const created = await tx.recipeStep.create({
                        data: {
                            recipeId: recipe.id,
                            order: i,
                            text: s.instructions,
                            title,
                            source
                        },
                        select: { id: true },
                    });

                    const imageIds = getImageIdsForTheStep(s.images ?? [], recipe);
                    if (imageIds.length) {
                        await tx.recipeImage.updateMany({
                            where: { id: { in: imageIds } },
                            data: { stepId: created.id },
                        });
                    }
                }
            });

            totalParsed++;
        });

    console.log('\x1b[32m%s\x1b[0m', `Parsed ${totalParsed} recipes, ${totalMissing} missing`);
}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
