import "dotenv/config";
import {Prisma, PrismaClient as PrismaCrawler } from "@prisma/crawler";

const crawler = new PrismaCrawler();

// Configuration
const RECIPES_PER_DAY = 5;
const WINDOW_START_HOUR = 7;   // 07:00
const WINDOW_END_HOUR = 23;    // 23:00
const SLOT_GAP_MINUTES = 10;
const DAYS_TO_SCHEDULE = 7;

function generateDaySchedule(date: Date, recipeCount: number): Date[] {
    const windowStart = new Date(date).setHours(WINDOW_START_HOUR, 0, 0, 0);
    const windowEnd = new Date(date).setHours(WINDOW_END_HOUR, 0, 0, 0);
    const slotDuration = (windowEnd - windowStart) / recipeCount;
    const gapMs = SLOT_GAP_MINUTES * 60 * 1000;

    const times: Date[] = [];

    for (let i = 0; i < recipeCount; i++) {
        const slotStart = windowStart + (i * slotDuration);
        const slotEnd = slotStart + slotDuration;

        // Add gap after first slot
        const effectiveStart = i === 0 ? slotStart : slotStart + gapMs;
        const randomTime = effectiveStart + Math.random() * (slotEnd - effectiveStart);

        times.push(new Date(randomTime));
    }

    return times;
}

async function main() {
    console.log("📋 Queueing recipes for publication\n");

    // Find last scheduled date
    const lastScheduled = await crawler.publicationQueue.findFirst({
        where: { status: "pending" },
        orderBy: { scheduledAt: "desc" },
    });

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (lastScheduled) {
        startDate.setTime(lastScheduled.scheduledAt.getTime());
        startDate.setDate(startDate.getDate() + 1);
        console.log(`📅 Continuing from: ${startDate.toLocaleDateString()}\n`);
    } else {
        console.log(`📅 Starting from today\n`);
    }

    // Get eligible recipes
    const eligible = await crawler.source.findMany({
        where: {
            checked: true,
            flagged: false,
            needsReview: null,
            jsonAltered: { not: Prisma.DbNull },
            publicationQueue: null
        },
        select: { id: true },
    });

    if (eligible.length === 0) {
        console.log("⚠️  No eligible recipes");
        return;
    }

    // Randomly select recipes
    const needed = RECIPES_PER_DAY * DAYS_TO_SCHEDULE;
    const selected = eligible
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(needed, eligible.length));

    console.log(`✅ Selected ${selected.length} recipes\n`);

    // Generate schedule
    const schedule: Date[] = [];
    let remaining = selected.length;
    let day = 0;

    while (remaining > 0) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + day);

        const recipesForDay = Math.min(RECIPES_PER_DAY, remaining);
        const dayTimes = generateDaySchedule(currentDate, recipesForDay);

        schedule.push(...dayTimes);
        remaining -= recipesForDay;
        day++;
    }

    // Save to database
    for (let i = 0; i < selected.length; i++) {
        await crawler.publicationQueue.create({
            data: {
                sourceId: selected[i].id,
                scheduledAt: schedule[i],
                status: "pending",
            },
        });
        console.log(`📅 Recipe ${selected[i].id} → ${schedule[i].toLocaleString()}`);
    }

    console.log(`\n🎉 Queued ${selected.length} recipes`);
    console.log(`📆 ${schedule[0].toLocaleDateString()} - ${schedule[schedule.length - 1].toLocaleDateString()}`);
}

main()
    .catch((err) => console.error(err))
    .finally(async () => {
        await crawler.$disconnect();
    });