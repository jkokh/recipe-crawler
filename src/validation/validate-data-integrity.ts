import { PrismaClient } from "@prisma/client";
import { RecipeJson } from "../types";
import { cryptoHash } from "../lib/utils";

const prisma = new PrismaClient();

interface MissingPhrase {
    sourceId: number;
    type: string;
    originalText: string;
    hash: string;
}

async function checkMissingPhrases(sourceId: number): Promise<MissingPhrase[]> {
    const source = await prisma.source.findUnique({
        where: { id: sourceId },
        select: {
            id: true,
            jsonParsed: true
        }
    });

    if (!source || !source.jsonParsed) {
        return [];
    }

    const jsonParsed = source.jsonParsed as RecipeJson;
    const missing: MissingPhrase[] = [];
    const hashes: string[] = [];
    const hashToInfo = new Map<string, { type: string; text: string }>();

    // Collect all hashes with their metadata
    const addHash = (text: string, type: string) => {
        const hash = cryptoHash(text);
        hashes.push(hash);
        hashToInfo.set(hash, {
            type,
            text: text.length > 100 ? text.substring(0, 100) + "..." : text
        });
    };

    if (jsonParsed.title) {
        addHash(jsonParsed.title, "title");
    }

    if (jsonParsed.paragraphs) {
        jsonParsed.paragraphs.forEach((para, i) => {
            if (para.header) addHash(para.header, `paragraph_header[${i}]`);
            if (para.text) addHash(para.text, `paragraph_text[${i}]`);
        });
    }

    if (jsonParsed.steps) {
        jsonParsed.steps.forEach((step, i) => {
            if (step.title) addHash(step.title, `step_title[${i}]`);
            if (step.instructions) addHash(step.instructions, `step_instructions[${i}]`);
        });
    }

    if (jsonParsed.images) {
        jsonParsed.images.forEach((image, i) => {
            if (image.alt) addHash(image.alt, `image_alt[${i}]`);
        });
    }

    // Single query to find all existing phrases
    const existingPhrases = await prisma.phrase.findMany({
        where: {
            sourceId,
            hash: { in: hashes }
        },
        select: { hash: true }
    });

    const existingHashes = new Set(existingPhrases.map(p => p.hash));

    // Identify missing phrases
    hashes.forEach(hash => {
        if (!existingHashes.has(hash)) {
            const info = hashToInfo.get(hash)!;
            missing.push({
                sourceId,
                type: info.type,
                originalText: info.text,
                hash
            });
        }
    });

    return missing;
}

async function diagnose(): Promise<void> {
    console.log("🔍 Checking all sources for missing phrases...\n");

    // Get all source IDs
    const sources = await prisma.source.findMany({
        select: { id: true },
        orderBy: { id: 'asc' }
    });

    let totalMissing = 0;
    let sourcesWithIssues = 0;

    for (const source of sources) {
        const missing = await checkMissingPhrases(source.id);

        if (missing.length > 0) {
            sourcesWithIssues++;
            totalMissing += missing.length;

            console.log(`\n📌 Source ID: ${source.id}`);
            console.log(`   Missing ${missing.length} phrase(s):\n`);

            missing.forEach(m => {
                console.log(`   Type: ${m.type}`);
                console.log(`   Hash: ${m.hash}`);
                console.log(`   Text: "${m.originalText}"`);
                console.log("");
            });
        } else {
            console.log(`✅ Source ID: ${source.id} - All phrases found`);
        }
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`📊 Summary:`);
    console.log(`   Total sources checked: ${sources.length}`);
    console.log(`   Sources with missing phrases: ${sourcesWithIssues}`);
    console.log(`   Total missing phrases: ${totalMissing}`);
    console.log(`${"=".repeat(60)}\n`);
}

async function main(): Promise<void> {
    try {
        await diagnose();
    } catch (error) {
        console.error("Fatal error:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

void main();