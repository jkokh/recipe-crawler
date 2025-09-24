import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import {AIProvider, AIRequestOptions} from "../../ai/types";

const MODEL = "claude-3-5-haiku-20241022";

interface ClaudeProviderConfig {
    apiKey?: string;
    model?: string;
    maxInputLength?: number;
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
    status: 'completed' | 'failed';
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
}

export class ClaudeBatchProvider implements AIProvider {
    private client: Anthropic;
    public model: string;
    private readonly maxInputLength: number;

    constructor(config: ClaudeProviderConfig = {}) {
        const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('Anthropic API key is required');
        }

        this.client = new Anthropic({ apiKey });
        this.model = config.model || MODEL;
        this.maxInputLength = config.maxInputLength || 3000;
    }

    private formatError(error: any): string {
        return error?.message || error?.error?.message || String(error);
    }

    private truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trimEnd() + '...';
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
        return response.content
            .filter(content => content.type === "text")
            .map(content => content.text)
            .join("");
    }

    // Single request method
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

            if (!text.trim()) {
                throw new Error("Empty response from Claude");
            }

            return text as T;
        } catch (error: any) {
            throw new Error(`Claude request failed: ${this.formatError(error)}`);
        }
    }

    // Submit batch - returns batch ID
    async submitBatch(requests: BatchRequest[]): Promise<string> {
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

    // Check batch status
    async getBatchStatus(batchId: string): Promise<BatchStatus> {
        try {
            const batchData = await this.client.messages.batches.retrieve(batchId);

            const statusMap: Record<string, BatchStatus['status']> = {
                'in_progress': 'in_progress',
                'canceling': 'in_progress',
                'ended': 'completed',
                'failed': 'failed',
                'expired': 'expired'
            };

            return {
                id: batchData.id,
                status: statusMap[batchData.processing_status] || 'validating',
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
            const resultsIter = await this.client.messages.batches.results(batchId);
            const results: BatchResult[] = [];

            for await (const item of resultsIter) {
                const base: BatchResult = { customId: item.custom_id, status: 'failed' };

                if (item.result.type === 'succeeded') {
                    const msg = item.result.message as Anthropic.Messages.Message;
                    base.result = this.extractTextContent(msg);
                    base.status = 'completed';
                } else if (item.result.type === 'errored') {
                    // Handle errored results
                    base.error = 'Request failed with error';
                } else if (item.result.type === 'canceled') {
                    // Handle canceled results
                    base.error = 'Request was canceled';
                } else if (item.result.type === 'expired') {
                    // Handle expired results
                    base.error = 'Request expired';
                } else {
                    // Fallback for any other types
                    base.error = `Request failed`;
                }

                results.push(base);
            }

            return results;
        } catch (error: any) {
            throw new Error(`Failed to get batch results: ${this.formatError(error)}`);
        }
    }
}