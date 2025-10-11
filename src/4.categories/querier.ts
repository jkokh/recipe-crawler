import { prompts } from "./prompts";
import {RecipeJson} from "../types";
import {validate} from "./validate";
import {GPTProvider} from "../lib/ai-providers/gpt";
import {pipeline} from "../lib/ai-pipeline/pipeline";
import {convertToJson} from "./convertToJson";


export async function querier(recipeJson: RecipeJson, categories: string): Promise<number[]> {
    const gpt = new GPTProvider({
        returnJsonStructure: { categories: "number[]" }
    });

    const { meta, nutrition, images, categories: _, ...cleanRecipe } = recipeJson;

    const prmpt = prompts[0].replace('<%data%>', JSON.stringify(cleanRecipe)).replace('<%categories%>', categories);

    const result = await pipeline<string>()
        .step(
            () => gpt.ask<string>(prmpt),
            convertToJson,
            validate
        )
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }
    if (result.data.length === 0) {
        console.log("No categories found");
    }

    return result.data as any;
}