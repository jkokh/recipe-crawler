
/*
Module: IngredientResolver
Purpose: Resolves ingredient IDs for each source recipe without generating new items.
- Iterates sources in batches and reads their existing ingredients from jsonParsed
- Enriches items with ingredientId using the dictionary (slug → id)
- Writes updated JSON to jsonParsed; does not create or infer missing ingredients
*/
import { PrismaClient } from '@prisma/client';
import { IngredientEnricher } from './IngredientEnricher';
import {VERSION} from "../constants";
import {RecipeJson} from "../types";


export class IngredientResolver {
    private readonly batchSize = 100;

    constructor(
        private prisma: PrismaClient,
        private dictionary: Map<string, bigint>
    ) {}

    async resolveAndUpdate(): Promise<void> {
        console.log('\nPhase 2: Resolving ingredient IDs...');

        const sources = await this.prisma.source.findMany({
            select: { id: true, jsonParsed: true },
            where: { version: VERSION }
        });

        let processed = 0;
        let updated = 0;

        for (let i = 0; i < sources.length; i += this.batchSize) {
            const batch = sources.slice(i, i + this.batchSize);
            const updates = await this.processBatch(batch);

            await this.saveBatch(updates);

            processed += batch.length;
            updated += this.countUpdated(updates);

            console.log(`Processed ${processed}/${sources.length} sources (${updated} updated)`);
        }

        console.log(`\nCompleted: ${updated} sources updated with ingredient IDs`);
    }

    private async processBatch(batch: Array<{ id: number; jsonParsed: unknown }>) {
        return Promise.all(
            batch.map(async source => {
                const recipeJson = source.jsonParsed as RecipeJson;
                const ingredients = Array.isArray(recipeJson?.ingredients)
                    ? recipeJson.ingredients
                    : [];

                // Enrich with ingredient IDs (do not generate new ones)
                const enrichedIngredients = IngredientEnricher.enrich(
                    ingredients,
                    this.dictionary
                );

                const updatedJson: RecipeJson = {
                    ...recipeJson,
                    ingredients: enrichedIngredients
                };

                return {
                    id: source.id,
                    data: updatedJson
                };
            })
        );
    }

    private async saveBatch(updates: Array<{ id: number; data: RecipeJson }>) {
        await this.prisma.$transaction(
            updates.map(update =>
                this.prisma.source.update({
                    where: { id: update.id },
                    data: { jsonParsed: update.data as any }
                })
            )
        );
    }

    private countUpdated(updates: Array<{ id: number; data: RecipeJson }>): number {
        return updates.filter(u => {
            const data = u.data as RecipeJson;
            return Array.isArray(data?.ingredients) && data.ingredients.length > 0;
        }).length;
    }
}