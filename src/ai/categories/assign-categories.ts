import { iterate, prisma } from "../../lib/iterator";
import { Recipe } from "@prisma/client";

// Accept both Buffer and Uint8Array transparently
type ByteArray = Uint8Array;

export async function process() {
    let processedCount = 0;
    let skippedCount = 0;

    console.log("🔍 Starting recipe category analysis...");
    console.log("─".repeat(60));

    await iterate(prisma.recipe)
        .select({
            id: true,
            title: true,
            embeddings: true,
        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: any) => {
            try {
                // Skip recipes without embeddings
                if (!recipe.embeddings || !recipe.embeddings.vector) {
                    console.log(`⚠️  Recipe #${recipe.id} - no embeddings`);
                    skippedCount++;
                    return;
                }

                // Get categories for this recipe
                const categories = await findTopCategories(recipe.embeddings.vector as ByteArray, 20);

                // Display results
                console.log(`\n📄 Recipe #${recipe.id}: ${recipe.title || "Untitled"}`);
                console.log(`🏷️  Top Categories:`);
                categories.forEach((cat, index) => {
                    console.log(`   ${(index + 1).toString().padStart(2)}. ${cat.title}`);
                });

                console.log("─".repeat(60));
                processedCount++;
            } catch (error) {
                console.error(`❌ Error with recipe #${recipe.id}:`, error);
                skippedCount++;
            }
        });

    console.log(`\n✅ Complete! Processed: ${processedCount}, Skipped: ${skippedCount}`);
}

async function findTopCategories(recipeVector: ByteArray, limit: number) {
    const centroids = await prisma.categoryCentroid.findMany({
        include: {
            category: true,
        },
    });
    const similarities = centroids.map((centroid) => {
        const similarity = calculateSimilarity(
            recipeVector,
            centroid.vector as unknown as ByteArray // works for Buffer or Uint8Array
        );
        return {
            ...centroid.category,
            similarity,
        };
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

function calculateSimilarity(vectorA: ByteArray, vectorB: ByteArray): number {
    const arrayA = byteArrayToFloat32(vectorA);
    const arrayB = byteArrayToFloat32(vectorB);
    const len = Math.min(arrayA.length, arrayB.length);
    if (len === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
        const a = arrayA[i];
        const b = arrayB[i];
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function byteArrayToFloat32(bytes: ByteArray): Float32Array {
    const usableByteLength = bytes.byteLength - (bytes.byteLength % 4);
    return new Float32Array(bytes.buffer, bytes.byteOffset, usableByteLength / 4);
}

async function main() {
    try {
        await process();
    } catch (error) {
        console.error("Error processing recipes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

void main();
