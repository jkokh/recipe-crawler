export function validate(data: { header: string; text: string }): void {
    if (!data || typeof data !== 'object') {
        throw new Error('Data must be a JSON object');
    }

    if (!('header' in data)) {
        throw new Error('Missing required property: header');
    }

    if (!('text' in data)) {
        throw new Error('Missing required property: text');
    }

    if (typeof data.header !== 'string') {
        throw new Error('Header must be a string');
    }

    if (typeof data.text !== 'string') {
        throw new Error('Text must be a string');
    }

    if (!data.header.trim()) {
        throw new Error('Header cannot be empty');
    }

    if (!data.text.trim()) {
        throw new Error('Text cannot be empty');
    }

    if (data.header.trim().length <= 25) {
        throw new Error(`Header must be more than 25 characters, got ${data.header.trim().length} characters`);
    }
}