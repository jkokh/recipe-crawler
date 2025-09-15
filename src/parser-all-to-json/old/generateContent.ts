import { iterateAllRecipes, closeConnection, Recipe } from './modules/iterator';
import { extractArticleContent } from './modules/article';
import { PrismaClient } from '@prisma/client';
import { kebab } from '../utils';
import { OllamaProvider } from '../ai/providers/ollama';
import { RecipeContentGenerator } from '../ai/services/recipeContentGenerator';

const prisma = new PrismaClient();

// Initialize AI services
const ollamaProvider = new OllamaProvider();
const contentGenerator = new RecipeContentGenerator(ollamaProvider);


async function processRecipe(recipe: Recipe): Promise<Recipe> {
    const html = recipe.htmlContent ?? '';

    if (!html) {
        console.log(`Recipe ${recipe.id}: No HTML content, skipping`);
        return recipe;
    }

    const article = extractArticleContent(html, recipe);
    const recipeData = { article };

    (recipeData as any).paragraphs = article.paragraphs.map(p => p.content).join(' ');

    const generatedContent = await contentGenerator.generateRecipeContent(recipeData, undefined, 3, recipe.id);
    if (!generatedContent) {
        console.log(`Recipe ${recipe.id}: Failed to generate content after retries`);
        // The fail field should already be set to true by the content generator
        return recipe;
    }

    // Validate that we have required fields
    if (!generatedContent.title || !generatedContent.description || !generatedContent.html) {
        console.log(`Recipe ${recipe.id}: Generated content is incomplete:`, {
            hasTitle: !!generatedContent.title,
            hasDescription: !!generatedContent.description,
            hasHtml: !!generatedContent.html
        });
        return recipe;
    }

    const recipeSlug = kebab(generatedContent.title);

    if (!recipeSlug) {
        console.log(`Recipe ${recipe.id}: Failed to generate valid slug from title: "${generatedContent.title}"`);
        return recipe;
    }

    try {
        // Update/create the recipe with generated content
        const recipeRow = await prisma.recipe.upsert({
            where: {
                slug: recipeSlug
            },
            update: {
                title: generatedContent.title,
                seo: generatedContent.description,
                description: generatedContent.html,
            },
            create: {
                slug: recipeSlug,
                title: generatedContent.title,
                seo: generatedContent.description,
                description: generatedContent.html,
            },
            select: { id: true },
        });


        await prisma.recipeUrl.update({
            where: { id: recipe.id },
            data: { recipeId: recipeRow.id }
        });

        console.log(`Successfully updated recipe ${recipe.id} with title: "${generatedContent.title}" (slug: ${recipeSlug})`);
    } catch (error) {
        console.error(`Failed to update recipe ${recipe.id}:`, error);

        // Log the problematic data for debugging
        console.error(`Recipe data that failed:`, {
            id: recipe.id,
            slug: recipeSlug,
            slugLength: recipeSlug?.length,
            title: generatedContent.title,
            titleLength: generatedContent.title?.length,
            seoLength: generatedContent.description?.length,
            descriptionLength: generatedContent.html?.length
        });

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