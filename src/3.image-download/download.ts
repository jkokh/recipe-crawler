/**
 * Image Download Script for Recipe Sources
 *
 * Downloads images from recipe sources using Puppeteer and stores them locally.
 * Processes SourceImage records where downloaded=false.
 *
 * SAFETY & RERUNNING:
 * - SAFE TO RUN MULTIPLE TIMES: Checks existing files before downloading
 * - IDEMPOTENT: Skips downloaded images (file size > 0)
 * - RESUMABLE: Retries failed downloads on subsequent runs
 * - CLEANUP: Removes empty/failed files automatically
 *
 * BEHAVIOR WITH NEW IMAGES:
 * - New images in the database picked up on next run
 * - Only processes where `downloaded = false`
 * - Sets `downloaded = true` after successful download
 *
 * FILE ORGANIZATION:
 * - Saves to: images/simplerecipes/{sourceId}/{stableId}.{ext}
 * - Supports: jpg, jpeg, png, webp (defaults to .jpg)
 *
 * CONCURRENCY:
 * - Uses p-limit for concurrent downloads (default: 5)
 * - Prevents overwhelming target servers
 *
 * ERROR HANDLING:
 * - Handles network failures, invalid URLs, file system errors
 * - Progress logging every 10 downloads
 */

import {PrismaClient, SourceImage} from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import pLimit from 'p-limit';
import {downloadImageWithPuppeteer} from "../lib/fetchHtmlPuppeteer";

const prisma = new PrismaClient();

function getFileExtensionFromUrl(url: string): string {
    try {
        const urlPath = new URL(url).pathname;
        const ext = path.extname(urlPath);
        return ext.match(/\.(jpg|jpeg|png|webp)$/i) ? ext : '.jpg';
    } catch {
        return '.jpg';
    }
}

async function getFileSize(filePath: string): Promise<number> {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch {
        return 0; // File doesn't exist
    }
}

async function downloadSingleImage(img: Partial<SourceImage>, baseDir: string, referrer: string): Promise<{ success: boolean; error?: string }> {
    if (!img.url || !img.sourceId) {
        return { success: false, error: 'Missing image URL or source ID' };
    }

    const folder = path.join(baseDir, img.sourceId.toString());
    const ext = getFileExtensionFromUrl(img.url);
    const filePath = path.join(folder, `${img.stableId}${ext}`);

    try {
        // Check existing file
        const existingSize = await getFileSize(filePath);
        if (existingSize > 0) {
            console.log(`[SKIPPED] ${filePath} (${existingSize} bytes)`);
            await prisma.sourceImage.update({
                where: { id: img.id },
                data: { downloaded: true }
            });
            return { success: true };
        }

        // Remove empty file if exists
        if (existingSize === 0) {
            await fs.unlink(filePath).catch(() => {});
        }

        // Download
        await fs.mkdir(folder, { recursive: true });
        await downloadImageWithPuppeteer(img.url, filePath, referrer);

        // Verify download
        const downloadedSize = await getFileSize(filePath);
        if (downloadedSize === 0) {
            throw new Error('Downloaded file is empty');
        }

        console.log(`[DOWNLOADED] ${filePath} (${downloadedSize} bytes)`);
        await prisma.sourceImage.update({
            where: { id: img.id },
            data: { downloaded: true }
        });

        return { success: true };

    } catch (err: any) {
        console.log(`[FAILED] ${filePath}: ${err.message}`);

        // Clean up empty file
        const failedSize = await getFileSize(filePath);
        if (failedSize === 0) {
            await fs.unlink(filePath).catch(() => {});
        }

        return { success: false, error: err.message };
    }
}

async function main() {
    const baseDir = 'images/simplerecipes';
    const CONCURRENT_LIMIT = 5;

    console.log(`Starting download with ${CONCURRENT_LIMIT} concurrent downloads\n`);

    const images = await prisma.sourceImage.findMany({
        select: {
            id: true,
            url: true,
            sourceId: true,
            stableId: true,
            source: { select: { recipeUrl: true } }
        },
        where: { downloaded: false }
    });

    console.log(`Found ${images.length} images to download`);
    if (images.length === 0) {
        await prisma.$disconnect();
        return;
    }

    let totalProcessed = 0;
    let successful = 0;
    let failed = 0;

    const limit = pLimit(CONCURRENT_LIMIT);
    const downloadPromises = images.map(img =>
        limit(async () => {
            const result = await downloadSingleImage(img, baseDir, img.source!.recipeUrl);

            totalProcessed++;
            result.success ? successful++ : failed++;

            if (totalProcessed % 10 === 0) {
                console.log(`Progress: ${totalProcessed}/${images.length} (${successful} successful, ${failed} failed)`);
            }

            return result;
        })
    );

    await Promise.all(downloadPromises);

    console.log(`\n✅ Complete: ${successful} successful, ${failed} failed`);
    await prisma.$disconnect();
}

main().catch(e => {
    console.error('Fatal error:', e);
    prisma.$disconnect();
    process.exit(1);
});