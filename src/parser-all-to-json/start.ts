import {Recipe, RecipeJson} from "./types";
import * as cheerio from "cheerio";
import {iterate, prisma} from "../lib/iterator";
import {getTitle} from "./modules/getTitle";
import {getIngredients} from "./modules/getIngredients";
import {getNutrition} from "./modules/getNutrition";
import {getSteps} from "./modules/getSteps";
import {getParagraphs} from "./modules/getParagraphs";
import {getRecipeMeta} from "./modules/getMeta";

export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            steps: true,
            recipeUrl: {
                select: {
                    recipeUrl: true,
                    htmlContent: true,
                    json: true,
                    images: { select: { id: true, imageUrl: true } },
                    htmlClean: true
                },
            },
        })
/*        .where({
id: 73
        })*/
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            const html = recipe.recipeUrl!.htmlContent!;
            const $ = cheerio.load(html);
            const $article = $('article');

            const meta = getRecipeMeta($article, recipe);
            const title = getTitle($article, recipe);
            const ingredients = getIngredients($article);
            const nutrition = getNutrition($article, recipe);
            const steps = getSteps($article, recipe);
            const paragraphs = getParagraphs($article, recipe);

            const needsReview = ingredients.needsReview || steps.needsReview || paragraphs.needsReview;

            const recipeParsed: RecipeJson = {
                title,
                ingredients: ingredients.data,
                nutrition,
                steps: steps.data,
                paragraphs: paragraphs.data,
                meta,
                needsReview
            }

            // Save recipeParsed to the database
            await prisma.recipeUrl.update({
                where: {
                    recipeId: recipe.id
                },
                data: {
                    json: JSON.stringify(recipeParsed)
                }
            });


        });

}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
