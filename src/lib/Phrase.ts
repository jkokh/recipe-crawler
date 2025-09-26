import { prisma } from "./iterator";
import { cryptoHash } from "../2.parser-all-to-json/modules/parserUtils";

type StoreInput = {
    phrase: string;
    sourceId: number;
    type: string;
    version: string;
};

type PhraseEntry = {
    sourceId: number;
    type: string;
    version: string;
    text: string;
    hash: string;
};

export class PhraseService {
    async store(input: StoreInput): Promise<void> {
        const hash = cryptoHash(input.phrase);

        await prisma.phrase.upsert({
            where: {
                type_sourceId_version: {
                    type: input.type,
                    sourceId: input.sourceId,
                    version: input.version
                }
            },
            update: {
                text: input.phrase,
                hash,
                updatedAt: new Date()
            },
            create: {
                text: input.phrase,
                hash,
                sourceId: input.sourceId,
                type: input.type,
                version: input.version
            }
        });
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