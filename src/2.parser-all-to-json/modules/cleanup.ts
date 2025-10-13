import * as cheerio from "cheerio";

export function cleanup($article: cheerio.Cheerio): cheerio.Cheerio {
    const $ = cheerio.load($article[0]);
    // Remove figure captions with owner/credit info
    $('figure .article-caption-owner').remove();
    $('figure .caption-owner').remove();
    $('figure .credit').remove();
    $('figure .photo-credit').remove();
    return $article;
}