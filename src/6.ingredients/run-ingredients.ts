// ============================================================================
// Main Entry Point
// ============================================================================
/*
Module: run-ingredients
Purpose: Orchestrates the 6.ingredients flow.
- Phase 1: Build dictionary of known ingredients (slug → id)
- Phase 2: Enrich each source’s existing ingredients with ingredientId and save
*/
import { PrismaClient } from '@prisma/client';
import { DictionaryBuilder } from './DictionaryBuilder';
import { IngredientResolver } from './IngredientResolver';

const prisma = new PrismaClient();

async function run() {
    try {
        console.log('Starting ingredient processing...\n');

        // Phase 1: Build ingredient dictionary
        const dictionaryBuilder = new DictionaryBuilder(prisma);
        const dictionary = await dictionaryBuilder.buildDictionary();

        // Phase 2: Resolve and update source ingredients
        const resolver = new IngredientResolver(prisma, dictionary);
        await resolver.resolveAndUpdate();

        console.log('\nDone!');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});