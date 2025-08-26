import { PrismaClient } from "@prisma/client";
import {toBytes} from "../../lib/vec";
import {embed} from "../../lib/embed";


const prisma = new PrismaClient();
const MODEL = "Xenova/bge-m3";

(async () => {
    const cats = await prisma.category.findMany({ select: { id:true, description:true, title:true }});
    const texts = cats.map(c => (c.description ?? c.title));
    const vecs = await embed(texts, "passage");
    await prisma.$transaction(cats.map((c,i) =>
        prisma.categoryCentroid.upsert({
            where: { categoryId: c.id },
            create: { categoryId: c.id, vector: toBytes(vecs[i]), dim: vecs[i].length, model: MODEL },
            update: { vector: toBytes(vecs[i]), dim: vecs[i].length, model: MODEL },
        })
    ));
    console.log(`Seeded ${cats.length} centroids.`);
    process.exit(0);
})();
