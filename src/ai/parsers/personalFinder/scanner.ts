import { getPrompt } from "../../pipeline/utils";
import { jsonContentValidator } from "./validators/jsonContentValidator";
import { pipeline } from "../../pipeline/pipeline";

import { prompts } from "./prompts";
import { OllamaProvider } from "../../providers/ollama";

export async function scanner(recipe: any): Promise<{ result: string; }> {
    const ollama = new OllamaProvider({
        returnJsonStructure: {
            result: "yes|no",
        },
    });


    const result = await pipeline<{ result: string; }>()

        .step(
            () => ollama.ask(getPrompt(recipe, prompts[0])),
            jsonContentValidator
        )

        .execute();

    return result.data!;
}