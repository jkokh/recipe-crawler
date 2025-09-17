// src/lib/categoryScorer.ts
// Calculate category scores for a recipe using JSON keywords on each category.

export type CategoryKeywords = { positives?: string[]; negatives?: string[] };

export type CategoryRow = {
    id: number;
    parentId: number | null;
    title: string;
    slug: string;
    keywords: CategoryKeywords | null;
};

export type MinimalStep = {
    title: string;
    text: string;
    titleAlt?: string | null;
    textAlt?: string | null;
};

export type MinimalIngredient = { text: string };

export type MinimalRecipe = {
    id: number;
    title?: string | null;
    description?: string | null;
    steps?: MinimalStep[];
    ingredients?: MinimalIngredient[];
    recipeUrl?: {
        jsonAltered?: {
            paragraphs: {
                header?: string;
                text?: string;
                list?: string[];
            }[];
        }

    };
};

// ---------- config (tunable) ----------
const NEG_WEIGHT = 0.8; // penalty per negative hit

// SQUASH: use smoother rational curve instead of exp
const REL_K = 3.0;      // larger K => lower scores overall (try 2.5–4.0)

// per-field weights (title strongest, then ingredients, then body)
const W_TITLE_POS = 10.0;
const W_ING_POS   = 0.6;
const W_BODY_POS  = 0.7;

const W_TITLE_NEG = 7.0;
const W_ING_NEG   = 0.6;
const W_BODY_NEG  = 1.0;

// ---------- utils ----------
const basicNormalize = (s: string) =>
    (s || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

// Very small “stemmer” for plural/singular and a few food irregulars.
const IRREGULAR_SINGULAR: Record<string,string> = {
    tomatoes: "tomato",
    potatoes: "potato",
    leaves: "leaf",
    loaves: "loaf",
    knives: "knife",
    lives: "life",
    wives: "wife",
    geese: "goose",
    feet: "foot",
    men: "man",
    women: "woman",
    children: "child",
    berries: "berry",
    cherries: "cherry",
    cookies: "cookie",
    cheeses: "cheese",
    sauces: "sauce",
    spices: "spice",
    eggs: "egg",
    noodles: "noodle",
    pastas: "pasta",
    pizzas: "pizza",
    wings: "wing",
    breads: "bread",
};

function toSingular(word: string): string {
    if (!word) return word;
    if (IRREGULAR_SINGULAR[word]) return IRREGULAR_SINGULAR[word];
    if (/(ches|shes|xes|ses|zes)$/.test(word)) return word.replace(/es$/, "");
    if (/ies$/.test(word) && word.length > 3) return word.replace(/ies$/, "y");
    if (/oes$/.test(word)) return word.replace(/oes$/, "o");
    if (/s$/.test(word) && !/ss$/.test(word)) return word.replace(/s$/, "");
    return word;
}

function tokenize(s: string): string[] {
    const n = basicNormalize(s);
    return n ? n.split(" ") : [];
}

function singularizeText(s: string): string {
    const toks = tokenize(s).map(toSingular);
    return toks.join(" ");
}

const escapeRx = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

// COUNT ALL occurrences with word boundaries (was: boolean includes)
function boundaryCountAll(textNorm: string, phrases: string[]): number {
    let n = 0;
    for (const p of phrases) {
        const term = basicNormalize(p);
        if (!term) continue;
        const m = textNorm.match(new RegExp(`\\b${escapeRx(term)}\\b`, "g"));
        if (m) n += m.length;
    }
    return n;
}

function boundaryCountAllSingular(textSingular: string, phrases: string[]): number {
    let n = 0;
    for (const p of phrases) {
        const term = singularizeText(p);
        if (!term) continue;
        const m = textSingular.match(new RegExp(`\\b${escapeRx(term)}\\b`, "g"));
        if (m) n += m.length;
    }
    return n;
}

// NEW: field-aware scorer (title > ingredients > body) with plural/singular + count-all
function relevanceStrictWeighted(
    recipe: MinimalRecipe,
    bag: CategoryKeywords | null | undefined
) {
    const titleRaw = basicNormalize(recipe.title ?? "");
    const bodyRaw = basicNormalize(
        [
            ...(recipe.steps ?? []).map(
                s => `${s.title ?? ""} ${s.text ?? ""} ${s.titleAlt ?? ""} ${s.textAlt ?? ""}`
            ),
            ...(recipe.recipeUrl!.jsonAltered?.paragraphs ?? []).map(p => {
                if (p.text) return p.text;
                if (p.header) return p.header;
                if (Array.isArray(p.list)) return p.list.join(" ");
                return "";
            })
        ].join(" ")
    );

    const ingredRaw = basicNormalize((recipe.ingredients ?? []).map(i => i.text).join(" "));

    // Singularized variants for recall
    const titleSing  = singularizeText(titleRaw);
    const bodySing   = singularizeText(bodyRaw);
    const ingredSing = singularizeText(ingredRaw);

    const pos = bag?.positives ?? [];
    const neg = bag?.negatives ?? [];

    // Positives: boundary exact + boundary on singularized forms, counting all matches
    const titlePosHits =
        boundaryCountAll(titleRaw, pos) + boundaryCountAllSingular(titleSing, pos);
    const ingPosHits =
        boundaryCountAll(ingredRaw, pos) + boundaryCountAllSingular(ingredSing, pos);
    const bodyPosHits =
        boundaryCountAll(bodyRaw, pos) + boundaryCountAllSingular(bodySing, pos);

    // Negatives: conservative (boundary on raw only; count all)
    const titleNegHits = boundaryCountAll(titleRaw, neg);
    const ingNegHits   = boundaryCountAll(ingredRaw, neg);
    const bodyNegHits  = boundaryCountAll(bodyRaw, neg);

    const posHits = W_TITLE_POS * titlePosHits + W_ING_POS * ingPosHits + W_BODY_POS * bodyPosHits;
    const negHits = W_TITLE_NEG * titleNegHits + W_ING_NEG * ingNegHits + W_BODY_NEG * bodyNegHits;

    const rawBase = posHits - NEG_WEIGHT * negHits;
    const raw = Math.max(0, rawBase);

    // Early exit: no signal
    if (raw === 0) return { raw, rel: 0 };

    // Smooth squashing: rational form (no abrupt 0.878 plateau, slower saturation)
    const rel = raw / (raw + REL_K);

    return { raw, rel };
}

function normalizeIndex(scores: Record<number, number>) {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    const out: Record<number, number> = {};
    for (const [k, v] of Object.entries(scores)) out[+k] = sum ? v / sum : 0;
    return out;
}

// ---------- main API ----------
export type CategoryScores = {
    scores: Record<number, number>; // categoryId -> relevance [0,1]
    index: Record<number, number>;  // normalized distribution
    details: Record<number, { raw: number; relevance: number; title: string; slug: string }>;
};

/**
 * Calculate per-category scores for a recipe.
 * Pass in: the recipe (any fields you have) and the categories with keywords.
 */
export function scoreRecipeCategories(
    recipe: MinimalRecipe,
    categories: CategoryRow[]
): CategoryScores {
    const scores: Record<number, number> = {};
    const details: CategoryScores["details"] = {};

    for (const c of categories) {
        const { raw, rel } = relevanceStrictWeighted(recipe, c.keywords);
        scores[c.id] = rel;
        details[c.id] = { raw, relevance: rel, title: c.title, slug: c.slug };
    }

    const index = normalizeIndex(scores);
    return { scores, index, details };
}
