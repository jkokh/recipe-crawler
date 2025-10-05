import { ImagesParsed } from "../../types";
import {PrismaClient, SourceImage} from "@prisma/client";


export async function saveImages(
    imagesParsed: ImagesParsed[],
    sourceId: number,
    prisma: PrismaClient
): Promise<SourceImage[]> {
    const out: SourceImage[] = [];

    for (let index = 0; index < imagesParsed.length; index++) {
        const img = imagesParsed[index];
        const stableId = img.stableId;

        try {
            if (img.id != null) {
                const row = await prisma.sourceImage.update({
                    where: { id: img.id },
                    data: {
                        url: img.url,
                        alt: img.alt,
                        isLead: img.lead,
                        order: index,
                    }
                });
                out.push(row);
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
                    }
                });
                out.push(row);
            }
        } catch (e) {
            console.error(`saveImages: failed sourceId=${sourceId} stableId=${stableId} id=${img.id ?? "∅"}`, e);
        }
    }

    return out;
}
