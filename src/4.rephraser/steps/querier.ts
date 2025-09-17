
import { prompts } from "./prompts";
import {GPTProvider} from "../../ai-providers/gpt";
import {getPrompt} from "../../ai-pipeline/utils";
import {pipeline} from "../../ai-pipeline/pipeline";


export async function querier(data: any): Promise<any> {
    const gpt = new GPTProvider({
        returnJsonStructure: { header: "string", text: "string" }
    });

    const txt = getPrompt(JSON.stringify(data), prompts[0]);

    const result = await pipeline<string>()
        .step(
            () => gpt.ask<string>(txt),


        )
        .execute();

    if (!result.success || !result.data) {
        throw new Error(`Query failed: ${result.error || 'Unknown error'}`);
    }

    return result.data as any;
}