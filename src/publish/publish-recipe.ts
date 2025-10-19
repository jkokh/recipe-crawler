import "dotenv/config";
import slugify from "slugify";
import { PrismaClient as PrismaCrawler } from "@prisma/crawler";
import { PrismaClient as PrismaPublic } from "@prisma/public";

const crawler = new PrismaCrawler();
const pub = new PrismaPublic();

async function publishRecipe(recipeId: number) {
    const src = await crawler.source.findUnique({
        where: { id: recipeId },
        select: {
            id: true,
            jsonAltered: true,
        },
    });

    if (!src) {
        console.error(`❌ Recipe ${recipeId} not found.`);
        return;
    }

    const json = src.jsonAltered as any;
    if (!json) {
        console.error(`❌ Recipe ${recipeId} has no jsonAltered field.`);
        return;
    }

    // Check if already published
    const existing = await pub.recipe.findUnique({
        where: { sourceId: src.id },
    });

    if (existing) {
        console.log(`⚠️ Recipe ${recipeId} already published, skipping.`);
        return;
    }

    console.log(`📤 Publishing recipe ${recipeId}: ${json.title}`);

    await pub.recipe.create({
        data: {
            sourceId: src.id,
            title: json.title,
            slug: slugify(json.title, { lower: true, strict: true }),
            json,
            categories: {
                connect: (json.categories ?? []).map((id: number) => ({ id })),
            },
            tags: {
                connect: (json.tags ?? []).map((id: number) => ({ id })),
            },
            ingredients: {
                connect: (json.ingredients ?? [])
                    .map((i: any) => i.ingredientId)
                    .filter(Boolean)
                    .map((id: number) => ({ id })),
            },
        },
    });

    console.log(`✅ Published: ${json.title}`);
}

publishRecipe(1)
    .catch((err) => console.error(err))
    .finally(async () => {
        await crawler.$disconnect();
        await pub.$disconnect();
    });
