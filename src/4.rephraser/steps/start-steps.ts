import {iterate, prisma} from "../../lib/iterator";
import {RecipeStep} from "@prisma/client";
import {querier} from "./querier";

export async function process() {
    await iterate(prisma.recipeStep)
        .select({
            id: true,
            text: true,
            title: true,

        })
        .where({
/*            AND: [
                { titleAlt: null },
                { textAlt: null }
            ]*/
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (step: RecipeStep) => {

            const data: { header: string; text: string; } = await querier({
                title: step.title,
                content: step.text
            });

            /*
            TODO update json
            await prisma.$transaction(async (tx) => {
                // update textAlt, titleAlt
                await tx.recipeStep.update({
                    where: {
                        id: step.id
                    },
                    data: {
                        titleAlt: data.header,
                        textAlt: data.text
                    }
                });
            });*/

        });

    console.log('\x1b[32m%s\x1b[0m', `Parsed`);
}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
