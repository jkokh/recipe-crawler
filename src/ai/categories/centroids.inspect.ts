// scripts/centroids.inspect.ts
import { PrismaClient } from "@prisma/client";
import {cosine, fromBytes} from "../../lib/vec";

const prisma = new PrismaClient();

(async () => {
    const cents = await prisma.category.findMany({
        include: { centroid: true },
        take: 50, // limit for visual check
    });


    const rows = cents.filter(c => c.centroid);
    const vecsAll = rows.map(c => ({
        id: c.id,
        title: c.title,
        parentId: c.parentId ?? null,
        dim: c.centroid!.dim,
        v: fromBytes(Buffer.from(c.centroid!.vector), c.centroid!.dim),
    }));

    function topKNeighbors(k=3) {
        console.log("\nTop neighbors per category:");
        for (let i = 0; i < vecsAll.length; i++) {
            const a = vecsAll[i];
            const sims = [];
            for (let j = 0; j < vecsAll.length; j++) {
                if (i === j) continue;
                sims.push({ j, s: cosine(a.v, vecsAll[j].v) });
            }
            sims.sort((x,y)=>y.s-x.s);
            const best = sims.slice(0, k).map(x => `${vecsAll[x.j].title} (${x.s.toFixed(2)})`);
            console.log(a.title.padEnd(25), "→", best.join(", "));
        }
    }
    topKNeighbors(3);




    process.exit(0);
})();
