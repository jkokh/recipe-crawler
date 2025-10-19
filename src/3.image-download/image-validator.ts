/**
 * Recipe Image Validator
 *
 * Validates all SourceImage records using Sharp to check file integrity.
 * Resets downloaded=false for missing/corrupt images for re-download.
 *
 * SAFE TO RUN REPEATEDLY:
 * - Read-only validation (doesn't delete files)
 * - Validates all images (including new ones)
 * - Only updates database for invalid images
 */

import { PrismaClient } from '@prisma/crawler';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pLimit from 'p-limit';

const prisma = new PrismaClient();

async function isReallyValidImage(filePath: string): Promise<boolean> {
    try {
        await sharp(filePath).metadata();
        await sharp(filePath).raw().toBuffer({ resolveWithObject: false });
        return true;
    } catch {
        return false;
    }
}

async function main() {
    const baseDir = 'images/simplerecipes';
    const concurrency = 8; // Number of images to validate in parallel

    // Get all RecipeImages with their parent RecipeUrl in one query
    const images = await prisma.sourceImage.findMany({
        select: { id: true, url: true, stableId: true, sourceId: true },
    });

    const limit = pLimit(concurrency);

    // Track results for summary
    let totalImages = images.length;
    let validImages = 0;
    let missingImages = 0;
    let corruptImages = 0;
    let processed = 0;

    console.log(`Starting validation of ${totalImages} images...`);

    await Promise.all(
        images.map(img => limit(async () => {
            const folder = path.join(baseDir, img.sourceId!.toString());
            const base = img.stableId!.toString() + '.jpg';
            const filePath = path.join(folder, base);

            let valid;
            let fileExists = false;

            try {
                await fs.access(filePath);
                fileExists = true;
                valid = await isReallyValidImage(filePath);
                if (valid) {
                    validImages++;
                } else {
                    corruptImages++;
                }
            } catch {
                valid = false;
                missingImages++;
            }

            if (!valid) {
                const status = fileExists ? 'CORRUPT' : 'MISSING';
                console.log(`[${status}] ${filePath}`);

                await prisma.sourceImage.update({
                    where: { id: img.id },
                    data: { downloaded: false }
                });
            }

            // Progress update every 100 images
            processed++;
            if (processed % 100 === 0 || processed === totalImages) {
                console.log(`Progress: ${processed}/${totalImages} (${((processed / totalImages) * 100).toFixed(1)}%)`);
            }
        }))
    );

    // Brief execution report
    const totalInvalid = missingImages + corruptImages;
    console.log('\n=== IMAGE VALIDATION REPORT ===');
    console.log(`Total images processed: ${totalImages}`);
    console.log(`Valid images: ${validImages}`);
    console.log(`Invalid images: ${totalInvalid}`);
    console.log(`  - Missing files: ${missingImages}`);
    console.log(`  - Corrupt files: ${corruptImages}`);
    console.log(`Success rate: ${((validImages / totalImages) * 100).toFixed(1)}%`);
    console.log('===============================\n');

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});