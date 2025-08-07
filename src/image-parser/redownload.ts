import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { downloadImageWithPuppeteer } from "../crawler/fetchHtmlPuppeteer";
import pLimit from 'p-limit';

const prisma = new PrismaClient();

export function slugifyUrl(url: string): string {
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

function getFileExtensionFromUrl(url: string): string {
    try {
        const urlPath = new URL(url).pathname;
        const ext = path.extname(urlPath);
        return ext.match(/\.(jpg|jpeg|png|webp)$/i) ? ext : '.jpg';
    } catch {
        return '.jpg';
    }
}

async function downloadSingleImage(img: any, baseDir: string): Promise<{ success: boolean; error?: string }> {
    if (!img.recipeUrl) {
        return { success: false, error: 'No recipe URL' };
    }

    const folder = path.join(baseDir, img.recipeUrlId.toString());
    const ext = getFileExtensionFromUrl(img.imageUrl);
    const base = `image${img.id}${ext}`;
    const filePath = path.join(folder, base);

    try {
        // Check if file already exists
        try {
            await fs.access(filePath);
            console.log(`[SKIPPED] ${filePath} (already exists)`);

            // Mark as valid since file exists
            await prisma.recipeImage.update({
                where: { id: img.id },
                data: { valid: true }
            });

            return { success: true };
        } catch {
            // File doesn't exist, proceed with download
        }

        await fs.mkdir(folder, { recursive: true });
        await downloadImageWithPuppeteer(img.imageUrl, filePath, img.recipeUrl.recipeUrl);

        // Mark as valid after successful download
        await prisma.recipeImage.update({
            where: { id: img.id },
            data: { valid: true }
        });

        console.log(`[DOWNLOADED] ${filePath}`);
        return { success: true };

    } catch (err: any) {
        console.log(`[FAILED TO DOWNLOAD] ${filePath}: ${err.message || 'Unknown error'}`);
        return { success: false, error: err.message || 'Unknown error' };
    }
}

async function main() {
    const baseDir = 'images/simplerecipes';
    const CONCURRENT_LIMIT = 5; // Adjust based on server tolerance

    // Only fetch images marked as invalid (valid === false)
    const images = await prisma.recipeImage.findMany({
        where: { valid: false },
        include: { recipeUrl: { select: { recipeUrl: true } } }
    });

    if (images.length === 0) {
        console.log('No invalid images found to download.');
        await prisma.$disconnect();
        return;
    }

    console.log(`Found ${images.length} invalid images to download`);
    console.log(`Using ${CONCURRENT_LIMIT} concurrent downloads\n`);

    // Create concurrency limiter
    const limit = pLimit(CONCURRENT_LIMIT);

    let completed = 0;
    let successful = 0;
    let skipped = 0;

    // Process all images with controlled concurrency
    const results = await Promise.allSettled(
        images.map(img => limit(async () => {
            const result = await downloadSingleImage(img, baseDir);

            completed++;
            if (result.success) {
                if (result.error === undefined) {
                    successful++;
                } else {
                    skipped++;
                }
            }

            // Progress update every 10 images or at the end
            if (completed % 10 === 0 || completed === images.length) {
                console.log(`Progress: ${completed}/${images.length} (${successful} downloaded, ${skipped} skipped, ${completed - successful - skipped} failed)`);
            }

            return result;
        }))
    );

    // Final summary
    const totalSuccessful = results.filter(r =>
        r.status === 'fulfilled' && r.value.success
    ).length;

    const totalFailed = results.filter(r =>
        r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
    ).length;

    console.log(`\n✅ Download complete!`);
    console.log(`📊 Results: ${totalSuccessful} successful, ${totalFailed} failed out of ${images.length} total`);

    if (totalFailed > 0) {
        console.log(`⚠️  ${totalFailed} images failed to download and remain marked as invalid`);
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error('Fatal error:', e);
    prisma.$disconnect();
    process.exit(1);
});