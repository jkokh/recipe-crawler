import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { querier } from './querier';
import {loadTagsCache, resolveTagsToIds, mergeTagIds, validateExistingTags} from './utils';
import type { RecipeJson } from '../types';

const prisma = new PrismaClient();

const MERGE_TAGS = true;

async function run() {
    try {
        console.log('Starting tags processing...');
        console.log(`Mode: ${MERGE_TAGS ? 'MERGE' : 'REWRITE'} existing tags\n`);

        const tagsCache = await loadTagsCache(prisma);
        console.log(`Loaded ${tagsCache.size} existing tags\n`);

        const sources = await prisma.source.findMany({
            select: { id: true, jsonParsed: true },
            orderBy: { id: 'asc' }
        });

        console.log(`Found ${sources.length} sources to process\n`);

        let updated = 0;
        let skipped = 0;
        let failed = 0;

        for (const source of sources) {
            const recipeJson = source.jsonParsed as RecipeJson;
            const recipeTitle = recipeJson.title;
            const recipeContext = `"${recipeTitle}" (Source ID: ${source.id})`;

            const validExistingTags = validateExistingTags(recipeJson.tags, tagsCache);

            if (MERGE_TAGS && validExistingTags.length >= 3) {
                // console.log(`Skip ${recipeContext}: Already has ${validExistingTags.length} valid tags (MERGE mode)`);
                skipped++;
                continue;
            }

            try {
                const tagNames = await querier(recipeJson);

                if (!tagNames || tagNames.length === 0) {
                    console.log(`Skip ${recipeContext}: No tags returned`);
                    skipped++;
                    continue;
                }

                const tagIds = await resolveTagsToIds(prisma, tagNames, tagsCache);

                if (!tagIds.length) {
                    console.log(`Skip ${recipeContext}: No valid tag IDs`);
                    skipped++;
                    continue;
                }

                const finalTags = MERGE_TAGS
                    ? mergeTagIds(validExistingTags, tagIds)
                    : tagIds;

                const updatedJson = {
                    ...recipeJson,
                    tags: finalTags
                };

                await prisma.source.update({
                    where: { id: source.id },
                    data: { jsonParsed: updatedJson as Prisma.InputJsonValue }
                });

                updated++;
                console.log(`OK ${recipeContext} - ${finalTags.length} tags (${updated}/${sources.length})`);

            } catch (error) {
                failed++;
                const errorMsg = error instanceof Error ? error.message : String(error);
                console.error(`FAIL ${recipeContext}:\n  ${errorMsg}`);
            }
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`Results:`);
        console.log(`  Updated: ${updated}`);
        console.log(`  Skipped: ${skipped}`);
        console.log(`  Failed: ${failed}`);
        console.log(`  Total: ${sources.length}`);
        console.log(`${'='.repeat(50)}\n`);

    } catch (error) {
        console.error('Fatal error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});