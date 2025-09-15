import { PrismaClient } from "@prisma/client";
import { embed } from "../../lib/embed";
import { toBytes } from "../../lib/vec";

const prisma = new PrismaClient();
const MODEL = "Xenova/bge-m3";

export type RecipeJson = {
    title: string;
    ingredients: Ingredient[] | null;
    nutrition: Nutrition | null;
    paragraphs: Paragraph[] | null;
    steps: Step[] | null;
    meta: RecipeMeta | null;
    needsReview: boolean;
};

type Ingredient = { name?: string; amount?: string; unit?: string };
type Paragraph = { text?: string; content?: string };
type Step = { instruction?: string; text?: string; description?: string };
type Nutrition = any;
type RecipeMeta = any;

interface RecipeLike {
    id: number;
    title: string;
    description?: string | null;
    seo?: string | null;
    jsonAltered?: boolean | null;
    json?: RecipeJson | null;
}

function extractTextFromIngredients(ingredients: Ingredient[] | null): string {
    if (!ingredients) return "";
    return ingredients
        .map((ing) => {
            const parts = [ing.name, ing.amount, ing.unit].filter(Boolean);
            return parts.join(" ");
        })
        .join(", ");
}

function extractTextFromParagraphs(paragraphs: Paragraph[] | null): string {
    if (!paragraphs) return "";
    return paragraphs
        .map((p) => p.text || p.content || "")
        .filter(Boolean)
        .join(" ");
}

function extractTextFromSteps(steps: Step[] | null): string {
    if (!steps) return "";
    return steps
        .map((step) => step.instruction || step.text || step.description || "")
        .filter(Boolean)
        .join(" ");
}

export function textOf(r: RecipeLike): string {
    const title = r.title?.trim() ?? "";
    const seo = r.seo?.trim() ?? "";

    const rawDescription = r.description ?? "";
    const plainDescription = rawDescription
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);

    const textParts = [title, seo, plainDescription].filter(Boolean);

    if (r.jsonAltered && r.json) {
        const ingredientsText = extractTextFromIngredients(r.json.ingredients);
        const paragraphsText = extractTextFromParagraphs(r.json.paragraphs);
        const stepsText = extractTextFromSteps(r.json.steps);

        if (ingredientsText) textParts.push(`Ingredients: ${ingredientsText}`);
        if (paragraphsText) textParts.push(`Content: ${paragraphsText}`);
        if (stepsText) textParts.push(`Instructions: ${stepsText}`);
    }

    return textParts.join("\n");
}

function safeParse<T>(s?: string | null): T | null {
    if (!s) return null;
    try {
        return JSON.parse(s) as T;
    } catch {
        return null;
    }
}

