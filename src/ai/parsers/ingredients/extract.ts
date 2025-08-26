type Normalizer = (s: string) => string;

// Simple signals that a line is an ingredient-ish line
const FRACTIONS = "¼½¾⅓⅔⅛⅜⅝⅞";
const LEAD_QTY = new RegExp(
    `^\\s*(?:\\d+(?:\\.\\d+)?|\\d+\\s+\\d+/\\d+|\\d+/\\d+|[${FRACTIONS}]|\\d+\\s*(?:to|-|–|—)\\s*\\d+)\\b`,
    "i"
);
const UNIT_WORDS = /\b(cups?|tablespoons?|tbsp|teaspoons?|tsp|ounces?|oz|pounds?|lb|lbs|grams?|g|kg|milliliters?|ml|liters?|l|cloves?)\b/i;

function stripNotes(s: string): string {
    // keep only before first comma, drop parenthetical notes
    return s.split(",")[0].replace(/\([^)]*\)/g, "").trim();
}

function looksLikeIngredient(line: string): boolean {
    const t = line.trim();
    if (!t) return false;
    return LEAD_QTY.test(t) || UNIT_WORDS.test(t);
}

// pick lists where ≥60% of items look like ingredients and at least 3 items
function pickIngredientLists(doc: any): string[][] {
    const out: string[][] = [];
    const paras: any[] = doc?.article?.paragraphs ?? [];
    for (const p of paras) {
        const lists: any[] = p?.lists ?? [];
        for (const lst of lists) {
            const items: string[] = lst?.items ?? [];
            if (items.length < 3) continue;
            const score = items.filter(looksLikeIngredient).length / items.length;
            if (score >= 0.6) out.push(items);
        }
    }
    return out;
}

export function extractIngredientTextsFromArticle(
    doc: any,
    opts?: { normalize?: Normalizer }
): string[] {
    const lists = pickIngredientLists(doc);
    const normalize = opts?.normalize;
    const out: string[] = [];

    for (const items of lists) {
        for (let line of items) {
            line = stripNotes(line);
            if (!line) continue;
            if (normalize) line = normalize(line); // e.g. normalizeIngredientName
            line = line.replace(/\s+/g, " ").trim().slice(0, 255);
            out.push(line);
        }
    }
    return out;
}
