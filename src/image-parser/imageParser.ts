import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { downloadImageWithPuppeteer } from "../crawler/fetchHtmlPuppeteer";
import pLimit from 'p-limit';

const prisma = new PrismaClient();

// === Utils ===

function extract1500ImagesFromHtml(html: string): string[] {
    const regex = /https:\/\/www\.simplyrecipes\.com\/thmb\/[^\s"']+\/1500x\d+\/[^\s"']+\.(jpg|jpeg|png|webp)/gi;
    const matches = html.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
}

function extractTitleFromHtml(html: string): string | null {
    const $ = cheerio.load(html);
    return $('title').text() || null;
}

function slugifyUrl(url: string): string {
    try {
        const u = new URL(url);
        const parts = u.pathname.split('/').filter(Boolean);
        let slug = parts.pop() || "recipe";
        const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
        return `${slug}__${hash}`;
    } catch {
        return crypto.createHash('md5').update(url).digest('hex');
    }
}

function md5Hash(s: string) {
    return crypto.createHash('md5').update(s).digest('hex');
}

// === Main image download/DB logic ===



// ... rest of your code above

async function downloadImagesForRecipe(recipeId: number, recipeUrl: string, imageUrls: string[], baseDir = "images/simplerecipes") {
    if (imageUrls.length === 0) return;

    // 1. Fetch already-processed image hashes for this recipe
    const existingImages = await prisma.recipeImage.findMany({
        where: { recipeUrlId: recipeId },
        select: { imageUrlHash: true }
    });
    const existingHashes = new Set(existingImages.map(img => img.imageUrlHash));

    // 2. Prepare output folder
    const folder = path.join(baseDir, slugifyUrl(recipeUrl));
    await fs.mkdir(folder, { recursive: true });

    const seen = new Set<string>();
    const limit = pLimit(3); // Max 5 downloads in parallel per recipe

    await Promise.all(imageUrls.map((url, i) => limit(async () => {
        if (seen.has(url)) return;
        seen.add(url);

        const imageUrlHash = md5Hash(url);

        // A. If image is already in DB, skip immediately (NO delay!)
        if (existingHashes.has(imageUrlHash)) {
            console.log(`  Already processed (DB): ${url}`);
            return;
        }

        let base = path.basename(url.split("?")[0]);
        if (!base.match(/\.(jpg|jpeg|png|webp)$/i)) {
            base = `image${i + 1}.jpg`;
        }
        const filePath = path.join(folder, base);

        let downloaded = false;

        // B. Check if file exists on disk
        try {
            await fs.access(filePath);
            console.log(`  Skipping existing file ${base}`);
            downloaded = true;
        } catch {
            // C. Download image if not already on disk
            try {
                await downloadImageWithPuppeteer(url, filePath, recipeUrl);
                console.log(`  Saved ${base}`);
                downloaded = true;
            } catch (err) {
                console.error(`  Failed to download ${url}: ${(err as any).message}`);
            }
        }

        // D. If downloaded (or file already exists), save DB record
        if (downloaded) {
            try {
                await prisma.recipeImage.upsert({
                    where: {
                        recipeUrlId_imageUrlHash: {
                            recipeUrlId: recipeId,
                            imageUrlHash,
                        }
                    },
                    update: {},
                    create: {
                        recipeUrlId: recipeId,
                        imageUrl: url,
                        imageUrlHash,
                        altText: base
                    }
                });
            } catch (err: any) {
                if (!/Unique constraint failed/.test(err.message)) {
                    console.error(`  Failed to save image DB record: ${base} for recipe ${recipeId}`, err.message);
                }
            }
        }
    })));
}

// === Top-level control ===

async function main() {
    const recipes = await prisma.recipeUrl.findMany({
        where: {
            AND: [
                { htmlContent: { not: null } },
                { htmlContent: { not: '' } },
                //{ images: { none: {} } }   // <-- No related images
            ]
        },
        take: 800
    });

    for (const recipe of recipes) {
        const html = recipe.htmlContent!;
        const title = extractTitleFromHtml(html) || '(No title)';
        const urls = extract1500ImagesFromHtml(html);

        if (urls.length > 0) {
            console.log(`\n${title}\n${recipe.recipeUrl} (ID ${recipe.id}):`);
            urls.forEach(url => console.log('  ', url));
            await downloadImagesForRecipe(recipe.id, recipe.recipeUrl, urls);
        } else {
            console.log(`\n${title}\n${recipe.recipeUrl} (ID ${recipe.id}):`);
            console.log('  No matching images found.');
        }
    }

    await prisma.$disconnect();
}

main().catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
});
