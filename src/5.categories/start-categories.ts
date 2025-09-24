import { CategoryManager } from "../lib/CategoryManager";
import { iterate, prisma } from "src/lib/iterator";
import {Recipe, RecipeJson} from "../types";
import {CategoryProcessor} from "../lib/CategoryProcessor";
import {querier} from "./querier";

export async function process(): Promise<void> {
    const categoryManager = new CategoryManager(prisma);
    await categoryManager.loadCategories();

    const processor = new CategoryProcessor(categoryManager);

    try {
        await iterate(prisma.recipe)
            .select({
                id: true,
                title: true,
                description: true,
                recipeUrl: { select: {
                    jsonAltered: true,
                    recipeUrl: true
                } },
                categories: true,
                steps: {
                    select: { title: true, text: true, titleAlt: true, textAlt: true },
                    orderBy: { order: "asc" }
                },
                ingredients: { select: { text: true } }
            })
            .where({
                categories: { none: {} }
            })
            .startPosition(1)
            .perPage(50)
            .entityName("recipes")
            .forEachAsync(async (recipe: Recipe) => {
                const categoryString = processor.getCategories(recipe);

                const json = recipe.sources!.json as RecipeJson;
                const result = await querier(json, categoryString);

                console.log(`\n=== ${recipe.title} ===`);
                console.log(categoryString);
                console.log('Result:');
                console.log(result);

                const ids = Array.isArray(result?.categories)
                    ? result.categories.filter((x: unknown) => Number.isInteger(x as number))
                    : [];

                if (ids.length > 0) {
                    await prisma.recipeCategory.createMany({
                        data: ids.map((categoryId: number) => ({
                            recipeId: recipe.id,
                            categoryId,
                        })),
                        skipDuplicates: true
                    });
                }

            });

        console.log(`\nTotal recipes with no matching categories: ${processor.noLeafCategoriesCount}`);
        console.log("\x1b[32m%s\x1b[0m", "Category scoring complete");
    } finally {
        await categoryManager.disconnect();
    }
}

void process();