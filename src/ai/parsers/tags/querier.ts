import { getPrompt } from "../../pipeline/utils";
import { pipeline } from "../../pipeline/pipeline";
import { prompts } from "./prompts";
import {extractJsonArray} from "./processors/processTags";
import {validateTags} from "./validators/validateTags";
import {GPTProvider} from "../../providers/gpt";

export async function querier(recipe: any): Promise<string[]> {
    const gpt = new GPTProvider({
        returnJsonStructure: []
    });

    const result = await pipeline<string>()
        .step(
            () => gpt.ask<string>(getPrompt(recipe, prompts[0])),
            extractJsonArray,
            validateTags

        )
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as unknown as string[];
}