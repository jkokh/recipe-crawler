export function validate(tags: string[]): void {
    if (!Array.isArray(tags)) {
        throw new Error('Tags must be an array of strings');
    }

    // Invalidate empty array - tags are required
    if (tags.length === 0) {
        throw new Error('Tags array cannot be empty');
    }

    if (tags.length < 3) {
        throw new Error('Minimum 3 tags required');
    }

    if (tags.length > 12) {
        throw new Error('Maximum 12 tags allowed');
    }

    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];

        if (typeof tag !== 'string') {
            throw new Error(`Tag at index ${i} must be a string`);
        }

        if (tag.length === 0) {
            throw new Error(`Tag at index ${i} cannot be empty`);
        }

        const wordCount = tag.trim().split(/\s+/).length;
        if (wordCount > 3) {
            throw new Error(`Tag "${tag}" has ${wordCount} words, maximum 3 words allowed`);
        }
    }
}