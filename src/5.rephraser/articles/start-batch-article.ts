import { iterate, prisma } from "../../lib/iterator";
import {ClaudeBatchProvider} from "../../lib/ai-providers/claude-batch";
import {Source} from "@prisma/client";
import {RecipeJson} from "../../types";

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
        .forEachAsync(async (source: Source) => {
            try {
                const parsed = source.jsonParsed as RecipeJson;
                const paragraphs = parsed?.paragraphs;

                if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
                    console.log(`Recipe ${source.id}: No paragraphs, skipping`);
                    return;
                }

                const work = paragraphs
                    .map((p, i) => (typeof p.text === "string" ? { id: String(i), text: p.text } : null))
                    .filter((x): x is { id: string; text: string } => x !== null);

                if (work.length === 0) {
                    console.log(`Recipe ${source.id}: No paragraph.text strings, skipping`);
                    return;
                }

                // build requests for this recipe
                const requests = work.map((w) => ({
                    customId: w.id,
                    prompt: makePrompt(w.text),
                }));

                // submit a batch per recipe
                const batchId = await claude.submitBatch(requests);

                // save the batch ID to a file
                /*await prisma.source.update({
                    where: { id: source.id },
                    data: { batchId },
                });*/

                console.log(`Recipe ${source.id}: submitted batch ${batchId} and saved to DB`);


                // no status polling / no results fetching here
            } catch (err: any) {
                console.error(`Error processing recipe ${source.id}:`, err?.message ?? err);
            }
        });

    console.log("\x1b[32m%s\x1b[0m", `Processing complete`);
}

void process();
