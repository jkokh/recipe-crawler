import {extractFirstJsonArray} from "../../../../utils";
import {processor} from "../../../pipeline/types";


// Transform string -> string[]
export const extractJsonArray = processor<string, string[]>((data: string): string[] => {
    const result = extractFirstJsonArray(JSON.stringify(data));
    if (!result) throw new Error("No JSON array found");
    return result;
});
