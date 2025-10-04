import fs from 'fs/promises';
import { parseStringPromise } from 'xml2js';
import { sitemapsConfig } from './config.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RECIPE_URL_REGEX = /[-\/]recipe-(\d+)/i;

async function parseSitemapFile(filePath: string) {
    const xml = await fs.readFile(filePath, 'utf8');
    const result = await parseStringPromise(xml);
    return (result.urlset?.url || []).map((u: any) => ({
        loc: u.loc[0],
        lastmod: u.lastmod?.[0] || null,
    }));
}

async function saveUrlsToDb(urls: { loc: string, lastmod?: string }[]) {
    // Only keep URLs matching /recipe-{number}
    const recipeUrls = urls.filter(({ loc }) => RECIPE_URL_REGEX.test(loc));
    for (const { loc, lastmod } of recipeUrls) {
        await prisma.source.upsert({
            where: { recipeUrl: loc },
            update: { recipeDate: lastmod ? new Date(lastmod) : null },
            create: { recipeUrl: loc, recipeDate: lastmod ? new Date(lastmod) : null }
        });
    }
}

(async () => {
    for (const { title, files } of sitemapsConfig) {
        console.log(`Processing "${title}"...`);
        for (const file of files) {
            try {
                const urls = await parseSitemapFile(file);
                console.log(`  ${file}: ${urls.length} URLs`);
                await saveUrlsToDb(urls);
            } catch (e: any) {
                console.error(`  Failed to process ${file}:`, e.message);
            }
        }
    }
    await prisma.$disconnect();
    console.log('Done!');
})();
