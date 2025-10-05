import fs from 'fs/promises';
import { parseStringPromise } from 'xml2js';
import { sitemapsConfig } from './config.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RECIPE_URL_REGEX = /[-\/]recipe-(\d+)/i;

interface Stats {
    totalFiles: number;
    processedFiles: number;
    totalUrls: number;
    recipeUrls: number;
    newRecords: number;
    dateUpdated: number;
    noChanges: number;
    errors: number;
}

async function parseSitemapFile(filePath: string) {
    const xml = await fs.readFile(filePath, 'utf8');
    const result = await parseStringPromise(xml);
    return (result.urlset?.url || []).map((u: any) => ({
        loc: u.loc[0],
        lastmod: u.lastmod?.[0] || null,
    }));
}

async function saveUrlsToDb(urls: { loc: string, lastmod?: string | null }[], stats: Stats) {
    // Only keep URLs matching /recipe-{number}
    const recipeUrls = urls.filter(({ loc }) => RECIPE_URL_REGEX.test(loc));
    stats.recipeUrls += recipeUrls.length;

    let batchNew = 0;
    let batchUpdated = 0;
    let batchUnchanged = 0;

    for (let i = 0; i < recipeUrls.length; i++) {
        const { loc, lastmod } = recipeUrls[i];

        try {
            // Check if record exists and get its current date
            const existing = await prisma.source.findUnique({
                where: { recipeUrl: loc },
                select: { id: true, recipeDate: true }
            });

            const newDate = lastmod ? new Date(lastmod) : null;

            if (!existing) {
                // New record - create it
                await prisma.source.create({
                    data: { recipeUrl: loc, recipeDate: newDate }
                });
                batchNew++;
                stats.newRecords++;
            } else {
                // Existing record - check if date changed
                const oldDate = existing.recipeDate;
                const dateChanged = oldDate?.getTime() !== newDate?.getTime();

                if (dateChanged) {
                    await prisma.source.update({
                        where: { recipeUrl: loc },
                        data: { recipeDate: newDate }
                    });
                    batchUpdated++;
                    stats.dateUpdated++;
                } else {
                    // No changes needed
                    batchUnchanged++;
                    stats.noChanges++;
                }
            }

            // Show progress every 100 URLs
            if ((i + 1) % 100 === 0) {
                process.stdout.write(`\r    Progress: ${i + 1}/${recipeUrls.length} URLs processed...`);
            }
        } catch (e: any) {
            stats.errors++;
            console.error(`\n    Error processing ${loc}:`, e.message);
        }
    }

    if (recipeUrls.length > 0) {
        process.stdout.write(`\r    Progress: ${recipeUrls.length}/${recipeUrls.length} URLs processed\n`);
    }

    return { new: batchNew, updated: batchUpdated, unchanged: batchUnchanged };
}

(async () => {
    const startTime = Date.now();
    const stats: Stats = {
        totalFiles: 0,
        processedFiles: 0,
        totalUrls: 0,
        recipeUrls: 0,
        newRecords: 0,
        dateUpdated: 0,
        noChanges: 0,
        errors: 0
    };

    // Count total files
    for (const { files } of sitemapsConfig) {
        stats.totalFiles += files.length;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('  Sitemap Processing Started');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total sitemaps to process: ${stats.totalFiles}\n`);

    for (const { title, files } of sitemapsConfig) {
        console.log(`\n📂 Processing "${title}" (${files.length} files)...`);
        console.log('─────────────────────────────────────────────────────');

        for (const file of files) {
            stats.processedFiles++;
            try {
                console.log(`\n  [${stats.processedFiles}/${stats.totalFiles}] ${file}`);
                const urls = await parseSitemapFile(file);
                stats.totalUrls += urls.length;
                console.log(`    Found ${urls.length} total URLs`);

                const { new: created, updated, unchanged } = await saveUrlsToDb(urls, stats);
                console.log(`    ✓ New: ${created} | Date changed: ${updated} | Unchanged: ${unchanged}`);

            } catch (e: any) {
                stats.errors++;
                console.error(`    ✗ Failed to process ${file}:`, e.message);
            }
        }
    }

    await prisma.$disconnect();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const modified = stats.newRecords + stats.dateUpdated;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Processing Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`  Files processed:     ${stats.processedFiles}/${stats.totalFiles}`);
    console.log(`  Total URLs found:    ${stats.totalUrls.toLocaleString()}`);
    console.log(`  Recipe URLs found:   ${stats.recipeUrls.toLocaleString()}`);
    console.log(`  `);
    console.log(`  New recipes:         ${stats.newRecords.toLocaleString()}`);
    console.log(`  Date updated:        ${stats.dateUpdated.toLocaleString()}`);
    console.log(`  Already up-to-date:  ${stats.noChanges.toLocaleString()}`);
    console.log(`  Database modified:   ${modified.toLocaleString()}`);
    console.log(`  `);
    console.log(`  Errors:              ${stats.errors}`);
    console.log(`  Duration:            ${duration}s`);
    console.log(`  Average speed:       ${(stats.recipeUrls / parseFloat(duration)).toFixed(0)} URLs/sec`);
    console.log('\n═══════════════════════════════════════════════════════\n');
})();