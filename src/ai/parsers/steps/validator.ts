import { Step } from "./types";

/**
 * Asserts that `response` is a valid Step[] (every step has non-empty title & instructions).
 * If ANY step is missing/empty or has extra fields, the WHOLE response is invalid.
 */
export function validator(response: unknown): asserts response is Step[] {
    if (!Array.isArray(response)) {
        throw new Error("Expected a JSON array at the top level.");
    }

    if (response.length < 1) {
        throw new Error("Expected at least 1 step.");
    }

    for (let i = 0; i < response.length; i++) {
        const it = response[i] as any;

        if (!it || typeof it !== "object" || Array.isArray(it)) {
            throw new Error(`Step[${i}] must be an object.`);
        }

        if (typeof it.title !== "string" || it.title.trim().length === 0) {
            throw new Error(`Step[${i}].title must be a non-empty string.`);
        }

        if (typeof it.instructions !== "string" || it.instructions.trim().length === 0) {
            throw new Error(`Step[${i}].instructions must be a non-empty string.`);
        }

        // Forbid extra fields
        const keys = Object.keys(it);
        const extras = keys.filter((k) => k !== "title" && k !== "instructions");
        if (extras.length) {
            throw new Error(`Step[${i}] has unknown fields: ${extras.join(", ")}`);
        }
    }
}
