import { Ollama } from 'ollama';
import * as cheerio from 'cheerio';
import { HtmlValidate } from 'html-validate';

interface OllamaConfig {
    host?: string;
}

export class OllamaClient {
    private ollama: Ollama;
    private htmlValidator: HtmlValidate;

    constructor(config: OllamaConfig = {}) {
        this.ollama = new Ollama({
            host: config.host || 'http://localhost:11434'
        });

        // Initialize HTML validator with strict rules
        this.htmlValidator = new HtmlValidate({
            extends: ['html-validate:recommended'],
            rules: {
                'void-content': 'error',
                'void-style': 'error',
                'close-attr': 'error',
                'close-order': 'error',
                'no-dup-attr': 'error',
                'no-dup-id': 'error',
                'attr-quotes': 'error',
            }
        });
    }

    /**
     * Send a request to Ollama and get a response
     */
    async request(model: string, prompt: string, system?: string, options?: any): Promise<string> {
        try {
            const response = await this.ollama.generate({
                model,
                prompt,
                system,
                stream: false,
                options,
            });

            return response.response;
        } catch (error: any) {
            throw new Error(`Ollama request failed: ${error.message}`);
        }
    }

    /**
     * Validates if HTML is well-formed and contains required elements
     */
    private async validateHtml(html: string): Promise<{ isValid: boolean; error?: string }> {
        try {
            // First, validate HTML syntax using html-validate
            const report = await this.htmlValidator.validateString(html);

            if (!report.valid) {
                const errors = report.results[0]?.messages.map(msg =>
                    `Line ${msg.line}:${msg.column} - ${msg.message}`
                ).join('; ') || 'Unknown HTML validation errors';

                return { isValid: false, error: `Invalid HTML syntax: ${errors}` };
            }

            // Then use cheerio for content validation
            const $ = cheerio.load(html);

            // Check if HTML contains any <p> tags
            const paragraphs = $('p');
            if (paragraphs.length === 0) {
                return { isValid: false, error: 'HTML must contain at least one <p> tag' };
            }

            // Check if HTML has 2-3 paragraphs
            if (paragraphs.length < 2 || paragraphs.length > 3) {
                return { isValid: false, error: `HTML must contain 2-3 paragraphs, found ${paragraphs.length}` };
            }

            // Validate each paragraph word count (60-80 words)
            let paragraphIndex = 0;
            for (const p of paragraphs.toArray()) {
                paragraphIndex++;
                const text = $(p).text().trim();
                if (!text) {
                    return { isValid: false, error: `Paragraph ${paragraphIndex} is empty` };
                }

                const wordCount = text.split(/\s+/).length;
                if (wordCount < 35 || wordCount > 70) {
                    return { isValid: false, error: `Paragraph ${paragraphIndex} has ${wordCount} words, must be 60-80 words` };
                }
            }

            // Validate that <strong> tags are used appropriately (1-3 per paragraph max)
            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs.eq(i);
                const strongTags = p.find('strong');
                if (strongTags.length > 3) {
                    return { isValid: false, error: `Paragraph ${i + 1} has ${strongTags.length} <strong> tags, maximum 3 allowed` };
                }
            }

            return { isValid: true };
        } catch (error: any) {
            return { isValid: false, error: `HTML parsing error: ${error.message}` };
        }
    }

    /**
     * Validates the complete response object
     */
    private async validateResponse(response: any): Promise<{ isValid: boolean; error?: string }> {
        // Check if response is an object
        if (!response || typeof response !== 'object') {
            return { isValid: false, error: 'Response must be a JSON object' };
        }

        // Check required fields
        if (!response.title || typeof response.title !== 'string') {
            return { isValid: false, error: 'Missing or invalid title field' };
        }

        if (!response.description || typeof response.description !== 'string') {
            return { isValid: false, error: 'Missing or invalid description field' };
        }

        if (!response.html || typeof response.html !== 'string') {
            return { isValid: false, error: 'Missing or invalid html field' };
        }

        // Validate title length (30-70 characters for SEO)
        const titleLength = response.title.trim().length;
        if (titleLength < 20 || titleLength > 70) {
            return { isValid: false, error: `Title length ${titleLength} characters, should be 30-70 characters` };
        }

        // Validate description (should be 2-4 words)
        const descriptionWords = response.description.trim().split(/\s+/);
        if (descriptionWords.length < 2 || descriptionWords.length > 5) {
            return { isValid: false, error: `Description has ${descriptionWords.length} words, should be 2-4 words` };
        }

        // Validate HTML (this is now async)
        const htmlValidation = await this.validateHtml(response.html.trim());
        if (!htmlValidation.isValid) {
            return { isValid: false, error: `HTML validation failed: ${htmlValidation.error}` };
        }

        return { isValid: true };
    }

    async requestText(recipeJson: any, maxRetries: number = 3): Promise<{ title: string; description: string; html: string } | null> {
        const prompt = `Based on the following recipe data, create:
Return ONLY a JSON object. Response must contain title field!!
1. An SEO-optimized title that is 30-70 characters long (optimal for search engines)
2. A short SEO description (2-3 words) that captures the essence of the recipe
3. HTML content with 2-3 paragraphs describing the recipe, each paragraph should be 40-80 words long. Use proper <p> and <strong> tags (use <strong> sparingly, only for 1-2 key ingredients or techniques per paragraph)
4. Minimum paragraph word count: 40 words - this is crucial, or validation will fail
CRITICAL HTML REQUIREMENTS:
- Use proper HTML syntax with opening <p> and closing </p> tags
- NO SELF-CLOSING <p/> tags - they are invalid HTML
- Each paragraph must be wrapped in proper <p>content</p> tags
- Use <strong>text</strong> for emphasis, not <strong/>

Remove any personal references like "I", "My", "Our", "Grandma's", "Mom's", etc. Make it professional, appetizing, and keyword-rich without being spammy.

IMPORTANT REQUIREMENTS:
- Title: EXACTLY 30-70 characters
- Description: EXACTLY 2-3 words
- HTML: EXACTLY 2-3 paragraphs, each EXACTLY 40-80 words

Return JSON object with fields title, description, html - Important!

Each paragraph must be exactly 40-80 words. Count carefully. Use proper HTML syntax.

Return ONLY a JSON object with this exact structure: {"title": "your optimized title here", "description": "short seo text", "html": "your html content here"}

Recipe data: ${JSON.stringify(recipeJson)}`;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.ollama.generate({
                    model: 'llama3.1:latest',
                    prompt,
                    stream: false,
                    format: 'json',
                });

                const text = response.response.trim();
                if (!text) {
                    console.log(`Attempt ${attempt}: Empty response from Ollama`);
                    continue;
                }

                let parsed: any;
                try {
                    parsed = JSON.parse(text);
                } catch (parseError) {
                    // Try to extract JSON from response if there's extra text
                    const jsonMatch = text.match(/\{[^}]*"title"\s*:\s*"[^"]*"[^}]*"description"\s*:\s*"[^"]*"[^}]*"html"\s*:\s*"[^"]*"[^}]*\}/);
                    if (jsonMatch) {
                        try {
                            parsed = JSON.parse(jsonMatch[0]);
                        } catch {
                            console.log(`Attempt ${attempt}: Failed to parse JSON from response`);
                            continue;
                        }
                    } else {
                        console.log(`Attempt ${attempt}: No valid JSON found in response`);
                        continue;
                    }
                }

                // Validate the response (now async)
                const validation = await this.validateResponse(parsed);
                if (!validation.isValid) {
                    console.log(`Attempt ${attempt}: Validation failed: ${validation.error}`);
                    if (attempt < maxRetries) {
                        console.log(`Retrying... (${attempt}/${maxRetries})`);
                        continue;
                    } else {
                        console.error(`All ${maxRetries} attempts failed. Last error: ${validation.error}`);
                        return null;
                    }
                }

                if (!/^<[^>]+>/.test(parsed.description)) {
                    parsed.description = `<p>${parsed.description}</p>`;
                }

                // If we get here, validation passed
                return {
                    title: parsed.title.trim(),
                    description: parsed.description.trim(),
                    html: parsed.html.trim()
                };

            } catch (error: any) {
                console.error(`Attempt ${attempt}: Ollama request failed: ${error.message}`);
                if (attempt === maxRetries) {
                    return null;
                }
            }
        }

        return null;
    }
}

