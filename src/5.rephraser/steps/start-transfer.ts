import {iterate, prisma} from "../../lib/iterator";
import {Prisma, RecipeStep} from "@prisma/client";
import {Recipe} from "../../types";
import {RecipeJson} from "../../types";

export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            recipeUrl: true,
            steps: true
        })
        //.where({ id: 4 })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {

            if (recipe.steps.length && recipe.sources?.json) {
                const json = recipe.sources.json as RecipeJson;

                if (json.steps) {
                    // Update steps with alt text
                    json.steps.forEach((step, index) => {
                        const dbStep = recipe.steps.find(s => s.order === index);
                        if (dbStep?.titleAlt && dbStep?.textAlt) {
                            step.title = dbStep.titleAlt;
                            step.instructions = dbStep.textAlt;
                        }
                    });

                    // Update database
                    await prisma.source.updateMany({
                        where: { recipeId: recipe.id },
                        data: { jsonParsed: json as Prisma.InputJsonValue }
                    });
                }
            }
        });

    console.log('\x1b[32m%s\x1b[0m', `Parsed`);
}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();