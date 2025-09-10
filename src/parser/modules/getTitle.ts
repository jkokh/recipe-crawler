import * as cheerio from "cheerio";
import {Recipe} from "../types";

export const getTitle = ($article: cheerio.Cheerio, recipe: Recipe) => {
    const $title = $article.find('h1');
    $title.remove();
    const title = $title.text();
    return title;
}