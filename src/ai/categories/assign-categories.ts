// scripts/assignCategories_bm25.ts
import { PrismaClient, CategoryType } from "@prisma/client";
import MiniSearch from "minisearch";

const prisma = new PrismaClient();

const TYPE_LIMITS: Record<CategoryType, number> = {
    CUISINE: 1,
    DISH: 1,
    METHOD: 2,
    COURSE: 1,
    DIET: 1,
    OCCASION: 1,
    OTHER: 0,
};

// Use margin (relative decision) instead of absolute thresholds for BM25
const MARGIN = 0.02;
const FALLBACK_CATEGORY_ID: number | null = null;

const tok = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

function stripHtml(s: string | null | undefined) {
    return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

type CatDoc = {
    id: number;
    type: CategoryType;
    title: string;
    text: string;
    tokens: Set<string>;
    minScore?: number | null;
};

async function buildCategoryIndex() {
    const cats = await prisma.category.findMany({
        include: { aliases: true },
        orderBy: { id: "asc" },
    });

    const docs: CatDoc[] = cats.map((c) => {
        const text = [c.title ?? "", ...c.aliases.map((a) => a.phrase)]
            .filter(Boolean)
            .join(". ");
        const tokens = new Set<string>([
            ...tok(c.title),
            ...c.aliases.flatMap((a) => tok(a.phrase)),
        ]);
        return {
            id: c.id,
            type: c.type,
            title: c.title,
            text,
            tokens,
            minScore: c.minScore,
        };
    });

    const mini = new MiniSearch<CatDoc>({
        fields: ["title", "text"],
        storeFields: ["id", "type", "title"],
        tokenize: (s) => tok(s),
    });

    mini.addAll(docs);

    const docById = new Map<number, CatDoc>(docs.map((d) => [d.id, d]));
    return { mini, docById };
}

function buildQueryText(recipe: {
    title: string;
    description: string | null;
    ingredients: { text: string; ingredient?: { canonicalName: string } | null }[];
}) {
    const ingCanon = recipe.ingredients
        .map((ri) => ri.ingredient?.canonicalName)
        .filter(Boolean) as string[];
    const ingFree = recipe.ingredients.map((ri) => ri.text);
    return [recipe.title, stripHtml(recipe.description), "ingredients:", ingCanon.join(", "), ingFree.join(", ")]
        .filter(Boolean)
        .join(" ")
        .trim();
}

type Hit = { id: number; type: CategoryType; title: string; score: number };

function selectPerType(
    hits: Hit[],
    opts: {
        docById: Map<number, CatDoc>;
        queryTokens: Set<string>;
    }
): Hit[] {
    const byType = new Map<CategoryType, Hit[]>();
    for (const h of hits) {
        if (!byType.has(h.type)) byType.set(h.type, []);
        byType.get(h.type)!.push(h);
    }

    const chosen: Hit[] = [];

    for (const [type, arrRaw] of byType.entries()) {
        // CUISINE: require evidence (overlap with category tokens)
        const arr =
            type === CategoryType.CUISINE
                ? arrRaw.filter((h) => {
                    const doc = opts.docById.get(h.id)!;
                    for (const t of doc.tokens) if (opts.queryTokens.has(t)) return true;
                    return false;
                })
                : arrRaw;

        const limit = TYPE_LIMITS[type] ?? 0;
        if (!limit || arr.length === 0) continue;

        arr.sort((a, b) => b.score - a.score);
        const top = arr[0];
        const second = arr[1]?.score ?? -Infinity;

        // margin-only gating for BM25 (uncalibrated absolute scores)
        const ok = second === -Infinity ? true : (top.score - second) >= MARGIN;
        if (!ok) continue;

        chosen.push(...arr.slice(0, limit));
    }

    return chosen.sort((a, b) => b.score - a.score);
}

async function assignAll() {
    const { mini, docById } = await buildCategoryIndex();

    const batch = 200;
    for (;;) {
        const recipes = await prisma.recipe.findMany({
            take: batch,
            where: { categories: { none: {} } },
            orderBy: { id: "asc" },
            include: {
                ingredients: {
                    include: { ingredient: { select: { canonicalName: true } } },
                },
            },
        });
        if (!recipes.length) break;

        for (const r of recipes) {
            const q = buildQueryText({
                title: r.title,
                description: r.description,
                ingredients: r.ingredients,
            });

            const raw = mini.search(q, {
                prefix: true,
                fuzzy: 0.2,
                fields: ["title", "text"],
                boost: { title: 3, text: 1 },
            });

            const hits: Hit[] = raw.map((x) => ({
                id: (x as any).id as number,
                type: (x as any).type as CategoryType,
                title: (x as any).title as string,
                score: x.score || 0,
            }));

            const queryTokens = new Set<string>(tok(q));
            let winners = selectPerType(hits, { docById, queryTokens });

            // fallback: if nothing passes, pick global top hit or configured fallback
            if (winners.length === 0) {
                if (FALLBACK_CATEGORY_ID) {
                    const fb = hits.find((h) => h.id === FALLBACK_CATEGORY_ID);
                    if (fb) winners = [fb];
                }
                if (winners.length === 0 && hits.length > 0) {
                    winners = [hits[0]];
                }
            }

            let maxScore = winners.reduce((m, h) => Math.max(m, h.score), 0) || 1;
            if (maxScore <= 0) maxScore = 1;

            await prisma.$transaction(async (tx) => {
                await tx.recipeCategory.deleteMany({ where: { recipeId: r.id } });
                for (const w of winners) {
                    const score01 = Math.min(1, Math.max(0, w.score / maxScore));
                    await tx.recipeCategory.create({
                        data: { recipeId: r.id, categoryId: w.id, score: score01 },
                    });
                }
            });
        }

        console.log(`Processed ${recipes.length} recipes`);
    }

    console.log("Done.");
}

assignAll()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
