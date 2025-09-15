// scripts/recipes.show-categories.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Env/CLI knobs
const LIMIT        = Number(process.env.LIMIT ?? "50");   // recipes per page
const OFFSET       = Number(process.env.OFFSET ?? "0");   // skip N recipes
const ONLY_WITH    = (process.env.ONLY_WITH ?? "any");    // "any" | "primary"
const SLUG         = process.env.SLUG ?? "";              // show one recipe by slug
const ID           = process.env.ID ? Number(process.env.ID) : undefined; // or by ID
const SHOW_EMPTY   = (process.env.SHOW_EMPTY ?? "false").toLowerCase() === "true"; // list recipes w/o categories

async function main() {
    // Build where clause
    const whereSingle =
        SLUG ? { slug: SLUG } :
            ID   ? { id: ID } :
                undefined;

    // Relation filters
    const categoryFilter =
        ONLY_WITH === "primary"
            ? { categories: { some: { primary: true } } }
            : { categories: { some: {} } };

    const where =
        whereSingle
            ? whereSingle
            : (SHOW_EMPTY ? {} : categoryFilter);

    const recipes = await prisma.recipe.findMany({
        where,
        select: {
            id: true,
            slug: true,
            title: true,
            categories: {
                select: {
                    categoryId: true,
                    category: { select: { id: true, title: true, slug: true, parentId: true } },
                },
            },
        },
        orderBy: [{ id: "asc" }],
        take: whereSingle ? undefined : LIMIT,
        skip: whereSingle ? undefined : OFFSET,
    });

    if (!recipes.length) {
        console.log("No recipes found for the given filters.");
        return;
    }

    for (const r of recipes) {
        const links = [...r.categories];

        // Header
        console.log(
            `\n#${String(r.id).padStart(5)}  ${r.title}  (${r.slug})`
        );

        if (!links.length) {
            console.log("  — no categories");
            continue;
        }

        // Pretty rows
        const rows = links.map((l, idx) => ({
            rank: idx + 1,
            categoryId: l.categoryId,
            category: l.category?.title ?? "(unknown)",
            slug: l.category?.slug ?? "",
            parentId: l.category?.parentId ?? null,
        }));

        // Console table
        console.table(rows);
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
