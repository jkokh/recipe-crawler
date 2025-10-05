import * as cheerio from "cheerio";
import { Prisma, PrismaClient } from "@prisma/client";
import { getTitle } from "./modules/getTitle";
import { getIngredients } from "./modules/getIngredients";
import { getNutrition } from "./modules/getNutrition";
import { getSteps } from "./modules/getSteps";
import { getParagraphs } from "./modules/getParagraphs";
import { getRecipeMeta } from "./modules/getMeta";
import { parseImages } from "./modules/getImages";
import { saveImages } from "./modules/saveImages";
import { RecipeJson } from "../types";

const prisma = new PrismaClient();

/**
 * Configuration for parsing behavior
 */
interface ParseConfig {
    skipExisting?: boolean;
    updateFields?: Array<keyof RecipeJson>;
    alwaysReparseImages?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ParseConfig = {
    skipExisting: false,
    updateFields: undefined,
    alwaysReparseImages: false
};

/**
 * Helper: pick selected fields from source
 */
function pickFields<T extends object>(
    source: T,
    target: Partial<T>,
    fields: Array<keyof T>
): Partial<T> {
    const result = { ...target };
    for (const field of fields) {
        result[field] = source[field];
    }
    return result;
}

export async function process(config: ParseConfig = DEFAULT_CONFIG) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    const perPage = 50;
    let page = 0;
    let totalProcessed = 0;

    const where: Prisma.SourceWhereInput = finalConfig.skipExisting
        ? ({
            OR: [
                { jsonParsed: { equals: Prisma.DbNull as any } },
                { jsonParsed: { equals: Prisma.JsonNull as any } },
                { jsonParsed: { equals: null as any } }
            ]
        } as Prisma.SourceWhereInput)
        : {};

    const totalCount = await prisma.source.count({ where });
    console.log(`Found ${totalCount} sources to process.`);

    while (true) {
        const sources = await prisma.source.findMany({
            where,
            select: {
                id: true,
                recipeUrl: true,
                htmlContent: true,
                jsonParsed: true,
                sourceImages: true
            },
            take: perPage,
            skip: page * perPage
        });


        if (sources.length === 0) break;

        console.log(`Processing page ${page + 1} (${sources.length} items)`);

        for (const source of sources) {
            if (!source.htmlContent) {
                console.warn(`[${source.id}] Skipped (no HTML content)`);
                continue;
            }

            const $ = cheerio.load(source.htmlContent);
            const $article = $("article");

            try {
                // Parse and save images
                let parsedImages = parseImages($article);
                const images = await saveImages(parsedImages, source.id, prisma);

                // Parse structured recipe data
                const meta = getRecipeMeta($article);
                const title = getTitle($article);
                const ingredients = getIngredients($article);
                const nutrition = getNutrition($article);
                const steps = getSteps($article, images);
                const paragraphs = getParagraphs($article, images);

                const newData: RecipeJson = {
                    title,
                    ingredients: ingredients.data,
                    nutrition,
                    steps,
                    paragraphs,
                    meta,
                    categories: [],
                    images
                };

                let finalData: RecipeJson;

                if (finalConfig.updateFields && finalConfig.updateFields.length > 0) {
                    const existingData = (source.jsonParsed as RecipeJson) || ({} as RecipeJson);
                    const updates = pickFields(newData, {}, finalConfig.updateFields);
                    finalData = { ...existingData, ...updates };
                    console.log(
                        `[${source.id}] Partial update: ${finalConfig.updateFields.join(", ")}`
                    );
                } else {
                    finalData = newData;
                    console.log(`[${source.id}] Full replacement`);
                }

                await prisma.source.update({
                    where: { id: source.id },
                    data: {
                        jsonParsed: finalData as Prisma.InputJsonValue
                    }
                });

                totalProcessed++;
            } catch (err: any) {
                console.error(`[${source.id}] Error parsing:`, err.message);
            }
        }

        console.log(
            `Completed page ${page + 1}. Total processed: ${totalProcessed}/${totalCount}`
        );

        page++;
        if (page * perPage >= totalCount) break;
    }

    console.log(`✅ All done! Processed ${totalProcessed} sources.`);
}

/**
 * Entrypoint
 */
async function main() {
    try {
        await process({ skipExisting: true });
    } catch (error) {
        console.error("Error processing recipes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

void main();
