import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const PAGE_SIZE = 200;

/**
 * Extract the trailing image "id" that SimplyRecipes puts before the extension.
 * Example:
 *  https://.../Simply-Recipes-LEAD-2-694603ab0e9d4a039e890df70465f597.jpg
 *  -> "694603ab0e9d4a039e890df70465f597.jpg" (or w/o .jpg if you prefer)
 *
 * We’ll keep the extension to be permissive (html_clean might include .webp vs .jpg).
 */
function extractImageIdFromUrl(url: string): string | null {
    try {
        const clean = url.split('?')[0];
        const base = clean.substring(clean.lastIndexOf('/') + 1); // filename.ext
        const dot = base.lastIndexOf('.');
        if (dot <= 0) return base; // no extension
        const name = base.slice(0, dot);
        const ext = base.slice(dot + 1).toLowerCase();

        // Find last hyphen segment (usual 32-hex hash)
        const parts = name.split('-');
        const last = parts[parts.length - 1];

        // Prefer the last segment if looks like a hash, else use whole base
        if (/^[a-f0-9]{16,64}$/i.test(last)) {
            return `${last}.${ext}`;
        }
        return base; // fallback to whole filename.ext
    } catch {
        return null;
    }
}

/**
 * From html_clean, build a map: imageId -> alt text
 * We look at both <img> and <noscript><img>.
 */
function buildAltMapFromHtmlClean(htmlClean: string): Map<string, string> {
    const $ = cheerio.load(htmlClean || '', { decodeEntities: false });
    const map = new Map<string, string>();

    const push = (src?: string, alt?: string) => {
        if (!src) return;
        const id = extractImageIdFromUrl(src);
        if (!id) return;
        const altText = (alt || '').trim();
        if (!altText) return;
        // First write wins (don’t overwrite if already set)
        if (!map.has(id)) map.set(id, altText);
    };

    $('img').each((_, el) => {
        const src = $(el).attr('src') || undefined;
        const alt = $(el).attr('alt') || undefined;
        push(src, alt);
    });

    $('noscript').each((_, ns) => {
        const html = $(ns).html() || '';
        const $frag = cheerio.load(html);
        const img = $frag('img').first();
        if (img.length) {
            push(img.attr('src') || undefined, img.attr('alt') || undefined);
        }
    });

    return map;
}

async function processPage(skip: number, take: number) {
    const recipes = await prisma.recipeUrl.findMany({
        select: {
            id: true,
            recipeUrl: true,
            htmlClean: true,
            images: {
                select: { id: true, imageUrl: true, altText: true },
            },
        },
        skip,
        take,
        orderBy: { id: 'asc' },
    });

    for (const r of recipes) {
        const altMap = buildAltMapFromHtmlClean(r.htmlClean || '');

        if (altMap.size === 0 || r.images.length === 0) continue;

        const updates: Promise<any>[] = [];

        for (const img of r.images) {
            const imgId = extractImageIdFromUrl(img.imageUrl);
            if (!imgId) continue;

            // Try strict match (exact filename.ext)
            let alt = altMap.get(imgId);

            // If not found, try loose match by just the hash part (drop extension)
            if (!alt) {
                const dot = imgId.lastIndexOf('.');
                const keyNoExt = dot > 0 ? imgId.slice(0, dot) : imgId;

                // scan keys for startsWith(hash) or includes
                for (const [k, v] of altMap.entries()) {
                    const kd = k.toLowerCase();
                    if (kd.includes(keyNoExt.toLowerCase())) {
                        alt = v;
                        break;
                    }
                }
            }

            if (alt && alt !== img.altText) {
                updates.push(
                    prisma.recipeImage.update({
                        where: { id: img.id },
                        data: { altText: alt },
                    })
                );
            }
        }

        if (updates.length) {
            await prisma.$transaction(updates as any);
            console.log(
                `Updated ${updates.length} alt_text(s) for recipe_url_id=${r.id}`
            );
        }
    }
}

async function main() {
    const total = await prisma.recipeUrl.count();
    console.log(`Total recipe_urls: ${total}`);

    for (let skip = 0; skip < total; skip += PAGE_SIZE) {
        console.log(`Processing ${skip}..${Math.min(skip + PAGE_SIZE, total)}...`);
        await processPage(skip, PAGE_SIZE);
    }

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
