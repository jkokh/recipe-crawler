import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import {AIProvider, AIRequestOptions} from "../../ai/types";

const MODEL = "claude-3-5-haiku-20241022";

interface ClaudeProviderConfig {
    apiKey?: string;            // defaults to process.env.ANTHROPIC_API_KEY
    baseURL?: string;           // optional (proxy/self-hosted)
    model?: string;             // default model
    maxInputLength?: number;    // character limit for input
}

interface BatchRequest {
    customId: string;
    prompt: string | any;
    model?: string;
    system?: string;
    options?: AIRequestOptions;
}

interface BatchResult {
    customId: string;
    result?: string;
    error?: string;
    status: 'completed' | 'failed' | 'processing' | 'expired';
}

interface BatchStatus {
    id: string;
    status: 'validating' | 'in_progress' | 'completed' | 'failed' | 'expired';
    processingStats?: {
        processing: number;
        succeeded: number;
        errored: number;
        canceled: number;
        expired: number;
    };
    results?: BatchResult[];
}

export class ClaudeProvider implements AIProvider {
    private client: Anthropic;
    public model: string;
    private readonly maxInputLength: number;

    constructor(config: ClaudeProviderConfig = {}) {
        const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('Anthropic API key is required');
        }

        this.client = new Anthropic({
            apiKey,
            baseURL: config.baseURL,
        });
        this.model = config.model || MODEL;
        this.maxInputLength = Math.max(100, config.maxInputLength || 3000);
    }

    private formatError(error: any): string {
        return error?.message || error?.error?.message || String(error);
    }

    private truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;

        const boundaries = [
            { char: '.', minRatio: 0.8 },
            { char: '\n', minRatio: 0.8 },
            { char: ' ', minRatio: 0.9 }
        ];

        const truncated = text.substring(0, maxLength);

        for (const { char, minRatio } of boundaries) {
            const lastIndex = truncated.lastIndexOf(char);
            if (lastIndex > maxLength * minRatio) {
                return truncated.substring(0, lastIndex + (char === '.' ? 1 : 0));
            }
        }

        return truncated + '...';
    }

    private buildMessageParams(
        prompt: string | any,
        model?: string,
        system?: string,
        options?: AIRequestOptions
    ): Anthropic.Messages.MessageCreateParamsNonStreaming {
        let promptText = typeof prompt === "string" ? prompt : JSON.stringify(prompt);
        promptText = this.truncateText(promptText, this.maxInputLength);

        return {
            model: model || this.model,
            messages: [{ role: "user", content: promptText }],
            max_tokens: options?.max_tokens || 4096,
            temperature: options?.temperature,
            top_p: options?.top_p,
            stop_sequences: options?.stop,
            system: system || undefined,
            stream: false,
        };
    }

    private extractTextContent(response: Anthropic.Message): string {
        let text = "";
        if (response.content && Array.isArray(response.content)) {
            for (const content of response.content) {
                if (content.type === "text") {
                    text += content.text;
                }
            }
        }
        return text;
    }

    private mapBatchStatus(status: Anthropic.Messages.Batches.MessageBatch['processing_status']): BatchStatus['status'] {
        switch (status) {
            case 'in_progress':
                return 'in_progress';
            case 'canceling':
                return 'in_progress';
            case 'ended':
                return 'completed';
            default:
                return 'validating';
        }
    }

    private mapBatchResult(result: any): BatchResult {
        const batchResult: BatchResult = {
            customId: result.custom_id,
            status: result.result.type === 'succeeded' ? 'completed' : 'failed'
        };

        switch (result.result.type) {
            case 'succeeded':
                batchResult.result = this.extractTextContent(result.result.message);
                break;
            case 'errored':
                batchResult.error = result.result.error.error?.message ||
                    result.result.error.type ||
                    'Unknown error';
                break;
            default:
                batchResult.error = `Request ${result.result.type}`;
        }

        return batchResult;
    }

    async ask<T = any>(
        prompt: string | any,
        model?: string,
        system?: string,
        options?: AIRequestOptions
    ): Promise<T> {
        try {
            const requestParams = this.buildMessageParams(prompt, model, system, options);
            const response = await this.client.messages.create(requestParams) as Anthropic.Message;
            const text = this.extractTextContent(response);

            if (!text || text.trim() === "") {
                throw new Error("Empty response from Claude");
            }

            return text as T;
        } catch (error: any) {
            throw new Error(`Claude request failed: ${this.formatError(error)}`);
        }
    }

    async createBatch(requests: BatchRequest[]): Promise<string> {
        try {
            const batchRequests: Anthropic.Messages.Batches.BatchCreateParams.Request[] = requests.map(req => ({
                custom_id: req.customId,
                params: this.buildMessageParams(req.prompt, req.model, req.system, req.options)
            }));

            const batch = await this.client.messages.batches.create({ requests: batchRequests });
            return batch.id;
        } catch (error: any) {
            throw new Error(`Failed to create batch: ${this.formatError(error)}`);
        }
    }

    async getBatchStatus(batchId: string): Promise<BatchStatus> {
        try {
            const batchData = await this.client.messages.batches.retrieve(batchId);

            return {
                id: batchData.id,
                status: this.mapBatchStatus(batchData.processing_status),
                processingStats: {
                    processing: batchData.request_counts.processing,
                    succeeded: batchData.request_counts.succeeded,
                    errored: batchData.request_counts.errored,
                    canceled: batchData.request_counts.canceled,
                    expired: batchData.request_counts.expired,
                },
            };
        } catch (error: any) {
            throw new Error(`Failed to get batch status: ${this.formatError(error)}`);
        }
    }

    async getBatchResults(batchId: string): Promise<BatchResult[]> {
        try {
            const resultsResponse = await this.client.messages.batches.results(batchId);
            const results: BatchResult[] = [];

            for await (const result of resultsResponse) {
                results.push(this.mapBatchResult(result));
            }

            return results;
        } catch (error: any) {
            throw new Error(`Failed to get batch results: ${this.formatError(error)}`);
        }
    }

    async processBatch(
        requests: BatchRequest[],
        pollIntervalMs: number = 5000,
        maxWaitTimeMs: number = 30 * 60 * 1000
    ): Promise<BatchResult[]> {
        const batchId = await this.createBatch(requests);
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTimeMs) {
            const status = await this.getBatchStatus(batchId);

            if (status.status === 'completed') {
                return await this.getBatchResults(batchId);
            } else if (status.status === 'failed' || status.status === 'expired') {
                throw new Error(`Batch ${status.status}: ${batchId}`);
            }

            await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        }

        throw new Error(`Batch processing timeout after ${maxWaitTimeMs}ms`);
    }

    private async processIndividualRequests<T>(requests: BatchRequest[]): Promise<Array<{ customId: string; result?: T; error?: string }>> {
        const results = await Promise.allSettled(
            requests.map(async req => {
                try {
                    const result = await this.ask<T>(req.prompt, req.model, req.system, req.options);
                    return { customId: req.customId, result };
                } catch (error) {
                    return { customId: req.customId, error: this.formatError(error) };
                }
            })
        );

        return results.map(r => r.status === 'fulfilled' ? r.value : r.reason);
    }

    private async processInBatches<T>(requests: BatchRequest[], batchSize: number): Promise<Array<{ customId: string; result?: T; error?: string }>> {
        const allResults: Array<{ customId: string; result?: T; error?: string }> = [];

        for (let i = 0; i < requests.length; i += batchSize) {
            const batchRequests = requests.slice(i, i + batchSize);
            try {
                const batchResults = await this.processBatch(batchRequests);

                // Convert BatchResult[] to the expected format
                for (const batchResult of batchResults) {
                    allResults.push({
                        customId: batchResult.customId,
                        result: batchResult.result as T,
                        error: batchResult.error
                    });
                }
            } catch (error: any) {
                const errorMessage = this.formatError(error);
                for (const req of batchRequests) {
                    allResults.push({
                        customId: req.customId,
                        error: `Batch processing failed: ${errorMessage}`
                    });
                }
            }
        }

        return allResults;
    }

    async askBatch<T = any>(
        requests: Array<{
            customId: string;
            prompt: string | any;
            model?: string;
            system?: string;
            options?: AIRequestOptions;
        }>,
        batchSize: number = 50
    ): Promise<Array<{ customId: string; result?: T; error?: string }>> {
        const batchRequests: BatchRequest[] = requests;

        if (requests.length <= 3) {
            return this.processIndividualRequests<T>(batchRequests);
        }

        return this.processInBatches<T>(batchRequests, batchSize);
    }
}