// Default client instance
export const ollama = new OllamaClient();

// Simple convenience function with default model
export async function ask(prompt: string, system?: string): Promise<string> {
    const { Ollama } = await import('ollama');
    const defaultOllama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
    const defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:latest';

    try {
        const response = await defaultOllama.generate({
            model: defaultModel,
            prompt,
            system,
            stream: false,
        });

        return response.response;
    } catch (error: any) {
        throw new Error(`Ollama request failed: ${error.message}`);
    }
}

// JSON convenience function with default model
export async function askJson<T = any>(prompt: string, json: Object): Promise<T> {
    const { Ollama } = await import('ollama');

    const defaultOllama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
    const defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama3.1:latest';
    const system = JSON.stringify(json);
    try {
        const response = await defaultOllama.generate({
            model: defaultModel,
            prompt,
            system,
            stream: false,
            format: 'json',
        });

        if (!response.response || response.response.trim() === '') {
            throw new Error('Empty response from Ollama');
        }

        return JSON.parse(response.response);
    } catch (error: any) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON response from Ollama`);
        }
        throw new Error(`Ollama JSON request failed: ${error.message}`);
    }
}

export async function rephraseRecipeTitle(recipeJson: any): Promise<{ title: string; description: string; html: string } | null> {
    return await ollama.requestText(recipeJson);
}