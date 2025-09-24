import { PrismaClient } from '@prisma/client';
import {fetchHtmlWithPuppeteer, launchBrowser} from "../lib/fetchHtmlPuppeteer";

const prisma = new PrismaClient();

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

async function main() {
    const recipeUrls = await prisma.source.findMany({
        where: {
            OR: [
                { htmlContent: null },
                { htmlContent: '' }
            ]
        },
        take: 100,
        orderBy: { id: 'asc' },
    });

    const browser = await launchBrowser();
    for (const recipe of recipeUrls) {
        try {
            console.log(`Fetching: ${recipe.recipeUrl}`);
            const html = await fetchHtmlWithPuppeteer(recipe.recipeUrl, browser);

            await prisma.source.update({
                where: { id: recipe.id },
                data: { htmlContent: html.html },
            });

            console.log(`Stored content for: ${recipe.recipeUrl}`);

            // Wait a random 2-6 seconds before next fetch
            const waitMs = Math.random() * 3000;
            console.log(`Waiting ${Math.round(waitMs / 1000)} seconds...`);
            await sleep(waitMs);

        } catch (err) {
            console.error(`Error processing ${recipe.recipeUrl}:`, err);
        }
    }

    await browser.close();
    await prisma.$disconnect();
}

main();
