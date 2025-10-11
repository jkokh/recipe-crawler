import { prisma } from "../../lib/iterator";
import { OpenAIBatchProcessor } from "../../lib/OpenAIBatchProcessor";
import {BATCH_ID_FILE, VERSION} from "../../constants";


async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true, jsonParsed: true },
        where: { version: VERSION },
        orderBy: { id: "asc" },
        //take: 2
    });

    console.log(`Found ${sources.length} sources\n`);

    const processor = new OpenAIBatchProcessor<typeof sources[number]>({
        batchIdsFile: BATCH_ID_FILE
    });

    await processor.fetchResults(
        prisma,
        "paragraphs for 157",  // type: identifier for this rewrite job
        VERSION                  // version: version of the rewrite
    );

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("❌ Batch processing failed:", err);
    await prisma.$disconnect();
});
