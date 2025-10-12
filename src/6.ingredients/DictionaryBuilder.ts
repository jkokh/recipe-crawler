/*
Module: DictionaryBuilder
Purpose: Builds an ingredient dictionary by scanning all source.recipe JSONs for existing ingredient names.
- Normalizes and slugifies each ingredient name
- Applies a minimum frequency filter to keep only common items
- Synchronizes the set with the `ingredient` table (inserts new ones)
- Returns a Map of slug → ingredient id (bigint)
*/
import { PrismaClient } from "@prisma/client";
import { IngredientNormalizer } from './IngredientNormalizer';
import {RecipeJson} from "../types";


export class DictionaryBuilder {
    private readonly minFrequency = 2;

    constructor(private prisma: PrismaClient) {}

    async buildDictionary(): Promise<Map<string, bigint>> {
        console.log('Phase 1: Building ingredient dictionary...');

        const candidates = await this.extractCandidatesFromSources();
        const validCandidates = this.filterByFrequency(candidates);

        console.log(`Found ${candidates.size} unique candidates`);
        console.log(`Filtered to ${validCandidates.size} (frequency >= ${this.minFrequency})`);

        const dictionary = await this.syncWithDatabase(validCandidates);

        console.log(`Total ingredients in dictionary: ${dictionary.size}`);
        return dictionary;
    }

    private async extractCandidatesFromSources() {
        const sources = await this.prisma.source.findMany({
            select: { id: true, jsonParsed: true }
        });

        const candidates = new Map<string, { normalized: string; slug: string; count: number }>();

        for (const source of sources) {
            const data = source.jsonParsed as RecipeJson;
            const ingredients = data?.ingredients;

            if (!Array.isArray(ingredients)) continue;

            for (const ing of ingredients) {
                const rawName = ing?.name?.trim();
                if (!rawName) continue;

                const normalized = IngredientNormalizer.normalize(rawName);
                if (!normalized || normalized.length < 3) continue;

                const slug = IngredientNormalizer.slugify(normalized);
                const existing = candidates.get(slug);

                if (existing) {
                    existing.count++;
                } else {
                    candidates.set(slug, { normalized, slug, count: 1 });
                }
            }
        }

        return candidates;
    }

    private filterByFrequency(
        candidates: Map<string, { normalized: string; slug: string; count: number }>
    ) {
        return new Map(
            [...candidates.entries()].filter(([, data]) => data.count >= this.minFrequency)
        );
    }

    private async syncWithDatabase(
        validCandidates: Map<string, { normalized: string; slug: string; count: number }>
    ): Promise<Map<string, bigint>> {
        const existingIngredients = await this.prisma.ingredient.findMany({
            select: { id: true, name: true, slug: true }
        });

        const bySlug = new Map(
            existingIngredients.map(ing => [ing.slug, { id: ing.id, name: ing.name, slug: ing.slug }])
        );

        console.log(`Found ${bySlug.size} existing ingredients in database`);

        const newSlugs = [...validCandidates.keys()].filter(slug => !bySlug.has(slug));

        if (newSlugs.length > 0) {
            await this.insertNewIngredients(newSlugs, validCandidates, bySlug);
        } else {
            console.log('No new ingredients detected this run.');
        }

        return new Map([...bySlug.entries()].map(([slug, ing]) => [slug, ing.id]));
    }

    private async insertNewIngredients(
        newSlugs: string[],
        validCandidates: Map<string, { normalized: string; slug: string; count: number }>,
        bySlug: Map<string, { id: bigint; name: string; slug: string }>
    ) {
        const newInserts = newSlugs.map(slug => {
            const c = validCandidates.get(slug)!;
            return {
                name: IngredientNormalizer.toTitleCase(c.normalized),
                slug: c.slug
            };
        });

        console.log(`Inserting ${newInserts.length} new ingredients...`);
        await this.prisma.ingredient.createMany({ data: newInserts, skipDuplicates: true });

        const inserted = await this.prisma.ingredient.findMany({
            where: { slug: { in: newSlugs } },
            select: { id: true, name: true, slug: true }
        });

        for (const ing of inserted) {
            bySlug.set(ing.slug, ing);
        }

        console.log(`Inserted ${inserted.length} new ingredients`);
        this.reportNewIngredients(newSlugs, validCandidates);
    }

    private reportNewIngredients(
        newSlugs: string[],
        validCandidates: Map<string, { normalized: string; slug: string; count: number }>
    ) {
        const report = newSlugs.map(slug => {
            const c = validCandidates.get(slug)!;
            return {
                slug: c.slug,
                name: IngredientNormalizer.toTitleCase(c.normalized),
                frequency: c.count
            };
        });

        report.sort((a, b) => b.frequency - a.frequency);
        const top = report.slice(0, 25);
        console.log(`Top ${top.length} new ingredients by frequency:`);
        console.table(top);
    }
}