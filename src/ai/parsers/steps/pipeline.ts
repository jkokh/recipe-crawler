import { getPrompt } from "../../pipeline/utils";
import { pipeline } from "../../pipeline/pipeline";
import { prompts } from "./prompts";

import {OllamaProvider} from "../../providers/ollama";
import {extractJsonArray} from "../tags/processors/processTags";
import {validator} from "./validator";
import {Step} from "./types";
import {GPTProvider} from "../../providers/gpt";

export async function pl(recipe: any): Promise<Step[]> {
    const ollama = new GPTProvider({
        returnJsonStructure: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    instructions: { type: "string" },
                },
                required: ["title", "instructions"],
                additionalProperties: false
            }
        },
    });

    const result = await pipeline<string>()
        .step(
            () => ollama.ask<string>(getPrompt(recipe, prompts[0])),
            extractJsonArray,
            validator

        )
        .execute();
    console.log(result);
    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as unknown as Step[];
}