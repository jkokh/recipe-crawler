import { PrismaClient } from "@prisma/client";
import { cosine, fromBytes } from "../../lib/vec";

const prisma = new PrismaClient();

/**
 * Tunables (general, precision-first but with guaranteed fallback)
 */
const PARENT_THRESH       = 0.78; // consider internal nodes at/above this
const LEAF_THRESH         = 0.82; // accept leaves at/above this
const ROOTS_TO_EXPLORE    = 3;    // explore top-R roots per recipe
const BEAM_WIDTH          = 4;    // expand only top-B children per level across the frontier
const MAX_TOTAL           = 4;    // global cap of labels per recipe

// Crispness gates within each branch
const HIGH_CONF           = 0.86; // auto-accept leaf >= this
const BRANCH_MARGIN_MIN   = 0.02; // else need this margin over 2nd-best leaf
const INTERNAL_STRONG_MIN = 0.83; // accept best internal if no leaf & >= this

type CatNode = {
    id: number;
    parentId: number | null;
    title: string;
    centroid: Float32Array;
    dim: number;
    children: number[];
};

(async () => {
    // Fresh pass
    await prisma.recipeCategory.deleteMany();

    // -------- load categories + centroids (+topology) --------
    const cats = await prisma.category.findMany({
        include: { centroid: true, children: true, parent: true },
    });

    const centroidIds = new Set<number>(cats.filter(c => !!c.centroid).map(c => c.id));

    const byId = new Map<number, CatNode>();
    for (const c of cats) {
        if (!c.centroid) continue;
        byId.set(c.id, {
            id: c.id,
            parentId: c.parentId,
            title: c.title,
            centroid: fromBytes(Buffer.from(c.centroid.vector), c.centroid.dim),
            dim: c.centroid.dim,
            children: c.children.map(ch => ch.id).filter(id => centroidIds.has(id)),
        });
    }

    // Roots = nodes with centroids and parentId=null
    const roots = [...byId.values()].filter(n => n.parentId == null).map(n => n.id);
    if (roots.length === 0) {
        console.error("No root categories with centroids found. Aborting.");
        process.exit(1);
    }

    function collectBranchCandidates(
        v: Float32Array,
        rootId: number
    ): {
        leaves: Array<{ id: number; s: number }>;
        bestInternal: { id: number; s: number } | null;
    } {
        const leaves: Array<{ id: number; s: number }> = [];
        let bestInternal: { id: number; s: number } | null = null;

        let frontier: number[] = [rootId];

        while (frontier.length > 0) {
            // Score current frontier
            const scoredFrontier = frontier
                .map(id => {
                    const n = byId.get(id)!;
                    return { id, s: cosine(v, n.centroid) };
                })
                .sort((a, b) => b.s - a.s);

            // Prepare next-level pool
            const nextPool: Array<{ id: number; s: number }> = [];

            for (const { id, s } of scoredFrontier) {
                const node = byId.get(id)!;

                // Track best internal fallback
                if (node.children.length > 0 && s >= PARENT_THRESH) {
                    if (!bestInternal || s > bestInternal.s) bestInternal = { id, s };
                }

                if (node.children.length === 0) {
                    // Leaf
                    if (s >= LEAF_THRESH) leaves.push({ id, s });
                } else {
                    // Score children and add to a global pool; we'll keep only top-BEAM
                    for (const cid of node.children) {
                        const cn = byId.get(cid)!;
                        nextPool.push({ id: cid, s: cosine(v, cn.centroid) });
                    }
                }
            }

            if (nextPool.length === 0) break;

            // Global beam: keep only best BEAM_WIDTH children for next level
            nextPool.sort((a, b) => b.s - a.s);
            frontier = nextPool.slice(0, BEAM_WIDTH).map(x => x.id);
        }

        return { leaves, bestInternal };
    }

    // -------- main loop --------
    const batch = 200;
    let totalAssigned = 0;

    for (;;) {
        const rows = await prisma.recipeEmbedding.findMany({
            take: batch,
            where: { recipe: { categories: { none: {} } } }, // unassigned
            include: { recipe: true },
            orderBy: { recipeId: "asc" },
        });
        if (!rows.length) break;

        for (const row of rows) {
            const v = fromBytes(Buffer.from(row.vector), row.dim);

            // 1) Rank roots by similarity (centroid of root)
            const rootScores = roots
                .map(rid => ({ id: rid, s: cosine(v, byId.get(rid)!.centroid) }))
                .sort((a, b) => b.s - a.s)
                .slice(0, ROOTS_TO_EXPLORE);

            // 2) For each selected branch, beam-search and apply crisp gating
            const winners: Array<{ id: number; s: number }> = [];

            for (const { id: rootId } of rootScores) {
                const { leaves, bestInternal } = collectBranchCandidates(v, rootId);

                // Prefer leaves; apply confidence or margin guard
                if (leaves.length > 0) {
                    leaves.sort((a, b) => b.s - a.s);
                    const top = leaves[0];
                    const second = leaves[1]?.s ?? -Infinity;

                    const accept =
                        top.s >= HIGH_CONF ||
                        (second === -Infinity ? top.s >= LEAF_THRESH : (top.s - second) >= BRANCH_MARGIN_MIN);

                    if (accept) {
                        winners.push(top);
                        continue;
                    }
                }

                // Otherwise, fallback to a strong internal label if available
                if (bestInternal && bestInternal.s >= INTERNAL_STRONG_MIN) {
                    winners.push(bestInternal);
                }
            }

            // 3) GUARANTEED ASSIGNMENT FALLBACK
            // If no winners survived thresholds/margins, assign the single best overall node (prefer leaf)
            let final = winners;
            if (final.length === 0) {
                let bestLeaf: { id: number; s: number } | null = null;
                let bestAny: { id: number; s: number } | null = null;

                for (const n of byId.values()) {
                    const s = cosine(v, n.centroid);
                    if (!bestAny || s > bestAny.s) bestAny = { id: n.id, s };
                    if (n.children.length === 0) {
                        if (!bestLeaf || s > bestLeaf.s) bestLeaf = { id: n.id, s };
                    }
                }

                final = [bestLeaf ?? bestAny!]; // at least one exists since byId non-empty
            }

            // 4) Cap globally (keep the strongest N)
            final.sort((a, b) => b.s - a.s);
            final = final.slice(0, MAX_TOTAL);

            // 5) Persist (with scores)
            await prisma.$transaction(async tx => {
                await tx.recipeCategory.deleteMany({ where: { recipeId: row.recipeId } });
                for (const { id: categoryId, s } of final) {
                    await tx.recipeCategory.create({
                        data: { recipeId: row.recipeId, categoryId, score: s },
                    });
                }
            });

            totalAssigned += 1;
        }

        console.log(`Processed ${rows.length} | total assigned so far: ${totalAssigned}`);
    }

    console.log("Done. Assigned at least one category to every processed recipe.");
    process.exit(0);
})();
