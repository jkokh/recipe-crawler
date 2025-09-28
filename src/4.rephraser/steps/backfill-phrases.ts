import "dotenv/config";
import {prisma} from "../../lib/iterator";
import {PhraseService} from "../../lib/Phrase";


const phraseService = new PhraseService();

export async function process() {
    // Get all steps joined with their sourceId
    const steps = await prisma.recipeStep.findMany({
        orderBy: [{ recipeId: "asc" }, { order: "asc" }, { id: "asc" }],
        select: {
            id: true,
            order: true,
            title: true,
            titleAlt: true,
            text: true,
            textAlt: true,
            recipe: {
                select: {
                    sources: { select: { id: true } }
                }
            }
        }
    });

    let created = 0;
    let skipped = 0;
    let noSource = 0;

    for (const step of steps) {
        const sourceId = step.recipe?.sources?.id;
        if (!sourceId) {
            noSource++;
            continue;
        }

        const version = `step-${step.order}`;

        // Title
        if (step.title) {
            await phraseService.store({
                originalText: step.title,
                alteredText: step.titleAlt ?? step.title,
                sourceId,
                type: "step.title",
                version
            });
            created++;
        } else {
            skipped++;
        }

        // Text
        if (step.text) {
            await phraseService.store({
                originalText: step.text,
                alteredText: step.textAlt ?? step.text,
                sourceId,
                type: "step.text",
                version
            });
            created++;
        } else {
            skipped++;
        }
    }

    console.log(
        `Done. Steps: ${steps.length}, Phrases created: ${created}, Skipped(empty): ${skipped}, Missing source: ${noSource}`
    );
}

void process();
