import * as cheerio from 'cheerio';
import { HtmlValidate } from 'html-validate';
import {RecipeContent} from "../../../types";
import {validator} from "../../../pipeline/types";

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'void-content': 'error',
    'void-style': 'error',
    'close-attr': 'error',
    'close-order': 'error',
    'no-dup-attr': 'error',
    'no-dup-id': 'error',
    'attr-quotes': 'error',
    'no-raw-characters': 'off',
    'entity-references': 'off' // Disable entity reference validation
  }
});

export interface DescriptionValidatorOptions {
  minParagraphs?: number;
  maxParagraphs?: number;
  minWords?: number;
  maxWords?: number;
}

const defaultOptions: Required<DescriptionValidatorOptions> = {
  minParagraphs: 2,
  maxParagraphs: 3,
  minWords: 40,
  maxWords: 70,
};

/**
 * Clean HTML by fixing common entity reference issues
 */
function cleanHtml(html: string): string {
  return html
      // Fix common malformed entities - be more comprehensive
      .replace(/&Ms(?![a-zA-Z])/g, '&amp;Ms')
      .replace(/&Mrs(?![a-zA-Z])/g, '&amp;Mrs')
      .replace(/&Mr(?![a-zA-Z])/g, '&amp;Mr')
      .replace(/&Dr(?![a-zA-Z])/g, '&amp;Dr')
      .replace(/&Co(?![a-zA-Z])/g, '&amp;Co')
      .replace(/&St(?![a-zA-Z])/g, '&amp;St')
      .replace(/&Ltd(?![a-zA-Z])/g, '&amp;Ltd')
      .replace(/&Inc(?![a-zA-Z])/g, '&amp;Inc')
      // Fix any standalone ampersand that isn't part of a valid HTML entity
      .replace(/&(?![a-zA-Z][a-zA-Z0-9]{1,8};|#[0-9]{1,6};|#x[0-9a-fA-F]{1,6};)/g, '&amp;')
      // Clean up multiple spaces and normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
}

export const descriptionValidator = validator<any>(async (recipeContent: RecipeContent, options: DescriptionValidatorOptions = {}): Promise<void> => {
  const { minParagraphs, maxParagraphs, minWords, maxWords } = {
    ...defaultOptions,
    ...options,
  };

  // Clean the HTML FIRST before any validation
  const cleanedDescription = cleanHtml(recipeContent.description);

  // Update the content immediately so subsequent validators get clean HTML
  recipeContent.description = cleanedDescription;

  // Skip HTML validation entirely if it contains problematic characters
  const hasProblematicContent = cleanedDescription.includes('&') &&
      !/^[^&]*(&(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);[^&]*)*$/.test(cleanedDescription);

  if (!hasProblematicContent) {
    try {
      const report = await htmlValidate.validateString(cleanedDescription);

      if (!report.valid) {
        // Filter out entity-related errors
        const significantErrors = report.results[0]?.messages.filter(msg => {
          const message = msg.message.toLowerCase();
          return !message.includes('unrecognized character reference') &&
              !message.includes('entity reference') &&
              !message.includes('invalid character reference');
        }) || [];

        if (significantErrors.length > 0) {
          const errors = significantErrors.map(msg =>
              `Line ${msg.line}:${msg.column} - ${msg.message}`
          ).join('; ');

          throw new Error(`Invalid HTML syntax: ${errors}`);
        }
      }
    } catch (error: any) {
      // Only throw if it's not an entity-related error
      if (!error.message?.toLowerCase().includes('character reference')) {
        throw error;
      }
      console.warn(`HTML validation skipped due to entity issues: ${error.message}`);
    }
  } else {
    console.warn('HTML validation skipped due to problematic entity characters');
  }

  // Content validation using cheerio (more forgiving)
  const $ = cheerio.load(cleanedDescription, {
    decodeEntities: false,
    normalizeWhitespace: true
  });

  const paragraphs = $('p');

  if (paragraphs.length === 0) {
    throw new Error('HTML must contain at least one <p> tag');
  }

  if (paragraphs.length < minParagraphs || paragraphs.length > maxParagraphs) {
    throw new Error(
        `HTML must contain ${minParagraphs}-${maxParagraphs} paragraphs, found ${paragraphs.length}`
    );
  }

  let paragraphIndex = 0;
  for (const p of paragraphs.toArray()) {
    paragraphIndex++;
    const text = $(p).text().trim();
    if (!text) {
      throw new Error(`Paragraph ${paragraphIndex} is empty`);
    }

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < minWords || wordCount > maxWords) {
      throw new Error(
          `Paragraph ${paragraphIndex} has ${wordCount} words, must be ${minWords}-${maxWords} words`
      );
    }
  }

  for (let i = 0; i < paragraphs.length; i++) {
    const strongTags = paragraphs.eq(i).find('strong');
    if (strongTags.length > 3) {
      throw new Error(
          `Paragraph ${i + 1} has ${strongTags.length} <strong> tags, maximum 3 allowed`
      );
    }
  }
});