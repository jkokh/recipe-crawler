import {processor} from "../lib/ai-pipeline/types";

export const convertToJson = processor<string, number[]>((data: string) => {
    const result = JSON.parse(data);
    if (!result) throw new Error("No JSON array found");
    return Array.isArray(result?.categories)
        ? result.categories
            .filter((x: unknown) => typeof x === "number" && Number.isInteger(x))
            .map((x: unknown) => x as number)
        : [];
});