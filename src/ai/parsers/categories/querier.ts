import { getPrompt } from "../../pipeline/utils";
import { pipeline } from "../../pipeline/pipeline";
import { prompts } from "./prompts";
import { OllamaProvider } from "../../providers/ollama";
import {extractJsonArray} from "./processors/processTags";

export async function querier(recipe: any): Promise<string[]> {
    const ollama = new OllamaProvider({
        returnJsonStructure: []
    });

    const result = await pipeline<string>()
        .step(
            () => ollama.ask<string>(getPrompt(recipe, prompts[3])),
            extractJsonArray
        )
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as unknown as string[];
}