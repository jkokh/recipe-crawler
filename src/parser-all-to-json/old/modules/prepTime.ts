
import * as cheerio from 'cheerio';

interface RecipeMetadata {
    prepTime: string | null;
    cookTime: string | null;
    totalTime: string | null;
    servings: string | null;
    note?: string | null;
}

export const prepTime = (html: string): RecipeMetadata | null => {
    const $ = cheerio.load(html);

    // Extract timing information
    const prepTimeElement = $('.prep-time .meta-text__data').text().trim();
    const prepTime = prepTimeElement || null;

    const cookTimeElement = $('.cook-time .meta-text__data').text().trim();
    const cookTime = cookTimeElement || null;

    const totalTimeElement = $('.total-time .meta-text__data').text().trim();
    const totalTime = totalTimeElement || null;

    // Extract servings
    const servingsElement = $('.recipe-serving .meta-text__data').text().trim();
    const servings = servingsElement || null;

    // Extract note
    const noteElement = $('#recipe-block__note-text_1-0 p').text().trim();
    const note = noteElement || null;

    // Check if any essential fields were found (at least one timing field and servings)
    const hasEssentialData = prepTime || cookTime || totalTime || servings;

    if (!hasEssentialData) {
        return null;
    }

    return {
        prepTime,
        cookTime,
        totalTime,
        servings,
        note
    };
};