import { prisma } from "../../lib/iterator";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import { BATCH_ID_FILE } from "../../constants";

async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true },
        where: { flagged: true },
        orderBy: { id: "asc" },
    });

    console.log(`Found ${sources.length} flagged sources`);

    if (sources.length === 0) {
        console.log("No flagged sources to process");
        await prisma.$disconnect();
        return;
    }

    const processor = new OpenAIBatchProcessor({ batchIdsFile: BATCH_ID_FILE });
    const results = await processor.fetchResultsArray();

    console.log(`Fetched ${results.length} batch results`);

    let updated = 0;

    for (const [i, result] of results.entries()) {
        const response = result.text.trim();
        if (!result.sourceId) continue;

        if (response.toUpperCase().startsWith("FOUND:")) {
            const issues = response.substring(6).trim();
            await prisma.source.update({
                where: { id: result.sourceId },
                data: {
                    needsReview: issues || "FOUND",
                    flagged: true,
                },
            });
        } else {
            await prisma.source.update({
                where: { id: result.sourceId },
                data: {
                    needsReview: null,
                    flagged: false,
                },
            });
        }

        updated++;
        if ((i + 1) % 20 === 0 || i + 1 === results.length) {
            process.stdout.write(`\rProcessed ${i + 1}/${results.length} results...`);
        }
    }

    console.log(`\n✅ Updated ${updated} sources.`);
    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("❌ Content review result processing failed:", err);
    await prisma.$disconnect();
});
