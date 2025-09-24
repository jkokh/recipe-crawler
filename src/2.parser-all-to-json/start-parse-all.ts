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
import {getRewrittenPhrase, storePhrase} from "./modules/parserUtils";
import {saveImages} from "./modules/saveImages";
import {GPTProvider} from "../lib/ai-providers/gpt";


const gpt = new GPTProvider({
    returnJsonStructure: { header: "string", text: "string" }
});

function makePrompt(title: string): string {
    return `Rewrite this recipe image alt text: ${title}
    
Do not include anything except the rewritten alt text.
Keep it concise and natural.
No comments or explanations. Return a rewritten string!`;
}


export async function process() {
    await iterate(prisma.source)
        .select({
            id: true,
            recipeUrl: true,
            json: true,
            htmlContent: true,
            recipeUrlImage: true

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

            let images = parseImages($article, source);
            images = images ?? [];
            const meta = getRecipeMeta($article, source);
            const title = getTitle($article, source);
            const ingredients = getIngredients($article);
            const nutrition = getNutrition($article, source);
            const steps = getSteps($article, source);
            const paragraphs = getParagraphs($article, source);

            const json = source.json as RecipeJson;
            images = await Promise.all(images.map(async (img) => {
                if (!img.alt) return img;
                const phrase = await getRewrittenPhrase(img.alt);
                if (phrase) {
                    img.alt = phrase;
                } else {
                    try {
                        const phrase = await gpt.ask<string>(makePrompt(img.alt));
                        await storePhrase(img.alt, phrase);
                        img.alt = phrase ?? img.alt;
                    } catch (e) {
                        console.error('Error processing image:', img.alt, e);
                    }
                }
                return img;
            }));
            images = await saveImages(images, source, prisma);
            const recipeParsed: any = {
                //title,
                //ingredients: ingredients.data,
                //nutrition,
                //steps: steps.data,
                //paragraphs,
                //meta,
                //categories: [],
                images
            }
            await prisma.source.update({
                where: {
                    id: source.id
                },
                data: {
                   // json: { ...recipeParsed,  ...json } as Prisma.InputJsonValue
                    json: { ...json, ...recipeParsed } as Prisma.InputJsonValue
                }
            });

        });

}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
