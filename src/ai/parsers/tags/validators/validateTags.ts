export function validateTags(tags: string[]): void {
  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array of strings');
  }

  if (tags.length < 3) {
    throw new Error('Minimum 3 tags required');
  }

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    if (typeof tag !== 'string') {
      throw new Error(`Tag at index ${i} must be a string`);
    }

    if (!tag.trim()) {
      throw new Error(`Tag at index ${i} cannot be empty`);
    }

    const wordCount = tag.trim().split(/\s+/).length;
    if (wordCount > 3) {
      throw new Error(`Tag "${tag}" has ${wordCount} words, maximum 3 words allowed`);
    }

    if (wordCount === 0) {
      throw new Error(`Tag "${tag}" must contain at least 1 word`);
    }
  }
}