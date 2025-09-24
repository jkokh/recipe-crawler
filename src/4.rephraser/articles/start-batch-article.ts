// process.ts
import { iterate, prisma } from "../../lib/iterator";
import { RecipeUrl } from "./types";
import {ClaudeBatchProvider} from "../../lib/ai-providers/claude-batch";

type Paragraph = { text?: string; [k: string]: any };

const claude = new ClaudeBatchProvider();

function makePrompt(text: string): string {
    return `Rewrite the text to be neutral and instructional using new wording.

Rules (apply silently):
- Remove first-person, nostalgia, speculation, and marketing tone
- Try to avoid definitive sentences that start with the subject term (e.g., "Dirt cakes are…")
- Preserve all facts, measurements, times, and proper nouns exactly; do not add details.
- Keep overall length similar to the original; target 100% of the source characters (±20%)
- Keep brand names only if already present; do not add new brands.
- Trim hedging and filler
- Even if the input text looks incomplete, still rewrite it or keep it as is
- Do not add lists, headings, or formatting
- No /n or /r characters or /n/n
- Output ONLY the rewritten text. No headings, notes, or commentary

Text to rewrite:
${text}`;
}


export async function process() {
    await iterate(prisma.source)
        .select({
            id: true,
            recipeId: true,
            recipeUrl: true,
            json: true,
        })
        .where({
            articleBatchId: null,
        })
        .orderBy({ id: 'asc' })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (recipe: RecipeUrl) => {
            try {
                const parsed = recipe.json ? JSON.parse(recipe.json) : null;
                const paragraphs: Paragraph[] | undefined = parsed?.paragraphs;

                if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
                    console.log(`Recipe ${recipe.id}: No paragraphs, skipping`);
                    return;
                }

                const work = paragraphs
                    .map((p, i) => (typeof p.text === "string" ? { id: String(i), text: p.text } : null))
                    .filter((x): x is { id: string; text: string } => x !== null);

                if (work.length === 0) {
                    console.log(`Recipe ${recipe.id}: No paragraph.text strings, skipping`);
                    return;
                }

                // build requests for this recipe
                const requests = work.map((w) => ({
                    customId: w.id,
                    prompt: makePrompt(w.text),
                }));

                // submit a batch per recipe
                const batchId = await claude.submitBatch(requests);

                await prisma.source.update({
                    where: { id: recipe.id },
                    data: { batchId },
                });

                console.log(`Recipe ${recipe.id}: submitted batch ${batchId} and saved to DB`);


                // no status polling / no results fetching here
            } catch (err: any) {
                console.error(`Error processing recipe ${recipe.id}:`, err?.message ?? err);
            }
        });

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
}

void process();
