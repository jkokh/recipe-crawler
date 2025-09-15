import { iterateAllRecipes, closeConnection, Recipe } from './modules/iterator';
import { nutritionToJson } from './modules/nutrition';
import { recipeStepsToJson } from './modules/steps';
import { extractArticleContent } from './modules/article';
import { prepTime } from './modules/prepTime';
import { PrismaClient } from '@prisma/client';
import { generateRecipeTags } from '../ollama/generateRecipeTags';
import {kebab, printRecipeReport} from '../utils';

import { TagService } from '../ai/parsers/tags/TagService';
import {rephraseRecipeTitle} from "../ollama/ollama";

const prisma = new PrismaClient();
const tagService = new TagService(prisma);

async function processRecipe(recipe: Recipe): Promise<Recipe> {

    const html = recipe.htmlContent ?? '';

    console.log(recipe.recipeUrl);

    // Derive structured data from HTML
    //const steps = recipeStepsToJson(html);
    //const nutrition = nutritionToJson(html);
    const article = extractArticleContent(html, recipe);
    //const time = prepTime(html);



    // Build the JSON blob you’re storing back (unchanged logic)
    const json = { article };

    console.log('Old title: ', article.mainTitle);
    console.log('New title: ', await rephraseRecipeTitle(json));
    return;

    // --- Ensure we have a canonical Recipe row (NOT RecipeUrl) ---
    const recipeSlug = kebab(article.mainTitle);

    let recipeRowId: number | null = null;

    if (recipeSlug) {
        const title = article.mainTitle;

        const recipeRow = await prisma.recipe.upsert({
            where: { slug: recipeSlug },
            update: {
                title,
                description: article?.paragraphs[0]?.content ?? null,
            },
            create: {
                slug: recipeSlug,
                title,
                description: article?.paragraphs[0]?.content ?? null,
            },
            select: { id: true },
        });

        recipeRowId = recipeRow.id;
    } else {
        console.warn(`⚠️ Could not derive recipe slug for recipeUrlId=${recipe.id}`);
    }

    // Generate tag names from your model
    const tagNames = await generateRecipeTags(json);

    // Resolve tag names -> IDs by exact slug; create if missing; attach to Recipe (not RecipeUrl)
    try {
        if (recipeRowId && Array.isArray(tagNames) && tagNames.length > 0) {
            const tagIds = await tagService.resolveTags(tagNames); // exact slug, no aliases/fuzzy
            await tagService.attachTagsToRecipe(recipeRowId, tagIds);
            console.log(`🏷️  Attached ${tagIds.length} tag(s) to recipe ${recipeRowId}`);
        } else {
            console.log('🏷️  No tags generated or no recipe row to attach.');
        }
    } catch (e) {
        console.error(`❌ Tag resolution/attachment failed for recipe ${recipeRowId ?? -1}:`, e);
    }

    printRecipeReport(steps, nutrition);

    // Save processed JSON to recipe_urls.json
    try {
        await prisma.recipeUrl.update({
            where: { id: recipe.id },
            data: { json: JSON.stringify(json) },
        });
        console.log(`✅ Saved processed data to database for recipe ${recipe.id}`);
    } catch (error) {
        console.error(`❌ Failed to save processed data for recipe ${recipe.id}:`, error);
    }

    return recipe;
}

async function main() {
    try {
        await iterateAllRecipes(processRecipe);
    } finally {
        await closeConnection();
    }
}

void main();

