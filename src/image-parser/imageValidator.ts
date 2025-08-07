import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import pLimit from 'p-limit';

const prisma = new PrismaClient();

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
    const images = await prisma.recipeImage.findMany({
        include: { recipeUrl: { select: { recipeUrl: true } } }
    });

    const limit = pLimit(concurrency);

    await Promise.all(
        images.map(img => limit(async () => {
            if (!img.recipeUrl) return;
            const folder = path.join(baseDir, img.recipeUrlId.toString());
            const base = 'image' + img.id.toString() + '.jpg';
            const filePath = path.join(folder, base);

            let valid = false;
            try {
                await fs.access(filePath);
                valid = await isReallyValidImage(filePath);
            } catch {
                valid = false;
            }

            if (!valid) {
                console.log(`[CORRUPT OR MISSING] ${filePath}`);
            }

            if (img.valid !== valid) {
                await prisma.recipeImage.update({
                    where: { id: img.id },
                    data: { valid }
                });
            }
        }))
    );

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
