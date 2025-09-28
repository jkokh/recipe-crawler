import { writeFile } from "fs/promises";
import { prisma } from "../../lib/iterator";

type Item = { id: string; name: string };

function getIdByName(items: Item[] | undefined | null, name: string): string | undefined {
    if (!Array.isArray(items)) return undefined;
    return items.find((i) => i?.name === name)?.id;
}

async function main() {
    const sources = await prisma.source.findMany({
        select: { id: true, batchId: true },
    });

    const lines = sources
        .map((s) => {
            const batchId = getIdByName((s.batchId as unknown as Item[]) ?? [], "article");
            return batchId ? `${batchId} ${s.id}` : null;
        })
        .filter((line): line is string => Boolean(line));

    await writeFile("batch-ids.txt", lines.join("\n"), "utf8");
    console.log(`Wrote ${lines.length} batch IDs with source IDs to batch-ids.txt`);
}

main().catch((err) => {
    console.error("Failed to export batch IDs:", err);
    process.exit(1);
});
