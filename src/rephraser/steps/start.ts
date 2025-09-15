import { iterate, prisma } from "../../lib/iterator";
import { Prisma, RecipeStep } from "@prisma/client";
import { querier } from "./querier";
import { Recipe } from "./types";
import { RecipeJson } from "../../types";
import { fromBytes } from "../../lib/vec";

// Type for category with similarity score
interface CategoryMatch {
    id: number;
    title: string;
    description: string | null;
    similarity: number;
}

// Enhanced recipe type with embeddings
interface RecipeWithEmbedding extends Recipe {
    embeddings?: {
        vector: Buffer;
        dim: number;
        model: string;
    } | null;
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find top N most similar categories for a recipe
async function findRelevantCategories(recipeVector: number[], topN: number = 12): Promise<CategoryMatch[]> {
    // Get all category centroids
    const centroids = await prisma.categoryCentroid.findMany({
        include: {
            category: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                }
            }
        }
    });

    // Calculate similarities
    const similarities: CategoryMatch[] = centroids.map(centroid => {
        const categoryVector = fromBytes(centroid.vector);
        const similarity = cosineSimilarity(recipeVector, categoryVector);

        return {
            id: centroid.category.id,
            title: centroid.category.title,
            description: centroid.category.description,
            similarity: similarity
        };
    });

    // Sort by similarity (descending) and take top N
    return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN);
}

// Format categories for display
function formatCategoriesOutput(recipeId: number, recipeTitle: string, categories: CategoryMatch[]): string {
    const lines = [
        `📄 Recipe #${recipeId}: ${recipeTitle}`,
        `🏷️  Top ${categories.length} Relevant Categories:`,
        ...categories.map((cat, index) =>
            `   ${(index + 1).toString().padStart(2)}) ${cat.title.padEnd(30)} (${(cat.similarity * 100).toFixed(1)}%)`
        ),
        "─".repeat(80)
    ];
    return lines.join("\n");
}

export async function process() {
    let processedCount = 0;
    let skippedCount = 0;
    const startTime = Date.now();

    console.log("🔍 Starting recipe category analysis...");
    console.log("─".repeat(80));

    await iterate(prisma.recipe)
        .select({
            id: true,
            title: true,
            recipeUrl: true,
            steps: true,
            embeddings: {
                select: {
                    vector: true,
                    dim: true,
                    model: true,
                }
            }
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: RecipeWithEmbedding) => {
            try {
                // Skip recipes without embeddings
                if (!recipe.embeddings) {
                    console.log(`⚠️  Recipe #${recipe.id} skipped - no embeddings found`);
                    skippedCount++;
                    return;
                }

                // Convert embedding from bytes to vector
                const recipeVector = fromBytes(recipe.embeddings.vector);

                // Find relevant categories
                const relevantCategories = await findRelevantCategories(recipeVector, 12);

                // Display results
                const output = formatCategoriesOutput(
                    recipe.id,
                    recipe.title || `Recipe ${recipe.id}`,
                    relevantCategories
                );
                console.log(output);

                processedCount++;

                // Progress indicator every 10 recipes
                if (processedCount % 10 === 0) {
                    const elapsed = (Date.now() - startTime) / 1000;
                    console.log(`📊 Progress: ${processedCount} processed, ${skippedCount} skipped (${elapsed.toFixed(1)}s elapsed)`);
                    console.log("─".repeat(80));
                }

            } catch (error) {
                console.error(`❌ Error processing recipe #${recipe.id}:`, error);
                skippedCount++;
            }
        });

    const totalDuration = (Date.now() - startTime) / 1000;
    console.log('\x1b[32m%s\x1b[0m', `✅ Analysis Complete!`);
    console.log(`📊 Summary: ${processedCount} processed, ${skippedCount} skipped in ${totalDuration.toFixed(1)}s`);

    if (processedCount > 0) {
        console.log(`⚡ Average: ${(processedCount / totalDuration).toFixed(1)} recipes/second`);
    }
}

async function main() {
    try {
        await process();
    } catch (error) {
        console.error('❌ Error processing recipes:', error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

void main();