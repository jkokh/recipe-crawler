import { buildSlug, toDisplayName } from "../lib/utils";
import { TAG_BLACKLIST } from "./blacklist";
import { processor } from "../lib/ai-pipeline/types";

export const normalize = processor<string, string[]>((jsonString: string) => {
    let tags: string[];

    try {
        tags = JSON.parse(jsonString);
    } catch (error) {
        throw new Error(`Failed to parse tags: ${error}`);
    }

    if (!Array.isArray(tags)) {
        throw new Error('Response is not an array');
    }

    const seen = new Set<string>();
    const out: string[] = [];

    for (const t of tags) {
        if (typeof t !== 'string') continue;
        const trimmed = t.trim().replace(/\s+/g, ' ');
        if (!trimmed) continue;
        const title = toDisplayName(trimmed);
        if (!title) continue;
        const slug = buildSlug(title);
        if (!slug || seen.has(slug) || TAG_BLACKLIST.has(slug)) continue;
        seen.add(slug);
        out.push(title);
        if (out.length >= 12) break;
    }

    if (out.length === 0) {
        throw new Error('No valid tags found');
    }

    return out;
});