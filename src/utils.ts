import pluralize from "pluralize";
import * as cheerio from "cheerio";

export const printRecipeReport = (steps: any, nutrition: any) => {
    // Steps information
    if (steps && steps.steps) {
        const totalImages = steps.steps.reduce((sum: number, step: any) => sum + (step.images?.length || 0), 0);
        console.log(`${steps.steps.length} steps, ${totalImages} images`);
    } else {
        console.log('❌ Steps: No steps found');
    }
    // Nutrition information
    if (nutrition && Array.isArray(nutrition.rows)) {
        const servings = `${nutrition.servings ? `${nutrition.servings}` : 'no'}`;
        console.log(`${servings} servings, ${nutrition.rows.length} nutrition facts`);
    } else {
        console.log('❌ No nutrition');
    }
    console.log('─'.repeat(80));
};

export function toDisplayName(input: string): string {
    if (!input) return '';
    return input
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word =>
            word
                .split('-')
                .map(part => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part)
                .join('-')
        )
        .join(' ');
}

export function buildSlug(raw: string): string | null {
    function keepAlnum(s: string): string {
        return s.replace(/[^a-z0-9]/g, '');
    }

    if (!raw || !raw.trim()) return null;

    const words = raw
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .toLowerCase()
        .trim()
        .split(/[\s\-_]+/) // split on spaces, hyphens, underscores
        .filter(Boolean);

    const cleaned = words
        .map(w => keepAlnum(pluralize.singular(keepAlnum(w))))
        .filter(Boolean);

    if (cleaned.length === 0) return null;

    // kebab-case
    const slug = cleaned.join('-');
    return slug || null;
}

export function kebab(s: string): string {
    return (s || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Attempts to find the first balanced JSON array in text and parse it.
export function extractFirstJsonArray(s: string): string[] {
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
                    return Array.isArray(parsed) ? parsed : [];
                } catch { /* ignore and continue */ }
            }
        }
    }
    return [];
}

