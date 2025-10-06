import { CategoryManager } from "../lib/CategoryManager";
import { iterate, prisma } from "src/lib/iterator";
import { RecipeJson } from "../types";
import {CategoryProcessor} from "../lib/CategoryProcessor";
import {querier} from "./querier";
import {Source} from "@prisma/client";

export async function process(): Promise<void> {
    const categoryManager = new CategoryManager(prisma);
    await categoryManager.loadCategories();

    const processor = new CategoryProcessor(categoryManager);

    let sourcesWithoutCategories = 0;
    let sourcesSkipped = 0;

    try {
        await iterate(prisma.source)
            .select({
                id: true,
                jsonParsed: true
            })
            .startPosition(1)
            .perPage(50)
            .forEachAsync(async (source: Source) => {
                const json = source!.jsonParsed as RecipeJson;

                // Skip if jsonParsed is null
                if (!json) {
                    console.warn(`[${source.id}] Skipped (no jsonParsed data)`);
                    sourcesSkipped++;
                    return;
                }

                // Skip if categories already exist
                if (json.categories && json.categories.length > 0) {
                    sourcesSkipped++;
                    return;
                }

                const categoryString = processor.getCategories(source);
                const ids = await querier(json, categoryString);

                console.log(`\n=== Source ID: ${source.id}, ${json.title} ===`);
                console.log(categoryString);
                console.log('Result:');
                console.log(ids);

                if (ids.length === 0) {
                    sourcesWithoutCategories++;
                }

                const updatedJson = {
                    ...json,
                    categories: ids
                };

                await prisma.source.update({
                    where: { id: source.id },
                    data: {
                        jsonParsed: updatedJson as any
                    }
                });
            });

        console.log(`\nTotal recipes with no matching categories: ${processor.noLeafCategoriesCount}`);
        console.log(`Sources without categories: ${sourcesWithoutCategories}`);
        console.log(`Sources skipped (already had categories): ${sourcesSkipped}`);
        console.log("\x1b[32m%s\x1b[0m", "Category scoring complete");
    } finally {
        await categoryManager.disconnect();
    }
}

void process();