// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeUrl } from "./types";
import {ClaudeBatchProvider} from "../../ai-providers/claude-batch";
import {Prisma} from "@prisma/client";
import {RecipeJson} from "../../types";

type Paragraph = { text?: string; [k: string]: any };

const claude = new ClaudeBatchProvider();

export async function process() {
    await iterate(prisma.recipeUrl)
        .select({
            id: true,
            articleBatchId: true,
            json: true,
            jsonAltered: true
        })
        .where({
            articleBatchId: { not: null },
            jsonAltered: { equals: Prisma.DbNull }
        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: RecipeUrl) => {
            const batchId = recipe.articleBatchId as unknown as string | null;
            if (!batchId) {
                console.log(`Recipe ${recipe.id}: no batchId, skipping`);
                return;
            }

            try {
                const results = await claude.getBatchResults(batchId);
                const parsed = recipe.json ? JSON.parse(recipe.json) : null;
                const paragraphs: Paragraph[] | undefined = parsed?.paragraphs;

                if (!Array.isArray(paragraphs)) {
                    console.log(`Recipe ${recipe.id}: No paragraphs to update, skipping`);
                    return;
                }

                // Replace paragraph texts with rewritten versions
                let updatedCount = 0;
                const updatedParagraphs = paragraphs.map((paragraph, index) => {
                    const result = results.find(r => r.customId === String(index));
                    if (result && result.status === "completed" && paragraph.text) {
                        updatedCount++;
                        return {
                            ...paragraph,
                            text: result.result,
                        };
                    }
                    return paragraph;
                });

                // Restore complete JSON structure with updated paragraphs
                const updatedJson: RecipeJson = { ...parsed, paragraphs: updatedParagraphs };

                // Update the database with the new jsonAltered
                await prisma.recipeUrl.update({
                    where: { id: recipe.id },
                    data: {
                        jsonAltered: updatedJson as Prisma.InputJsonValue
                    }
                });

                console.log(`Recipe ${recipe.id}: Updated ${updatedCount}/${results.length} paragraphs in JSON structure`);

                // Show any errors
                const errors = results.filter(r => r.status !== "completed");
                if (errors.length > 0) {
                    console.log(`  ❌ ${errors.length} failed: ${errors.map(e => `[${e.customId}] ${e.error ?? "unknown"}`).join(', ')}`);
                }

            } catch (err: any) {
                console.error(`Error fetching results for recipe ${recipe.id} (batch ${batchId}):`, err?.message ?? err);
            }
        });

    console.log("\x1b[32m%s\x1b[0m", "Result retrieval and JSON restoration complete");
}

void process();