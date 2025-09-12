import cheerio from "cheerio";
import {Recipe} from "../../ai/parsers/steps/types";

export function getSimplyDataSrc(el: cheerio.Cheerio): string[] {
    const urls: string[] = [];

    el.find("img[data-src]").each((_, img) => {
        const url = (img as any).attribs["data-src"]; // use same Cheerio context
        if (url && /^https:\/\/www\.simplyrecipes\.com\/thmb\/.+\/1500x0\/filters:/.test(url)) {
            urls.push(url);
        }
    });

    return urls;
}

export function getImageIds(imageUrls: string[], recipe: Recipe): number[] {
    const src = recipe.recipeUrl?.images ?? [];
    if (!imageUrls?.length || !src.length) return [];
    const urlToId = new Map<string, number>();
    for (const img of src) if (img?.imageUrl && typeof img.id === 'number') urlToId.set(img.imageUrl, img.id);
    const out: number[] = [];
    const seen = new Set<number>();
    for (const url of imageUrls) {
        const id = urlToId.get(url);
        if (id != null && !seen.has(id)) { out.push(id); seen.add(id); }
    }
    return out;
}

export function hasLinks(el: cheerio.Cheerio): boolean {
    return el.find("a[href]").length > 0;
}

const STOP_PHRASES = [
    "read more",
    "continue reading",
    "see more",
    "show more",
    "view more",
    "click here",
    "next page",
    "previous page",
    "back to top",
    "sponsored content",
    "advertisement",
    "promo",
    "sign up",
    "join now",
    "follow us",
    "share this",
    "email",
    "Make It a Meal"
];

export function containsStopPhrase(text: string): boolean {
    return STOP_PHRASES.some(phrase =>
        new RegExp(`\\b${phrase}\\b`, "i").test(text)
    );
}

