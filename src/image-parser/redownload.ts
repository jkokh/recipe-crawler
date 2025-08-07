import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { downloadImageWithPuppeteer } from "../crawler/fetchHtmlPuppeteer"; // Adjust path if needed

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

async function main() {
    const baseDir = 'images/simplerecipes';

    // Only fetch images marked as invalid (valid === false)
    const images = await prisma.recipeImage.findMany({
        where: { valid: false },
        include: { recipeUrl: { select: { recipeUrl: true } } }
    });

    for (const img of images) {
        if (!img.recipeUrl) continue;
        const folder = path.join(baseDir, slugifyUrl(img.recipeUrl.recipeUrl));
        const base = path.basename(img.imageUrl.split("?")[0]);
        const filePath = path.join(folder, base);

        try {
            await fs.mkdir(folder, { recursive: true });
            await downloadImageWithPuppeteer(img.imageUrl, filePath, img.recipeUrl.recipeUrl);
            console.log(`[DOWNLOADED] ${filePath}`);
        } catch (err) {
            console.log(`[FAILED TO DOWNLOAD] ${filePath}`);
        }
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
