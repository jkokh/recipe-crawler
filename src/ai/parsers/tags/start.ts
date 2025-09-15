import { iterate, prisma } from '../../iterator';
import { Prisma } from "@prisma/client";
import {querier} from "./querier";
import {extractFirstJsonArray, kebab} from "../../../utils";
import {TagService} from "./TagService";

export type Recipe = Prisma.RecipeUrlGetPayload<{
    select: {
        id: true
        json: true
        recipeId: true
        recipe: {
            select: {
                id: true
                tags: true
            }
        }
    }
}>
const result: number[] = [];
export async function processTags() {


// First, get recipe IDs with fewer than 3 tags
    const recipeIdsWithFewTags = await prisma.$queryRaw<{id: number}[]>`
    SELECT r.id 
    FROM recipe r 
    LEFT JOIN recipe_tag_link rtl ON r.id = rtl.recipeId 
    GROUP BY r.id 
    HAVING COUNT(rtl.tagId) = 4
`;

    const recipeIds = recipeIdsWithFewTags.map(r => r.id);

// Then use those IDs in your iterator
    return iterate(prisma.recipeUrl)
        .select({
            id: true,
            json: true,
            recipeId: true,
            recipe: {
                select: {
                    id: true,
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true
                                }
                            }
                        }
                    }
                }
            }
        })
        .where({
            recipeId: {
                in: recipeIds
            }
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            const tags = await querier(JSON.parse(recipe.json!));
            console.log(tags);
            const tagService = new TagService(prisma);
            const tagIds = await tagService.resolveTags(tags);
            await tagService.attachTagsToRecipe(recipe.recipeId!, tagIds);
        });
}

// Run the function properly with error handling
async function main() {
  try {
    await processTags();
  } catch (error) {
    console.error('Error processing recipes:', error);
  }
}

void main();
