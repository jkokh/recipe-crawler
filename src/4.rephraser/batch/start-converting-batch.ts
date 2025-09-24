import { iterate, prisma } from "../../lib/iterator";
import {Source} from "@prisma/client";


export async function process() {
    await iterate(prisma.source)
        .select({
            id: true,
            json: true,
            batchId: true,
        })
        .where({

        })
        .startPosition(1)
        .perPage(50)
        .entityName("recipes")
        .forEachAsync(async (source: Source) => {

        });
    console.log("\x1b[32m%s\x1b[0m", "Result retrieval and JSON restoration complete");
}

void process();