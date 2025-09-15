export function validate(data: { categories: number[] }): void {
    if (!data || typeof data !== "object") {
        throw new Error("Data must be a JSON object");
    }

    if (!Array.isArray(data.categories)) {
        throw new Error("Missing or invalid property: categories must be an array");
    }

    if (data.categories.length === 0) {
        throw new Error("Categories array cannot be empty");
    }

    for (const [i, cat] of data.categories.entries()) {
        if (typeof cat !== "number" || !Number.isInteger(cat)) {
            throw new Error(`Category at index ${i} must be an integer`);
        }

        if (cat < 0) {
            throw new Error(`Category id at index ${i} must be non-negative`);
        }
    }
}
