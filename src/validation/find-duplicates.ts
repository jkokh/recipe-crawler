import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findDuplicateTitles(): Promise<void> {
    const results = await prisma.$queryRaw<
        Array<{
            title: string;
            duplicate_count: bigint;
            source_ids: string;
        }>
    >`
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(json_parsed, '$.title')) as title,
            COUNT(*) as duplicate_count,
            GROUP_CONCAT(id ORDER BY id) as source_ids
        FROM sources
        WHERE json_parsed IS NOT NULL
            AND JSON_EXTRACT(json_parsed, '$.title') IS NOT NULL
        GROUP BY JSON_UNQUOTE(JSON_EXTRACT(json_parsed, '$.title'))
        HAVING COUNT(*) > 1
        ORDER BY duplicate_count DESC
    `;

    console.log(`\n📊 Duplicate Titles Report`);
    console.log(`═══════════════════════════════════════\n`);
    console.log(`Found ${results.length} duplicate titles\n`);

    results.forEach((row, index) => {
        const count = Number(row.duplicate_count);
        const ids = row.source_ids.split(",");

        console.log(`${index + 1}. "${row.title}"`);
        console.log(`   Duplicates: ${count}`);
        console.log(`   Source IDs: ${ids.join(", ")}`);
        console.log("");
    });

    const totalDuplicates = results.reduce((sum, row) => sum + Number(row.duplicate_count), 0);
    const uniqueTitles = results.length;
    const extraCopies = totalDuplicates - uniqueTitles;

    console.log(`\n📈 Summary`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Unique duplicate titles: ${uniqueTitles}`);
    console.log(`Total duplicate entries: ${totalDuplicates}`);
    console.log(`Extra copies: ${extraCopies}`);
}

async function main(): Promise<void> {
    try {
        await findDuplicateTitles();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

void main();