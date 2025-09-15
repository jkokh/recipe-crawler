import { getPrompt } from "../../pipeline/utils";
import { jsonContentValidator } from "./validators/jsonContentValidator";
import { pipeline } from "../../pipeline/pipeline";
import { descriptionValidator } from "./validators/descriptionValidator";

import { RecipeContent } from "../../types";
import { prompts } from "./prompts";
import { OllamaProvider } from "../../providers/ollama";
import { GPTProvider } from "../../providers/gpt";


export async function generateRecipeContent(recipe: any): Promise<RecipeContent> {
    const ollama = new OllamaProvider({
        returnJsonStructure: {
            title: "SEO optimized recipe title",
            description: "<p>HTML content with proper paragraph tags</p>",
            seo: "Short seo (2-3 words)",
        },
    });

    const gpt = new GPTProvider({
        returnJsonStructure: {
            title: "SEO optimized recipe title",
            description: "<p>HTML content with proper paragraph tags</p>",
            seo: "Short seo (2-3 words)",
        },
    });

    const result = await pipeline<RecipeContent>()
/*        // Try 1: Strict validation
        .step(
            () => ollama.ask(getPrompt(recipe, prompts[1])),
            jsonContentValidator,
            descriptionValidator
        )

        // Try 2: More relaxed validation
        .step(
            () => ollama.ask(getPrompt(recipe, prompts[1])),
            jsonContentValidator,
            (data: RecipeContent) =>
                descriptionValidator(data, {
                    minWords: 35,
                    maxWords: 80,
                })
        )

        // Try 2: More relaxed validation
        .step(
            () => ollama.ask(getPrompt(recipe, prompts[0])),
            jsonContentValidator,
            (data: RecipeContent) =>
                descriptionValidator(data, {
                    minWords: 35,
                    maxWords: 80,
                })
        )*/

        // GPT
        .step(
            () => gpt.ask(getPrompt(recipe, prompts[0])),
            jsonContentValidator,
            (data: RecipeContent) =>
                descriptionValidator(data, {
                    minWords: 37,
                    maxWords: 100,
                    minParagraphs: 3,
                    maxParagraphs: 5,
                })
        )
        .execute();

    return result.data!;
}