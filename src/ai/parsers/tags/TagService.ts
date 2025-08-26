import { PrismaClient } from '@prisma/client';
import {buildSlug, toDisplayName} from "../../../utils";


export class TagService {
    constructor(private prisma = new PrismaClient()) {}

    /** Resolve names to tag IDs by exact slug match; create if missing.
     *  No preload, no aliases, no fuzzy.
     */
    async resolveTags(names: string[]): Promise<number[]> {
        const out: number[] = [];
        const seen = new Set<string>();

        for (const raw of names) {
            const slug = buildSlug(raw);
            if (!slug || seen.has(slug)) continue;
            seen.add(slug);

            // Concurrency-safe: if exists, returns existing; else creates new.
            const tag = await this.prisma.tag.upsert({
                where: { slug },
                update: {},                               // do not overwrite existing name
                create: { slug, name: toDisplayName(raw) },
                select: { id: true },
            });

            out.push(tag.id);
        }
        return out;
    }

    async attachTagsToRecipe(recipeId: number, tagIds: number[]): Promise<void> {
        if (!tagIds.length) return;
        await this.prisma.recipeTagLink.createMany({
            data: tagIds.map(tagId => ({ recipeId, tagId })),
            skipDuplicates: true,
        });
    }
}
