import 'dotenv/config';
import { readFileSync } from "fs";
import { ClaudeBatchProvider } from "../../lib/ai-providers/claude-batch";
import { RecipeJson } from "../../types";
import { PhraseService } from "../../lib/Phrase";
import { IndexedText, mapIndexedTexts } from "../utils";
import { prisma } from "../../lib/iterator";


interface ProcessorConfig<T> {
    batchIdsFile: string;
    parseBatchLine: (line: string) => { batchId: string; sourceId?: number };
    parseCustomId: (customId: string) => { sourceId?: number; index: number };
    getDataArray: (json: RecipeJson) => T[] | null | undefined;
    getText: (item: T) => string | null;
    type: string;
    version: string;
}

export class BatchProcessor {
    private claude = new ClaudeBatchProvider();
    private phraseService = new PhraseService();

    async process<T>(config: ProcessorConfig<T>) {
        const batchLines = readFileSync(config.batchIdsFile, 'utf8')
            .split('\n')
            .filter(line => line.trim());

        console.log(`Processing ${batchLines.length} batches from ${config.batchIdsFile}`);

        for (const line of batchLines) {
            const { batchId, sourceId: defaultSourceId } = config.parseBatchLine(line);
            console.log(`\n--- Processing batch: ${batchId} ---`);

            const results = await this.claude.getBatchResults(batchId);
            const resultsBySource: Record<number, IndexedText[]> = {};

            // Group results by source ID
            for (const result of results) {
                if (result.status !== 'completed' || !result.result) continue;

                const { sourceId, index } = config.parseCustomId(result.customId);
                const finalSourceId = sourceId ?? defaultSourceId;

                if (!finalSourceId) continue;

                (resultsBySource[finalSourceId] ??= []).push({
                    index,
                    text: result.result
                });
            }

            // Process each source
            for (const [sourceId, alteredTexts] of Object.entries(resultsBySource)) {
                await this.processSource(parseInt(sourceId), alteredTexts, config);
            }
        }

        console.log("\x1b[32mDone!\x1b[0m");
    }

    private async processSource<T>(
        sourceId: number,
        alteredTexts: IndexedText[],
        config: ProcessorConfig<T>
    ) {
        const source = await prisma.source.findUnique({ where: { id: sourceId } });
        if (!source) return;

        const dataArray = config.getDataArray(source.jsonParsed as RecipeJson);
        if (!dataArray?.length) return;

        const textPairs = mapIndexedTexts(dataArray, alteredTexts, config.getText);

        for (const { sourceText, alteredText, index } of textPairs) {
            await this.phraseService.store({
                originalText: sourceText,
                alteredText,
                sourceId,
                type: config.type,
                version: config.version.replace('{{sourceId}}', sourceId.toString()).replace('{{index}}', index.toString())
            });
        }

        console.log(`Updated ${sourceId} with ${textPairs.length} ${config.type} texts`);
    }
}
