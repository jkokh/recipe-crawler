import {processor} from "../../../../lib/ai-pipeline/types";
import {extractFirstJsonArray} from "../../../../lib/utils";

export const extractJsonArray = processor<string, string[]>((data: string): string[] => {
    const result = extractFirstJsonArray(JSON.stringify(data));
    if (!result) throw new Error("No JSON array found");
    return result;
});
