import { PrismaClient } from "@prisma/client";
import {embed} from "../../lib/embed";
import {toBytes} from "../../lib/vec";

const prisma = new PrismaClient();
const MODEL = "Xenova/bge-m3";

interface RecipeLike {
    id: number;
    title: string;
    description?: string | null;
    seo?: string | null;
}

export function textOf(r: RecipeLike): string {
    const title = r.title?.trim() ?? "";

    const seo = r.seo?.trim() ?? "";

    const rawDescription = r.description ?? "";
    const plainDescription = rawDescription
        .replace(/<[^>]+>/g, " ")   // remove HTML tags
        .replace(/\s+/g, " ")       // collapse whitespace
        .trim()
        .slice(0, 4000);

    return [title, seo, plainDescription]
        .filter(Boolean)
        .join("\n");
}

(async () => {
    const batch = 200;
    for (;;) {
        const items: RecipeLike[] = await prisma.recipe.findMany({
            where: { embeddings: { is: null } },

            select: { id:true, title:true, description: true, seo: true },
            take: batch,
        });
        if (!items.length) break;
        const vecs = await embed(items.map(textOf), "passage");
        await prisma.$transaction(items.map((r,i) =>
            prisma.recipeEmbedding.upsert({
                where: { recipeId: r.id },
                create: { recipeId: r.id, vector: toBytes(vecs[i]), dim: vecs[i].length, model: MODEL },
                update: { vector: toBytes(vecs[i]), dim: vecs[i].length, model: MODEL },
            })
        ));
        console.log(`Embedded ${items.length} recipes…`);
    }
    console.log("Done.");
    process.exit(0);
})();
