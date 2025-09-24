import { prompts } from "./prompts";
import {RecipeJson} from "../types";
import {validate} from "./validate";
import {GPTProvider} from "../lib/ai-providers/gpt";
import {pipeline} from "../lib/ai-pipeline/pipeline";


export async function querier(recipeJson: RecipeJson, categories: string): Promise<{ categories: number[] }> {
    const gpt = new GPTProvider({
        returnJsonStructure: { categories: "number[]" }
    });

    delete recipeJson.meta;
    delete recipeJson.nutrition;

    const prmpt = prompts[0].replace('<%data%>', JSON.stringify(recipeJson)).replace('<%categories%>', categories);

    const result = await pipeline<string>()
        .step(
            () => gpt.ask<string>(prmpt),
            validate
        )
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as any;
}