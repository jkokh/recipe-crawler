import pluralize from "pluralize";
import {prisma} from "../../../lib/iterator";
import {buildSlug} from "../../../lib/utils";

const STOPWORDS = new Set([
    // General language
    "a","an","the","and","or","if","of","to","for","with","without","on","in","into","from","by","at","as",

    // Cooking filler
    "about","approx","approximately","optional","needed","desired","taste",
    "room-temperature",

    // Measurements
    "cup","cups","tablespoon","tablespoons","tbsp","teaspoon","teaspoons","tsp",
    "ounce","ounces","oz","pound","pounds","lb","lbs",
    "gram","grams","g","kg","ml","milliliter","milliliters","liter","liters","l",
    "pinch","dash","package","pkg","can","cans","bottle","bottles","jar","jars","bag","bags"
]);


export function singularizeWords(name: string): string {
    return name
        .split(/\s+/)
        .map(word => pluralize.singular(word))
        .join(" ");
}


function normSlug(name: string): string {
    return buildSlug(name)!.normalize("NFC").slice(0, 255);
}

export function cleanIngredientName(raw: string): string {
    return raw.split(",")[0].trim();
}


function countWords(str: string): number {
    return str
        .trim()
        .split(/\s+/)
        .flatMap(w => w.split("-"))
        .filter(Boolean).length;
}

export function isValidIngredientName(name: string): boolean {
    const cleaned = name.trim();

    // allow only letters, dashes, spaces
    if (!/^[A-Za-z- ]+$/.test(cleaned)) return false;

    // must start and end with a letter
    if (!/^[A-Za-z].*[A-Za-z]$/.test(cleaned)) return false;

    // total alphabetic characters must be >= 3 (blocks "C", "AA", etc.)
    if (cleaned.replace(/[^A-Za-z]/g, "").length < 3) return false;

    // stopwords anywhere -> reject
    const words = cleaned.toLowerCase().split(/\s+/);
    if (words.some(w => STOPWORDS.has(w)) || STOPWORDS.has(cleaned.toLowerCase())) return false;

    // max 5 words (hyphen splits count as words)
    return countWords(cleaned) < 5;
}


export async function ensureIngredientId(name: string): Promise<bigint | null> {
    name = cleanIngredientName(name);
    name = singularizeWords(normalizeIngredientName(name)); // normalize before validating
    if (!isValidIngredientName(name)) return null;          // validate after normalization

    const slug = normSlug(name);
    if (!slug) return null;

    try {
        const ing = await prisma.ingredient.upsert({
            where: { slug },
            update: { name },
            create: { slug, name },
            select: { id: true },
        });
        return ing.id;
    } catch (e: any) {
        if (e.code === "P2002") {
            const existing = await prisma.ingredient.findUnique({
                where: { slug },
                select: { id: true },
            });
            return existing?.id ?? null;
        }
        throw e;
    }
}


export function normalizeIngredientName(name: string): string {
    return name
        .trim()
        .split(/\s+/) // split on spaces
        .map(word =>
            word
                .split("-") // also split on hyphens
                .map(part => {
                    if (!part) return part;
                    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                })
                .join("-")
        )
        .join(" ").trim().slice(0, 255);
}