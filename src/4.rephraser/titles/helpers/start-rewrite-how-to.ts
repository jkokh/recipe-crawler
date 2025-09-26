import "dotenv/config";

import { prisma } from "../../../lib/iterator";
import {PhraseService} from "../../../lib/Phrase";
import {GPTProvider} from "../../../lib/ai-providers/gpt";

const phraseService = new PhraseService();
const gpt = new GPTProvider();

function makePrompt(title: string, json: any): string {
    const jsonStr = JSON.stringify(json);
    return `
Rewrite this recipe title to be clear, descriptive, and SEO-friendly.
Avoid generic adjectives like "delicious" or "tasty." Don't use any spammy words.
Don't use "How to Make". Keep the length of the title 50-70 characters.
Return only the rewritten title.

TITLE: ${title}
DATA: ${jsonStr}
  `.trim();
}

async function fetchContext(sourceId: number): Promise<{ title?: string; paragraphs?: unknown } | null> {
    const src = await prisma.source.findUnique({
        where: { id: sourceId },
        select: { jsonParsed: true }
    });
    const data: any = src?.jsonParsed;
    if (!data || typeof data !== "object") return null;
    const { title, paragraphs } = data as { title?: string; paragraphs?: unknown };
    if (!title && !paragraphs) return null;
    return { title, paragraphs };
}

export async function process() {
    try {
        const rows = await prisma.phrase.findMany({
            select: { sourceId: true, text: true },
            orderBy: { sourceId: "asc" }
        });

        console.log(`Processing ${rows.length} phrase(s)`);

        for (const r of rows) {
            try {
                const ctx = await fetchContext(r.sourceId);
                if (!ctx) continue;

                const seed = typeof ctx.title === "string" ? ctx.title : r.text;
                const out = await gpt.ask(makePrompt(seed, ctx));
                if (typeof out !== "string") {
                    console.error(`❌ GPT returned non-string for sourceId ${r.sourceId}`);
                    continue;
                }
                const rewritten = out.trim();
                if (!rewritten) continue;

                await phraseService.store({
                    phrase: rewritten,
                    sourceId: r.sourceId,
                    type: "title",
                    version: "gpt v1"
                });
            } catch (err: any) {
                console.error(`❌ Error processing sourceId ${r.sourceId}:`, err?.message ?? err);
            }
        }

        console.log("\x1b[32m%s\x1b[0m", "Done!");
    } catch (err: any) {
        console.error("❌ Failed to fetch phrases:", err?.message ?? err);
    }
}

void process();
