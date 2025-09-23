

import { Prisma } from "@prisma/client";
import {iterate, prisma} from "../../../lib/iterator";


export type Recipe = Prisma.RecipeGetPayload<{
    select: {
        id: true
        tags: {
            select: {
                tag: {
                    select: {
                        id: true
                        name: true
                        slug: true
                    }
                }
            }
        }
    }
}>

const result: number[] = [];

export async function processTags() {
    return iterate(prisma.recipe)
        .select({
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
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            console.log('Recipe ID:', recipe.id);
            console.log('Tags:', recipe.tags.map(t => t.tag.name));

            // If you want the full tag objects:
            console.log('Full tags:', recipe.tags.map(t => ({
                id: t.tag.id,
                name: t.tag.name,
                slug: t.tag.slug
            })));
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