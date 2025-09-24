import { ImagesParsed } from "../../types";
import { PrismaClient, Source } from "@prisma/client";


export async function saveImages(
    imagesParsed: ImagesParsed[],
    source: Source,
    prisma: PrismaClient
): Promise<ImagesParsed[]> {
    const sourceId = source.id;
    const out: ImagesParsed[] = [];

    for (let index = 0; index < imagesParsed.length; index++) {
        const img = imagesParsed[index];
        const stableId = img.stableId; // assume already computed

        try {
            if (img.id != null) {
                const row = await prisma.sourceImage.update({
                    where: { id: img.id },
                    data: {
                        url: img.url,
                        alt: img.alt,
                        isLead: img.lead,
                        order: index,
                    },
                    select: { id: true },
                });
                out.push({ ...img, id: row.id });
            } else {
                // Insert-or-update by (sourceId, stableId)
                const row = await prisma.sourceImage.upsert({
                    where: { sourceId_stableId: { sourceId, stableId } }, // requires @@unique([sourceId, stableId])
                    create: {
                        sourceId,
                        stableId,
                        url: img.url,
                        alt: img.alt,
                        isLead: img.lead,
                        order: index
                    },
                    update: {
                        url: img.url,
                        alt: img.alt,
                        isLead: img.lead,
                        order: index,
                    },
                    select: { id: true },
                });
                out.push({ ...img, id: row.id });
            }
        } catch (e) {
            // If you want to see why an item failed, log minimal context:
            console.error(`saveImages: failed sourceId=${sourceId} stableId=${stableId} id=${img.id ?? "∅"}`, e);
            out.push({ ...img, id: img.id }); // keep original id (possibly undefined)
        }
    }

    return out;
}
