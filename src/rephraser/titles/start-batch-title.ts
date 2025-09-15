// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeUrl } from "./types";
import { ClaudeBatchProvider } from "../../ai-providers/claude-batch";
import { RecipeJson } from "../../types";
import { appendFileSync } from "fs";

const claude = new ClaudeBatchProvider();

function makePrompt(title: string): string {
    return `Rewrite this recipe TITLE to be neutral and objective.

RULES (apply silently):
• Remove first-person or family references (I, my, our, we, grandma, mom, etc.).
• Do NOT add new adjectives or descriptors that are not in the original text
  (e.g., classic, easy, delicious, amazing, special, ultimate).
• Keep only the factual elements already present (ingredients, numbers, dish name).
• Use natural phrasing in Title Case.
• Output ONE line of plain text only — no notes, no formatting, no newlines (\\n or \\r).

TITLE:
${title}
`;
}

export async function processRecipes() {
    const batchIdsFile = 'batch-ids.txt';

    await iterate(prisma.recipeUrl)
        .select({
            id: true,
            recipeId: true,
            recipeUrl: true,
            jsonAltered: true,
        })
        .where({
        })
        .orderBy({ id: 'asc' })
        .startPosition(1)
        .perPage(40)
        .entityName("recipes")
        .getPageResults(async (recipes: RecipeUrl[]) => {
            try {
                const ids = recipes.map(recipe => recipe.id);
                const requests = recipes.map((recipe) => {
                    const json = recipe.jsonAltered as RecipeJson;
                    return {
                        customId: recipe.id.toString(),
                        prompt: makePrompt(json.title)
                    };
                });
                const batchId = await claude.submitBatch(requests);
                const logEntry = `${batchId}\n`;
                try {
                    appendFileSync(batchIdsFile, logEntry);
                } catch (fileErr) {
                    console.error('Error writing to batch IDs file:', fileErr);
                }
                console.log(`Recipes: submitted batch ${batchId} and saved to file`);
            } catch (err: any) {
                console.error(`Error processing recipe batch:`, err?.message ?? err);

                // Log the error to file as well
                const errorEntry = `${new Date().toISOString()} - ERROR: ${err?.message ?? err}\n`;
                try {
                    appendFileSync(batchIdsFile, errorEntry);
                } catch (fileErr) {
                    console.error('Error writing error to batch IDs file:', fileErr);
                }
            }
        });

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
    console.log("\x1b[36m%s\x1b[0m", `Batch IDs written to: ${batchIdsFile}`);
}

void processRecipes();