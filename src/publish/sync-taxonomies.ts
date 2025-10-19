import "dotenv/config";
import { PrismaClient as PrismaCrawler } from "@prisma/crawler";
import { PrismaClient as PrismaPublic } from "@prisma/public";

const crawler = new PrismaCrawler();
const pub = new PrismaPublic();

async function syncCategories() {
    console.log("🔄 Syncing categories");

    const categories = await crawler.category.findMany();
    for (const cat of categories) {
        await pub.category.upsert({
            where: { slug: cat.slug },
            update: {
                id: cat.id,
                parentId: cat.parentId,
                title: cat.title,
            },
            create: {
                id: cat.id,
                parentId: cat.parentId,
                title: cat.title,
                slug: cat.slug
            },
        });
    }

    console.log(`✅ Synced ${categories.length} categories`);
}

async function syncTags() {
    console.log("🔄 Syncing tags");

    const tags = await crawler.tag.findMany();
    for (const tag of tags) {
        await pub.tag.upsert({
            where: { slug: tag.slug },
            update: {
                id: tag.id,
                name: tag.name,
            },
            create: {
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
            },
        });
    }

    console.log(`✅ Synced ${tags.length} tags`);
}

async function syncIngredients() {
    console.log("🔄 Syncing ingredients");

    const ingredients = await crawler.ingredient.findMany();
    for (const ing of ingredients) {
        await pub.ingredient.upsert({
            where: { slug: ing.slug },
            update: {
                id: ing.id,
                name: ing.name,
            },
            create: {
                id: ing.id,
                name: ing.name,
                slug: ing.slug,
            },
        });
    }

    console.log(`✅ Synced ${ingredients.length} ingredients`);
}

async function main() {
    await syncCategories();
    await syncTags();
    await syncIngredients();
}

main()
    .catch((err) => console.error(err))
    .finally(async () => {
        await crawler.$disconnect();
        await pub.$disconnect();
    });
