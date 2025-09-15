// generateRecipeTags.ts


import {ollama} from "./ollama";

type TagGenOpts = {
    model?: string;            // default: env or llama3.1:latest
    maxTags?: number;          // default: 12
    temperature?: number;      // default: 0.1
    top_p?: number;            // default: 0.9
    top_k?: number;            // default: 50
    num_predict?: number;      // default: 160
};

export async function generateRecipeTags(
    recipe: any,
    opts: TagGenOpts = {}
): Promise<string[]> {
    const model =
        opts.model ||
        process.env.OLLAMA_DEFAULT_MODEL ||
        'llama3.1:latest';

    const maxTags = Math.max(1, opts.maxTags ?? 12);

    // Few-shot system prompt to enforce structure & capitalized tags
    const system =
        'You are an expert food editor. ' +
        'You must output ONLY a JSON array of capitalized recipe tags. NO CAPSLOCK / NO UPPERCASE' +
        'Each tag is 1–3 words, relevant to cuisine, course, key ingredients, diet, method/equipment, or notable attributes (e.g., Sheet-Pan, 30-Minute). ' +
        'No hashtags, emojis, brand names, or generic words (e.g., "Tasty", "Food", "Recipe"). ' +
        'No duplicates. If nothing applies, return [].';
        'NEVER generate UPPERCASE tags like: THIS.';

    // Few-shot examples (raw JSON in, JSON array out). Keep short but clear.
    const examples = `
EXAMPLE 1 INPUT (RAW JSON):
{"title":"Easy Chicken Alfredo","ingredients":["chicken breast","fettuccine","cream","parmesan"],"totalTimeMinutes":25}

EXPECTED OUTPUT:
["Italian","Pasta","Chicken","Creamy","30-Minute","Dinner"]

EXAMPLE 2 INPUT (RAW JSON):
{"name":"Vegan Lentil Tacos","diet":["vegan"],"ingredients":["lentils","tortillas","avocado","tomato"],"method":"stovetop"}

EXPECTED OUTPUT:
["Mexican","Tacos","Lentil","Vegan","Weeknight","Dinner"]
`.trim();

    // Your raw recipe (no preprocessing)
    const rawJson = safeStringify(recipe);

    const prompt = [
        `Extract up to ${maxTags} relevant tags for the following recipe.`,
        'Return ONLY a JSON array of strings, nothing else.',
        '',
        examples,
        '',
        'NOW PROCESS THIS INPUT (RAW JSON):',
        rawJson
    ].join('\n');

    try {
        const response = await ollama.request(model, prompt, system, {
            temperature: opts.temperature ?? 0.1, // format adherence
            top_p: opts.top_p ?? 0.9,
            top_k: opts.top_k ?? 50,
            num_predict: opts.num_predict ?? 160,
            repeat_penalty: 1.1,                 // nudge against duplicates
            stop: ['\n\nEXPECTED OUTPUT:', '\nEXAMPLE', '\nNOW PROCESS'], // cut off explanations
        });

        // Expect strict JSON array
        const text = (response || '').trim();
        try {
            const parsed = JSON.parse(text);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            // Try to extract first top-level JSON array if model added noise
            const arr = extractFirstJsonArray(text);
            return arr ?? [];
        }
    } catch {
        return [];
    }
}

/* ------------------------------- utils ------------------------------- */

function safeStringify(v: any): string {
    try {
        return JSON.stringify(v);
    } catch {
        // Handle circulars gracefully
        const seen = new WeakSet();
        return JSON.stringify(v, (_k, val) => {
            if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) return '[Circular]';
                seen.add(val);
            }
            return val;
        });
    }
}

// Attempts to find the first balanced JSON array in text and parse it.
function extractFirstJsonArray(s: string): string[] | null {
    let depth = 0, start = -1;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '[') { if (depth === 0) start = i; depth++; }
        else if (ch === ']') {
            depth--;
            if (depth === 0 && start >= 0) {
                try {
                    const slice = s.slice(start, i + 1);
                    const parsed = JSON.parse(slice);
                    return Array.isArray(parsed) ? parsed : null;
                } catch { /* ignore and continue */ }
            }
        }
    }
    return null;
}
