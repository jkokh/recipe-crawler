import OpenAI, { toFile } from "openai";
import fs from "fs";
import path from "path";
import { TextEncoder } from "util";
import "dotenv/config";
import { cryptoHash } from "../2.parser-all-to-json/modules/parserUtils";
import {GPT_MODEL} from "../constants";

interface BatchRequest {
    customId: string;
    prompt: string;
    model?: string;
    system?: string;
    options?: {
        max_tokens?: number;
        temperature?: number;
        top_p?: number;
        stop?: string[];
    };
}

interface TextExtractor<T> {
    (data: T): string[];
}

interface CreateBatchOptions<T> {
    sources: T[];
    textExtractor: TextExtractor<T>;
    promptMaker: (text: string) => string;
}

export class OpenAIBatchProcessor<T = any> {
    private readonly client: OpenAI;
    private readonly model: string;
    private readonly storagePath: string;
    private readonly batchSize: number;
    private readonly defaultSystemPrompt = "You are a skilled editor. Follow the user's instructions precisely.";
    private readonly hashLength = 12;

    constructor(config?: {
        apiKey?: string;
        model?: string;
        batchIdsFile?: string;
        batchSize?: number;
    }) {
        const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OpenAI API key is required");

        this.client = new OpenAI({ apiKey });
        this.model = config?.model || GPT_MODEL;
        this.storagePath = config?.batchIdsFile || path.resolve("openai_batches.txt");
        this.batchSize = config?.batchSize || 50000;
    }

    private getTextHash(text: string): string {
        return cryptoHash(text).slice(0, this.hashLength);
    }

    private buildJsonl(requests: BatchRequest[]): string {
        return requests
            .map((r) =>
                JSON.stringify({
                    custom_id: r.customId,
                    method: "POST",
                    url: "/v1/chat/completions",
                    body: {
                        model: r.model || this.model,
                        messages: [
                            { role: "system", content: r.system || this.defaultSystemPrompt },
                            { role: "user", content: r.prompt },
                        ],
                        max_tokens: r.options?.max_tokens ?? 4096,
                        temperature: r.options?.temperature,
                        top_p: r.options?.top_p,
                        stop: r.options?.stop,
                    },
                })
            )
            .join("\n");
    }

    private saveBatchId(batchId: string): void {
        fs.appendFileSync(this.storagePath, `${batchId}\n`, "utf-8");
        console.log(`💾 Saved batch ID: ${batchId}`);
    }

    private async submitBatch(requests: BatchRequest[]): Promise<string> {
        const jsonl = this.buildJsonl(requests);
        const buffer = new TextEncoder().encode(jsonl);

        const file = await this.client.files.create({
            file: await toFile(buffer, "batch.jsonl"),
            purpose: "batch",
        });

        const batch = await this.client.batches.create({
            input_file_id: file.id,
            endpoint: "/v1/chat/completions",
            completion_window: "24h",
        });

        this.saveBatchId(batch.id);
        return batch.id;
    }

    /**
     * Creates and submits OpenAI batch jobs from sources.
     * Each source can produce multiple texts (e.g. paragraphs).
     * CustomId format: `<sourceId>_<hash>` or `<sourceId>_<hash>_<index>` for duplicates.
     */
    async createAndSubmitBatches(options: CreateBatchOptions<T>): Promise<void> {
        const { sources, textExtractor, promptMaker } = options;
        console.log(`🧩 Processing ${sources.length} sources...`);

        const requests = this.buildRequests(sources, textExtractor, promptMaker);
        console.log(`📝 Prepared ${requests.length} total texts.`);

        await this.submitBatches(requests);
    }

    private buildRequests(
        sources: T[],
        textExtractor: TextExtractor<T>,
        promptMaker: (text: string) => string
    ): BatchRequest[] {
        const requests: BatchRequest[] = [];
        const customIdCounts = new Map<string, number>();

        for (const source of sources) {
            const sourceId = (source as any).id;
            if (sourceId == null) {
                throw new Error("❌ Each source must include an `id` property.");
            }

            const texts = textExtractor(source);
            if (!texts?.length) continue;

            for (const text of texts) {
                if (!text?.trim()) continue;

                const baseCustomId = `${sourceId}_${this.getTextHash(text)}`;
                const count = customIdCounts.get(baseCustomId) || 0;
                const customId = count === 0 ? baseCustomId : `${baseCustomId}_${count}`;

                customIdCounts.set(baseCustomId, count + 1);

                requests.push({
                    customId,
                    prompt: promptMaker(text),
                });
            }
        }
        return requests;
    }

    private async submitBatches(requests: BatchRequest[]): Promise<void> {
        for (let i = 0; i < requests.length; i += this.batchSize) {
            const batch = requests.slice(i, i + this.batchSize);
            const batchNum = Math.floor(i / this.batchSize) + 1;
            console.log(`🚀 Submitting batch ${batchNum} (${batch.length} items)...`);

            try {
                const batchId = await this.submitBatch(batch);
                console.log(`✅ Batch ${batchNum} submitted successfully: ${batchId}`);
            } catch (err) {
                console.error(`❌ Batch ${batchNum} failed:`, err);
            }
        }
    }

