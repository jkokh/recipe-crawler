import * as cheerio from "cheerio";
import {iterate, prisma} from "../lib/iterator";
import {getTitle} from "./modules/getTitle";
import {getIngredients} from "./modules/getIngredients";
import {getNutrition} from "./modules/getNutrition";
import {getSteps} from "./modules/getSteps";
import {getParagraphs} from "./modules/getParagraphs";
import {getRecipeMeta} from "./modules/getMeta";
import {RecipeJson} from "../types";
import {Prisma, Source} from "@prisma/client";
import {parseImages} from "./modules/getImages";
import {saveImages} from "./modules/saveImages";


export async function process() {
    await iterate(prisma.source)
        .select({
            id: true,
            recipeUrl: true,
            json: true,
            htmlContent: true,
            sourceImages: true
        })
        .where({

        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (source: Source) => {
            const html = source.htmlContent!;
            const $ = cheerio.load(html);
            const $article = $('article');

            let images = parseImages($article);
            images = await saveImages(images, source, prisma);

            const meta = getRecipeMeta($article, source);
            const title = getTitle($article, source);
            const ingredients = getIngredients($article);
            const nutrition = getNutrition($article, source);
            const steps = getSteps($article, source);
            const paragraphs = getParagraphs($article, source);
            const jsonParsed: RecipeJson = {
                title,
                ingredients: ingredients.data,
                nutrition,
                steps: steps.data,
                paragraphs,
                meta,
                categories: [],
                images
            }
            await prisma.source.update({
                where: {
                    id: source.id
                },
                data: {
                    jsonParsed: jsonParsed as Prisma.InputJsonValue
                }
            });
        });

}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
