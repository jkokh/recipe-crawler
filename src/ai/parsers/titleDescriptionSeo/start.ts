import { iterate, prisma } from '../../iterator';
import { Prisma } from "@prisma/client";
import {generateRecipeContent} from "./generateRecipeContent";
import {kebab} from "../../../utils";

export type Recipe = Prisma.RecipeUrlGetPayload<{
  select: {
    id: true
    recipeUrl: true
    htmlClean: true
    htmlContent: true
    images: true
    json: true
  }
}>

export async function processRecipesWithEmptyTitles() {
  return iterate(prisma.recipeUrl)
    .select({
      id: true,
      recipeUrl: true,
      htmlClean: true,
      htmlContent: true,
      images: true,
      json: true
    })
    .where({
      OR: [
        { recipeId: null },
        { recipe: { is: { OR: [{ title: '' }] } } }
      ]
    })
    .orderBy({ id: 'desc' })
      .startPosition(1)
    .perPage(50)
    .entityName('recipes')
    .forEachAsync(async (recipe: Recipe) => {
        console.log(`Processing recipe ${recipe.id}: ${recipe.recipeUrl}`);
        const json = JSON.parse(recipe.json!).article;
        json.paragraphs = json.paragraphs.slice(0, 5);
        const data = await generateRecipeContent(json);
        data.description = data.description.replace('**', '');
        const recipeSlug = kebab(data.title);
        try {
            // Update/create the recipe with generated content
            const recipeRow = await prisma.recipe.upsert({
                where: {
                    slug: recipeSlug
                },
                update: {
                    title: data.title,
                    seo: data.seo,
                    description: data.description,
                },
                create: {
                    slug: recipeSlug,
                    title: data.title,
                    seo: data.seo,
                    description: data.description,
                },
                select: { id: true },
            });
            await prisma.recipeUrl.update({
                where: { id: recipe.id },
                data: { recipeId: recipeRow.id }
            });
            console.log(`Successfully updated recipe ${recipe.id} with title: "${data.title}"`);
        } catch (error) {
            console.error(`Failed to update recipe ${recipe.id}:`, error);
        }
    });
}

// Run the function properly with error handling
async function main() {
  try {
    await processRecipesWithEmptyTitles();
  } catch (error) {
    console.error('Error processing recipes:', error);
  }
}

void main();
