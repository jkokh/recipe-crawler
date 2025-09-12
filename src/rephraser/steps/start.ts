import {iterate, prisma} from "../../lib/iterator";
import {Prisma, RecipeStep} from "@prisma/client";
import {querier} from "./querier";
import {Recipe} from "./types";
import {RecipeJson} from "../../types";

function verifyStepReplacements(
    updatedJsonAltered: RecipeJson,
    stepsByOrder: Map<number, RecipeStep>,
    recipeId: number
): { passed: boolean; replacementCount: number } {
    let verificationPassed = true;
    let replacementCount = 0;

    updatedJsonAltered.steps!.forEach((verifiedStep, index) => {
        const dbStep = stepsByOrder.get(index);
        if (dbStep && dbStep.titleAlt && dbStep.textAlt) {
            if (verifiedStep.title !== dbStep.titleAlt || verifiedStep.instructions !== dbStep.textAlt) {
                console.error(`❌ Verification failed for recipe ${recipeId}, step ${index}`);
                console.error(`Expected title: "${dbStep.titleAlt}", got: "${verifiedStep.title}"`);
                console.error(`Expected instructions: "${dbStep.textAlt}", got: "${verifiedStep.instructions}"`);
                verificationPassed = false;
            } else {
                replacementCount++;
            }
        }
    });

    return { passed: verificationPassed, replacementCount };
}


export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            recipeUrl: true,
            steps: true
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {

            if (recipe.steps.length && recipe.recipeUrl?.jsonAltered) {
                const jsonAltered = recipe.recipeUrl.jsonAltered as RecipeJson;

                // Create a map of recipe steps by order for quick lookup
                const stepsByOrder = new Map<number, RecipeStep>();
                recipe.steps.forEach(step => {
                    stepsByOrder.set(step.order, step);
                });

                // Update jsonAltered.steps with titleAlt and textAlt
                const updatedSteps = jsonAltered.steps!.map((jsonStep, index) => {
                    const dbStep = stepsByOrder.get(index);
                    if (dbStep && dbStep.titleAlt && dbStep.textAlt) {
                        return {
                            ...jsonStep,
                            title: dbStep.titleAlt,
                            instructions: dbStep.textAlt
                        };
                    }
                    return jsonStep;
                });

                // Update the jsonAltered object
                const updatedJsonAltered = {
                    ...jsonAltered,
                    steps: updatedSteps
                };

                // Verification test - check updatedJsonAltered in memory
                const verification = verifyStepReplacements(updatedJsonAltered, stepsByOrder, recipe.id);

                if (verification.passed) {
                    console.log(`✅ Verification passed for recipe ${recipe.id} - ${verification.replacementCount} steps successfully replaced`);
                } else {
                    console.error(`❌ Verification failed for recipe ${recipe.id}`);
                    return;
                }

                await prisma.recipeUrl.update({
                     where: {
                         id: recipe.recipeUrl.id
                     },
                     data: {
                         jsonAltered: updatedJsonAltered as Prisma.InputJsonValue
                     }
                 });

                console.log(`Updated recipe ${recipe.id} with ${updatedSteps.length} steps`);
            }

        });

    console.log('\x1b[32m%s\x1b[0m', `Parsed`);
}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();