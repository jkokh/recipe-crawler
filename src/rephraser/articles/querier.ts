import { prompts } from "./prompts";
import {ClaudeProvider} from "../../ai-providers/claude";
import {getPrompt} from "../../ai-pipeline/utils";
import {pipeline} from "../../ai-pipeline/pipeline";



// Batch querier for up to 50 items
export async function querierBatch(
    dataArray: Array<{ id: string | number; data: any }>
): Promise<Array<{ id: string | number; result?: string; error?: string }>> {

    if (dataArray.length === 0) {
        return [];
    }

    if (dataArray.length > 50) {
        throw new Error(`Too many items: ${dataArray.length}. Maximum is 50 items per batch.`);
    }

    const claude = new ClaudeProvider();

    console.log(`🚀 Processing batch of ${dataArray.length} items`);

    try {
        // Prepare requests
        const requests = dataArray.map(item => ({
            customId: String(item.id),
            prompt: getPrompt(item.data, prompts[0])
        }));

        // Process with Claude batch API (will use actual batch for >3 items)
        const batchResults = await claude.askBatch<string>(requests, 50);

        // Transform results
        const results = batchResults.map(result => ({
            id: result.customId,
            result: result.result,
            error: result.error
        }));

        const successful = results.filter(r => !r.error).length;
        const failed = results.filter(r => r.error).length;

        console.log(`✅ Batch complete: ${successful} successful, ${failed} failed`);

        return results;

    } catch (error: any) {
        console.error(`❌ Batch processing failed:`, error.message);

        // Return error for all items
        return dataArray.map(item => ({
            id: item.id,
            error: `Batch processing failed: ${error.message}`
        }));
    }
}


// Batch querier with pipeline integration
export async function querierBatchPipeline(
    dataArray: Array<{ id: string | number; data: any }>
): Promise<Array<{ id: string | number; result?: string; error?: string }>> {

    const result = await pipeline<Array<{ id: string | number; result?: string; error?: string }>>()
        .step(() => querierBatch(dataArray))
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Batch pipeline failed: ${result.error || 'Unknown error'}`);
    }

    return result.data;
}
