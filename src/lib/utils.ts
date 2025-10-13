import pluralize from "pluralize";
import crypto from "crypto";


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

export function cryptoHash(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex');
}

