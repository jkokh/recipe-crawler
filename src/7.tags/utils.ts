import { PrismaClient } from '@prisma/crawler';
import { buildSlug, toDisplayName } from '@/lib/utils';

/**
 * Load all tags from DB into a Map for the fast lookup
 */
export async function loadTagsCache(prisma: PrismaClient): Promise<Map<string, number>> {
    const tags = await prisma.tag.findMany({
        select: { id: true, slug: true }
    });

    return new Map(tags.map(tag => [tag.slug, tag.id]));
}

/**
 * Resolve tag names to tag IDs.
 * Uses cache to check existing tags, creates new ones if needed.
 */
export async function resolveTagsToIds(
    prisma: PrismaClient,
    tagNames: string[],
    tagsCache: Map<string, number>
): Promise<number[]> {
    const ids: number[] = [];
    const seen = new Set<string>();
    const tagsToCreate: Array<{ slug: string; name: string }> = [];

    // First pass: check cache and collect tags to create
    for (const name of tagNames) {
        const slug = buildSlug(name);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);

        const existingId = tagsCache.get(slug);
        if (existingId) {
            ids.push(existingId);
        } else {
            tagsToCreate.push({ slug, name: toDisplayName(name) });
        }
    }

    // Create new tags if needed
    if (tagsToCreate.length > 0) {
        for (const tagData of tagsToCreate) {
            try {
                // Try to create the tag
                const newTag = await prisma.tag.create({
                    data: tagData,
                    select: { id: true, slug: true }
                });

                // Update cache with a new tag
                tagsCache.set(newTag.slug, newTag.id);
                ids.push(newTag.id);
            } catch (error: any) {
                // Handle unique constraint violation from concurrent creation
                if (error.code === 'P2002') {
                    const existingTag = await prisma.tag.findUnique({
                        where: { slug: tagData.slug },
                        select: { id: true, slug: true }
                    });

                    if (existingTag) {
                        tagsCache.set(existingTag.slug, existingTag.id);
                        ids.push(existingTag.id);
                    } else {
                        console.warn(`Failed to find tag after constraint violation: ${tagData.slug}`);
                    }
                } else {
                    throw error;
                }
            }
        }
    }

    return ids;
}

/**
 * Merge existing and new tag IDs, removing duplicates
 */
export function mergeTagIds(
    existing: number[] | undefined | null,
    newIds: number[]
): number[] {
    const set = new Set<number>(Array.isArray(existing) ? existing : []);
    for (const id of newIds) set.add(id);
    return Array.from(set);
}

export function validateExistingTags(tags: any, tagsCache: Map<string, number>): number[] {
    if (!Array.isArray(tags)) return [];

    const validIds: number[] = [];
    const allTagIds = new Set(tagsCache.values());

    for (const id of tags) {
        if (typeof id === 'number' && allTagIds.has(id)) {
            validIds.push(id);
        }
    }

    return validIds;
}