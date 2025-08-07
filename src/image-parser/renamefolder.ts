import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const BASE_DIR = 'images/simplerecipes';

async function main() {
    const images = await prisma.recipeImage.findMany({
        select: {
            id: true,
            recipeUrlId: true,
            imageUrl: true,
        },
        orderBy: { recipeUrlId: 'asc' } // for grouping
    });

    let currentFolder = '';
    let renamedFiles = new Set<string>();

    for (const img of images) {
        const folder = path.join(BASE_DIR, String(img.recipeUrlId));
        if (currentFolder !== folder) {
            renamedFiles = new Set();
            currentFolder = folder;
        }

        let files: string[];
        try {
            files = await fs.readdir(folder);
        } catch {
            console.warn(`[DIR MISSING] Folder does not exist: ${folder} (for id=${img.id})`);
            continue;
        }

        const targetBase = path.basename((img.imageUrl || '').split('?')[0]);
        const newFile = `image${img.id}.jpg`;

        if (renamedFiles.has(targetBase)) {
            // Already renamed in this folder, skip.
            continue;
        }

        if (files.includes(targetBase)) {
            const oldPath = path.join(folder, targetBase);
            const newPath = path.join(folder, newFile);

            if (targetBase === newFile) continue;

            try {
                await fs.access(newPath);
                console.warn(`[EXISTS] Target file exists for id=${img.id}: ${newPath}`);
                continue;
            } catch {}

            await fs.rename(oldPath, newPath);
            renamedFiles.add(targetBase);
            console.log(`[RENAMED] ${oldPath} → ${newPath}`);
        } else {
            console.warn(`[MISSING] File not found for id=${img.id}: ${targetBase}`);
        }
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
