import * as cheerio from "cheerio";
import {RecipeMeta} from "../types";

export const getRecipeMeta = ($article: cheerio.Cheerio): RecipeMeta | null => {
    const $ = cheerio.load($article[0]);

    const $recipeBlock = $('.recipe-block__meta');

    if (!$recipeBlock.length) {
        return null;
    }

    const meta: RecipeMeta = {};

    // Extract title
    const title = $recipeBlock.find('.recipe-block__header').text().trim();
    if (title) {
        meta.title = title;
    }


    const prepTime = $recipeBlock.find('.prep-time .meta-text__data').text().trim();
    if (prepTime) {
        meta.prepTime = prepTime;
    }

    // Total time
    const totalTime = $recipeBlock.find('.total-time .meta-text__data').text().trim();
    if (totalTime) {
        meta.totalTime = totalTime;
    }

    // Servings
    const servings = $recipeBlock.find('.recipe-serving .meta-text__data').text().trim();
    if (servings) {
        meta.servings = servings;
    }

    // Yield
    const yield_ = $recipeBlock.find('.recipe-yield .meta-text__data').text().trim();
    if (yield_) {
        meta.yield = yield_;
    }

    // Remove the processed elements
    $recipeBlock.remove();

    return Object.keys(meta).length > 0 ? meta : null;
};