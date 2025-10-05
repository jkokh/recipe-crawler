import { prompts } from "./prompts";
import { RecipeJson } from "../types";
import { validate } from "./validate";
import { GPTProvider } from "../lib/ai-providers/gpt";
import { pipeline } from "../lib/ai-pipeline/pipeline";
import {normalize} from "./normalize";

export async function querier(recipeJson: RecipeJson): Promise<string[]> {
    const gpt = new GPTProvider({
        returnJsonStructure: "string[]"
    });

    // Select only the fields needed for tagging
    const cleanRecipe = {
        title: recipeJson.title,
        paragraphs: recipeJson.paragraphs,
        steps: recipeJson.steps,
        ingredients: recipeJson.ingredients
    };

    // Replace placeholder in prompt
    const prompt = prompts[0].replace('<%data%>', JSON.stringify(cleanRecipe));

    const result = await pipeline<string[]>()
        .step(
            () => gpt.ask<string[]>(prompt),
            normalize,
            validate
        )
        .execute();

    if (!result.success || !result.data) {
        const errorMsg = `Query failed for recipe "${recipeJson.title}": ${result.error}`;
        throw new Error(errorMsg);
    }

    if (result.data.length === 0) {
        console.log(`No tags found for recipe: "${recipeJson.title}"`);
    }

    return result.data;
}