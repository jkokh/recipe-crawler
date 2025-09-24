import { prompts } from "./prompts";

import {extractJsonArray} from "../tags/processors/processTags";
import {GPTProvider} from "../../../lib/ai-providers/gpt";
import {pipeline} from "../../../lib/ai-pipeline/pipeline";
import {getPrompt} from "../../../lib/ai-pipeline/utils";


export async function aiPipeline(recipe: any): Promise<string[]> {
    const ollama = new GPTProvider({
        returnJsonStructure: { ingredients: "string[]" }
    });

    const result = await pipeline<string>()
        .step(
            () => ollama.ask<string>(getPrompt(recipe, prompts[0])),
            extractJsonArray,

        )
        .execute();
    console.log(result);
    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as unknown as string[];
}