(async () => {
    const batch = 50; // Smaller batch size to prevent memory issues

    try {
        // Get total count for progress tracking
        console.log("🔍 Counting recipes to process...");
        const totalCount = await prisma.recipeUrl.count({
            where: {
                recipeId: { not: null },
                recipe: { embeddings: null },
            },
        });

        if (totalCount === 0) {
            console.log("✅ No recipes need embedding. All done!");
            return;
        }

        console.log(`📊 Found ${totalCount} recipes to embed`);
        console.log(`⚡ Processing in batches of ${batch}...`);
        console.log("─".repeat(50));

        let processed = 0;
        const startTime = Date.now();

        for (;;) {
            const batchStartTime = Date.now();

            // 1) Pull RecipeUrls whose linked Recipe has no embedding yet
            const rows = await prisma.recipeUrl.findMany({
                where: {
                    recipeId: { not: null },
                    recipe: { embeddings: null },
                },
                select: {
                    recipeId: true,
                    json: true,          // String? in schema
                    jsonAltered: true,   // Json? → treat truthy as altered
                    recipe: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            seo: true,
                        },
                    },
                },
                take: batch,
            });

            if (!rows.length) break;

            // 2) Map rows → RecipeLike[]
            const items: RecipeLike[] = rows.map((r) => ({
                id: r.recipe!.id,                    // use Recipe.id for RecipeEmbedding.recipeId
                title: r.recipe!.title,
                description: r.recipe!.description,
                seo: r.recipe!.seo,
                jsonAltered: Boolean(r.jsonAltered),
                json: safeParse<RecipeJson>(r.json),
            }));

            // 3) Embed texts with memory management
            console.log(`🧠 Generating embeddings for batch of ${items.length}...`);
            const embedStartTime = Date.now();

            // Process embeddings in smaller chunks to prevent memory overflow
            const EMBED_CHUNK_SIZE = 20;
            const allVecs = [];

            for (let i = 0; i < items.length; i += EMBED_CHUNK_SIZE) {
                const chunk = items.slice(i, i + EMBED_CHUNK_SIZE);
                const chunkTexts = chunk.map(textOf);

                try {
                    const chunkVecs = await embed(chunkTexts, "passage");
                    allVecs.push(...chunkVecs);

                    // Log progress for larger batches
                    if (items.length > EMBED_CHUNK_SIZE) {
                        const chunkProgress = Math.min(i + EMBED_CHUNK_SIZE, items.length);
                        console.log(`   📄 Embedded ${chunkProgress}/${items.length} items in batch`);
                    }

                    // Small delay to prevent overwhelming the embedding service
                    if (i + EMBED_CHUNK_SIZE < items.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } catch (error) {
                    console.error(`❌ Error embedding chunk ${i}-${i + chunk.length}:`, error);
                    throw error;
                }
            }

            const vecs = allVecs;
            const embedDuration = Date.now() - embedStartTime;

            // 4) Upsert embeddings keyed by Recipe.id
            console.log(`💾 Saving embeddings to database...`);
            const dbStartTime = Date.now();
            await prisma.$transaction(
                items.map((r, i) =>
                    prisma.recipeEmbedding.upsert({
                        where: { recipeId: r.id },
                        create: {
                            recipeId: r.id,
                            vector: toBytes(vecs[i]),
                            dim: vecs[i].length,
                            model: MODEL,
                        },
                        update: {
                            vector: toBytes(vecs[i]),
                            dim: vecs[i].length,
                            model: MODEL,
                        },
                    })
                )
            );
            const dbDuration = Date.now() - dbStartTime;
            const batchDuration = Date.now() - batchStartTime;

            processed += items.length;
            const alteredCount = items.filter((r) => r.jsonAltered).length;
            const progress = ((processed / totalCount) * 100).toFixed(1);
            const totalElapsed = Date.now() - startTime;
            const avgTimePerBatch = totalElapsed / Math.ceil(processed / batch);
            const remainingBatches = Math.ceil((totalCount - processed) / batch);
            const estimatedTimeLeft = (remainingBatches * avgTimePerBatch) / 1000 / 60; // minutes

            console.log(`✅ Batch complete: ${items.length} recipes (${alteredCount} with JSON)`);
            console.log(`   📈 Progress: ${processed}/${totalCount} (${progress}%)`);
            console.log(`   ⏱️  Timing: embed=${embedDuration}ms, db=${dbDuration}ms, total=${batchDuration}ms`);
            console.log(`   🕐 ETA: ~${estimatedTimeLeft.toFixed(1)} minutes remaining`);
            console.log(`   💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
            console.log("─".repeat(50));

            // Force garbage collection and add small delay
            if (global.gc) {
                global.gc();
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Half second pause between batches
        }

        const totalDuration = (Date.now() - startTime) / 1000 / 60; // minutes
        console.log("🎉 Done!");
        console.log(`📊 Total processed: ${processed} recipes in ${totalDuration.toFixed(1)} minutes`);
        console.log(`⚡ Average: ${(processed / totalDuration).toFixed(0)} recipes/minute`);

    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
})();