import {iterate, prisma} from "../../../lib/iterator";
import {Recipe} from "@prisma/client";

let totalParsed = 0;
let totalMissing = 0;

async function syncRecipeImagesFromUrl(recipe: Recipe) {
    const src = recipe.sources?.images ?? [];
    if (!src.length) return false;

    await prisma.$transaction(
        src.map((img) => {
            let main = false;
            if (img.type && img.type!.includes('LEAD')) {
                main = true;
            }
            return prisma.sourceImage.upsert({
                where: {id: img.id},                   // ← keep same id as recipe_url_images.id
                update: {
                    alt: img.altText ?? null,
                    isLead: main
                },
                create: {
                    id: img.id,
                    alt: img.altText ?? null,
                    isLead: main
                },
            });
        }
    ));
    return true;
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
                    json: true,
                    images: true,
                }
            }

        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            await syncRecipeImagesFromUrl(recipe);
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