    async fetchResults(prisma: any, type: string, version: string): Promise<void> {
        if (!fs.existsSync(this.storagePath)) {
            throw new Error(`❌ File not found: ${this.storagePath}`);
        }

        const batchIds = fs
            .readFileSync(this.storagePath, "utf8")
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

        console.log(`📦 Processing ${batchIds.length} batches from ${this.storagePath}`);

        for (const batchId of batchIds) {
            await this.processBatchResults(batchId, prisma, type, version);
        }

        console.log("🏁 Done fetching all batch results.");
    }

    private async processBatchResults(
        batchId: string,
        prisma: any,
        type: string,
        version: string
    ): Promise<void> {
        console.log(`🔍 Fetching batch ${batchId}...`);

        const batch = await this.client.batches.retrieve(batchId);
        if (batch.status !== "completed" || !batch.output_file_id) {
            console.log(`⚠️ Skipping batch ${batchId} (status: ${batch.status})`);
            return;
        }

        const content = await (await this.client.files.content(batch.output_file_id)).text();
        const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
        console.log(`📄 ${lines.length} results found in ${batchId}`);

        for (const line of lines) {
            await this.processResultLine(line, prisma, type, version);
        }
    }

    private async processResultLine(
        line: string,
        prisma: any,
        type: string,
        version: string
    ): Promise<void> {
        try {
            const data = JSON.parse(line);
            const text = data.response?.body?.choices?.[0]?.message?.content?.trim();
            const customId = data.custom_id;

            if (!text || !customId) return;

            const { sourceId, hash: shortHash, index } = decodeCustomId(customId);
            const sourceIdNum = Number(sourceId);

            if (isNaN(sourceIdNum)) {
                console.error(`❌ Invalid sourceId: ${sourceId} from customId: ${customId}`);
                return;
            }

            const src = await prisma.source.findUnique({
                where: { id: sourceIdNum },
                select: { jsonParsed: true },
            });

            const original = src?.jsonParsed ? this.findTextByHash(src.jsonParsed, shortHash) : null;
            if (!original) {
                console.log(`⚠️ Original text not found for ${sourceId}_${shortHash}`);
                return;
            }

            const fullHash = cryptoHash(original);
            const indexValue = index ?? 0;

            const existing = await prisma.phrase.findFirst({
                where: {
                    sourceId: sourceIdNum,
                    hash: fullHash,
                    version,
                    index: indexValue,
                },
                select: { id: true },
            });

            if (existing) {
                await prisma.phrase.update({
                    where: { id: existing.id },
                    data: { text, type, updatedAt: new Date() },
                });
                console.log(`✅ Updated phrase ${sourceId}_${shortHash}`);
            } else {
                try {
                    await prisma.phrase.create({
                        data: {
                            text,
                            hash: fullHash,
                            sourceId: sourceIdNum,
                            type,
                            version,
                            index: indexValue,
                        },
                    });
                    console.log(`✅ Created phrase ${sourceId}_${shortHash}`);
                } catch (createError: any) {
                    if (createError.code === "P2002") {
                        console.log(`⚠️ Phrase ${sourceId}_${shortHash} already exists, skipping`);
                    } else {
                        throw createError;
                    }
                }
            }
        } catch (err) {
            console.error("❌ Parse/store error:", err);
        }
    }

    private findTextByHash(jsonParsed: any, hash: string): string | null {
        if (!jsonParsed || typeof jsonParsed !== "object") return null;

        const searchInValue = (value: any): string | null => {
            if (typeof value === "string") {
                return this.getTextHash(value) === hash ? value : null;
            }

            if (Array.isArray(value)) {
                for (const item of value) {
                    const result = searchInValue(item);
                    if (result) return result;
                }
            } else if (value && typeof value === "object") {
                for (const key of Object.keys(value)) {
                    const result = searchInValue(value[key]);
                    if (result) return result;
                }
            }

            return null;
        };

        return searchInValue(jsonParsed);
    }
}

export function decodeCustomId(customId: string) {
    if (!customId) {
        throw new Error(`Invalid customId: ${customId}`);
    }

    const match = /^(?<sourceId>\d+)_(?<hash>[a-f0-9]+)(?:_(?<index>\d+))?$/.exec(customId);

    if (!match?.groups) {
        console.error(`❌ Failed to parse customId: "${customId}"`);
        throw new Error(`Invalid customId format: ${customId}`);
    }

    return {
        sourceId: match.groups.sourceId,
        hash: match.groups.hash,
        index: match.groups.index ? parseInt(match.groups.index, 10) : undefined,
    };
}