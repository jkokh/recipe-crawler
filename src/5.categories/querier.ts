
import { prompts } from "./prompts";
import {GPTProvider} from "../ai-providers/gpt";
import {pipeline} from "../ai-pipeline/pipeline";
import {RecipeJson} from "../types";
import {validate} from "./validate";


export async function querier(recipeJson: RecipeJson, categories: string): Promise<{ categories: number[] }> {
    const gpt = new GPTProvider({
        returnJsonStructure: { categories: "number[]" }
    });

    delete recipeJson.meta;
    delete recipeJson.nutrition;
    delete recipeJson.needsReview;

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