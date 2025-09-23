import { iterate, prisma } from "../lib/iterator";
import { SourceImage } from "@prisma/client";
import { stableIdFromUrl } from "../3.parser-all-to-json/modules/getImages";

export async function process() {
    await iterate(prisma.sourceImage)
        .select({ id: true, url: true, sourceId: true, stableId: true })
        .startPosition(1)
        .perPage(50)
        .forEachAsync(async (row: SourceImage) => {
            if (!row.url) return;
            const next = stableIdFromUrl(row.url);
            if (row.stableId === next) return;

            try {
                const r = await prisma.sourceImage.updateMany({
                    where: { id: row.id, sourceId: row.sourceId },
                    data: { stableId: next },
                });
                if (r.count === 0) console.warn(`skip ${row.id}: not found`);
                else console.log(`ok ${row.id} -> ${next}`);
            } catch (e: any) {
                // likely P2002 on (source_id, stable_id)
                console.warn(`conflict ${row.id} (${row.sourceId}, ${next})`);
            }
        });
}

async function main() {
    try { await process(); } catch (e) { console.error(e); }
}
void main();
