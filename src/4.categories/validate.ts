export function validate(data: number[]): void {
    if (!Array.isArray(data)) {
        throw new Error("Data must be an array of numbers");
    }

    if (data.length === 0) {
        throw new Error("Categories array cannot be empty");
    }

    for (const [i, cat] of data.entries()) {
        if (typeof cat !== "number" || !Number.isInteger(cat)) {
            throw new Error(`Category at index ${i} must be an integer`);
        }

        if (cat < 0) {
            throw new Error(`Category id at index ${i} must be non-negative`);
        }
    }
}