import { prisma } from "./iterator";
import { cryptoHash } from "../2.parser-all-to-json/modules/parserUtils";

type StoreInput = {
    originalText: string;
    alteredText: string;
    sourceId: number;
    type: string;
    version: string;
};

export interface PhraseEntry {
    sourceId: number;
    type: string;
    version: string;
    text: string;
    hash: string;
}

export class PhraseService {
    async store(input: StoreInput): Promise<void> {
        const { originalText, alteredText, sourceId, type, version } = input;
        const hash = cryptoHash(originalText);
        try {
            await prisma.phrase.upsert({
                where: {
                    type_sourceId_version: {
                        type,
                        version,
                        sourceId
                    }
                },
                update: {
                    text: alteredText,
                    hash,
                    updatedAt: new Date()
                },
                create: {
                    text: alteredText,
                    hash,
                    sourceId,
                    type,
                    version
                }
            });
        } catch (e) {
            console.error(`Error storing phrase: ${type} ${version} ${sourceId}`, e);
        }
    }

    async getAll(sourceId: number): Promise<PhraseEntry[]> {
        return prisma.phrase.findMany({
            where: { sourceId },
            select: { sourceId: true, type: true, version: true, text: true, hash: true },
            orderBy: [{ type: "asc" }, { version: "asc" }]
        });
    }

    async getByType(sourceId: number, type: string): Promise<PhraseEntry[]> {
        return prisma.phrase.findMany({
            where: { sourceId, type },
            select: { sourceId: true, type: true, version: true, text: true, hash: true },
            orderBy: [{ version: "asc" }]
        });
    }

    async getOne(sourceId: number, type: string, version: string): Promise<PhraseEntry | null> {
        return prisma.phrase.findUnique({
            where: {
                type_sourceId_version: { sourceId, type, version }
            },
            select: { sourceId: true, type: true, version: true, text: true, hash: true }
        });
    }
}