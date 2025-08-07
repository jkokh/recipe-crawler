import {Prisma, PrismaClient} from '@prisma/client';
import { CONFIG } from '../config';

const prisma = new PrismaClient();

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

export const processBatch = async (
  processFunction = async (recipe: any) => recipe,
  page = CONFIG.startPage + 1,
  perPage = CONFIG.perPage
) => {
  const skip = (page - 1) * perPage;

  const recipes = await prisma.recipeUrl.findMany({
    take: perPage,
    skip: skip,
    orderBy: { [CONFIG.orderBy.field]: 'desc' },
    where: {
      OR: [
        { recipeId: null },
        {
          recipe: {
            is: {
              OR: [
                { title: '' },
              ]
            }
          }
        }
      ]
    },
    select: {
      id: true,
      json: true,
      recipeUrl: true,
      htmlClean: true,
      htmlContent: true,
      images: true
    }
  });


  
  const results = [];
  for (const recipe of recipes) {
    try {
      results.push(await processFunction(recipe));
    } catch (error) {
      results.push({ id: recipe.id, error: error.message });
    }
  }

  return { 
    page, 
    perPage, 
    total: recipes.length, 
    results 
  };
};

/**
 * Iterator that processes all recipes in batches
 * @param processFunction Function to process each recipe
 * @param startPage Starting page (1-based)
 * @param perPage Number of items per page
 * @param totalPages Optional limit on total pages to process
 */
export const iterateAllRecipes = async (
  processFunction = async (recipe: Recipe) => recipe,
  startPage = 1,
  perPage = CONFIG.perPage,
  totalPages?: number
) => {
  // Get total count for pagination
  const totalCount = await prisma.recipeUrl.count();
  const maxPages = Math.ceil(totalCount / perPage);
  
  // If totalPages is provided, use the smaller of maxPages or totalPages
  const pagesToProcess = totalPages ? Math.min(maxPages, totalPages) : maxPages;
  
  console.log(`Starting iteration over ${totalCount} recipes (${pagesToProcess} pages)`);
  
  let currentPage = startPage;
  let processedCount = 0;
  
  while (currentPage <= pagesToProcess) {
    console.log(`Processing page ${currentPage} of ${pagesToProcess}...`);
    
    const batchResult = await processBatch(processFunction, currentPage, perPage);
    processedCount += batchResult.results.length;
    
    console.log(`Completed page ${currentPage}: ${batchResult.results.length} recipes processed`);
    console.log(`Total progress: ${processedCount}/${totalCount} (${Math.round(processedCount/totalCount*100)}%)`);
    
    // Move to next page
    currentPage++;
    
    // Optional: add a small delay between batches to avoid overloading the system
    if (currentPage <= pagesToProcess) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Iteration complete: processed ${processedCount} recipes`);
};

export async function closeConnection() {
  await prisma.$disconnect();
}