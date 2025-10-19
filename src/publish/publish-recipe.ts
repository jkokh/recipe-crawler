import "dotenv/config";
import slugify from "slugify";
import { PrismaClient as PrismaCrawler } from "@prisma/crawler";
import { PrismaClient as PrismaPublic, Role } from "@prisma/public";

const crawler = new PrismaCrawler();
const pub = new PrismaPublic();

async function getValidUserId(queueUserId: number | null): Promise<number> {
    // If userId exists in queue, validate it exists and is a publisher
    if (queueUserId) {
        const user = await pub.user.findFirst({
            where: {
                id: queueUserId,
                role: Role.PUBLISHER,
            },
        });

        if (user) {
            return user.id;
        }

        console.warn(`⚠️  User ${queueUserId} not found or not a publisher, selecting random publisher...`);
    }

    // Fallback: get random publisher
    const publishers = await pub.user.findMany({
        where: { role: Role.PUBLISHER },
        select: { id: true },
    });

    if (publishers.length === 0) {
        throw new Error("No publishers found in the system");
    }

    const randomPublisher = publishers[Math.floor(Math.random() * publishers.length)];
    return randomPublisher.id;
}

async function publishNextRecipe() {
    // Find the pending recipe with the earliest scheduled time
    const queueItem = await crawler.publicationQueue.findFirst({
        where: { status: "pending" },
        orderBy: { scheduledAt: "asc" },
        select: {
            id: true,
            sourceId: true,
            userId: true,
            scheduledAt: true,
        },
    });

    if (!queueItem) {
        console.log("📭 No pending recipes in queue.");
        return;
    }

    console.log(`📋 Found queued recipe: sourceId=${queueItem.sourceId}, scheduled for ${queueItem.scheduledAt.toLocaleString()}`);

    const src = await crawler.source.findUnique({
        where: { id: queueItem.sourceId },
        select: {
            id: true,
            source: true,
            jsonAltered: true,
        },
    });

    if (!src) {
        console.error(`❌ Source ${queueItem.sourceId} not found.`);
        await crawler.publicationQueue.update({
            where: { id: queueItem.id },
            data: { status: "failed" },
        });
        return;
    }

    const json = src.jsonAltered as any;
    if (!json) {
        console.error(`❌ Source ${queueItem.sourceId} has no jsonAltered field.`);
        await crawler.publicationQueue.update({
            where: { id: queueItem.id },
            data: { status: "failed" },
        });
        return;
    }

    // Check if already published
    const existing = await pub.recipe.findUnique({
        where: { sourceId: src.id },
    });

    if (existing) {
        console.log(`⚠️ Recipe ${queueItem.sourceId} already published, marking as published.`);
        await crawler.publicationQueue.update({
            where: { id: queueItem.id },
            data: { status: "published" },
        });
        return;
    }

    // Get valid user ID
    const userId = await getValidUserId(queueItem.userId);
    const user = await pub.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });

    console.log(`📤 Publishing recipe: ${json.title} (Publisher: ${user?.username})`);

    try {
        await pub.recipe.create({
            data: {
                sourceId: src.id,
                title: json.title,
                source: src.source,
                slug: slugify(json.title, { lower: true, strict: true }),
                json,
                categories: {
                    connect: (json.categories ?? []).map((id: number) => ({ id })),
                },
                tags: {
                    connect: (json.tags ?? []).map((id: number) => ({ id })),
                },
                ingredients: {
                    connect: (json.ingredients ?? [])
                        .map((i: any) => i.ingredientId)
                        .filter(Boolean)
                        .map((id: number) => ({ id })),
                },
                User: {
                    connect: { id: userId },
                },
            },
        });

        // Mark as published in queue
        await crawler.publicationQueue.update({
            where: { id: queueItem.id },
            data: { status: "published" },
        });

        console.log(`✅ Published: ${json.title} by ${user?.username}`);
    } catch (error) {
        console.error(`❌ Failed to publish recipe ${queueItem.sourceId}:`, error);
        await crawler.publicationQueue.update({
            where: { id: queueItem.id },
            data: { status: "failed" },
        });
    }
}

publishNextRecipe()
    .catch((err) => console.error(err))
    .finally(async () => {
        await crawler.$disconnect();
        await pub.$disconnect();
    });