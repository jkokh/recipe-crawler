import { iterate, prisma } from '../../iterator';
import { Prisma } from "@prisma/client";
import {scanner} from "./scanner";
import {kebab} from "../../../utils";

export type Recipe = Prisma.RecipeGetPayload<{
  select: {
    id: true
    title: true
    description: true
  }
}>
const result: number[] = [];
export async function processRecipesWithEmptyTitles() {


  return iterate(prisma.recipe)
    .select({
      id: true,
      title: true,
      description: true
    })
      .startPosition(1)
    .perPage(50)
    .entityName('recipes')
    .forEachAsync(async (recipe: Recipe) => {
        //console.log(`Processing recipe ${recipe.id}: ${recipe.title}`);

        const data = await scanner({
            title: recipe.title,
            description: recipe.description,
        });

        if (data.result === 'yes') {
            result.push(recipe.id);
            console.log(`Recipe ${recipe.id}: ${recipe.title} ${recipe.description} is a personal recipe`);
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
