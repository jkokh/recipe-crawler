import {Recipe} from "../../types";
import crypto from 'crypto';
import {prisma} from "../../lib/iterator";
import {Source} from "@prisma/client";

export function getSimplyDataSrc(el: cheerio.Cheerio): string[] {
    const urls: string[] = [];

    el.find("img").each((_, img) => {
        // Try multiple sources in order of preference
        const url = (img as any).attribs["data-src"] ||
            (img as any).attribs["src"] ||
            (img as any).attribs["data-hi-res-src"];

        if (url && /^https:\/\/www\.simplyrecipes\.com\/thmb\/.+\/1500x0\/filters:/.test(url)) {
            urls.push(url);
        }
    });

    return urls;
}

export function getImageIds(imageUrls: string[], source: Source): number[] {
    const src = (source as any).recipeUrlImage ?? [];
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

export function cryptoHash(str: string, algorithm: 'md5' | 'sha1' | 'sha256' = 'sha256'): string {
    return crypto.createHash(algorithm).update(str).digest('hex');
}

export async function getRewrittenPhrase(text: string): Promise<string | null> {
    const hash = cryptoHash(text);
    const phrase = await prisma.phrase.findUnique({
        where: { hash }
    });
    if (!phrase) return null;
    return phrase.text;
}

export async function storePhrase(oldText: string, newText: string): Promise<void> {
    if (!oldText || oldText.trim().length === 0) return;
    if (!newText || newText.trim().length === 0) return;

    const hash = cryptoHash(oldText); // Hash from OLD string

    try {
        await prisma.phrase.upsert({
            where: { hash },
            create: {
                hash,
                text: newText.trim() // Store NEW string
            },
            update: {}, // Don't update if exists
        });
        console.log(`✅ Stored phrase with hash: ${hash.substring(0, 8)}... | "${oldText}" -> "${newText}"`);
    } catch (error) {
        console.error(`❌ Failed to store phrase: ${error}`);
    }
}

const sha1 = (s: string) => crypto.createHash("sha1").update(s).digest("hex");

function normalizeUrl(raw: string): string {
    const u = new URL(raw);
    u.hash = "";
    return u.toString();
}

function getStableId(url: string): string {
    return sha1(normalizeUrl(url));
}
