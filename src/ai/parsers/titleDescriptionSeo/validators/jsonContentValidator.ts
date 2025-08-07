import { validator } from "src/ai/pipeline/types";
import {RecipeContent} from "../../../types";

export interface ContentValidatorOptions {
  titleMinChars?: number;
  titleMaxChars?: number;
  seoMinWords?: number;
  seoMaxWords?: number;
}

const defaultOptions: Required<ContentValidatorOptions> = {
  titleMinChars: 20,
  titleMaxChars: 70,
  seoMinWords: 2,
  seoMaxWords: 4,
};

export const jsonContentValidator = validator<any>((response: RecipeContent, options: ContentValidatorOptions = {}): void => {
  const { titleMinChars, titleMaxChars, seoMinWords, seoMaxWords } = {
    ...defaultOptions,
    ...options,
  };

  if (!response || typeof response !== 'object') {
    throw new Error('Response must be a JSON object');
  }

  if (!response.title || typeof response.title !== 'string') {
    throw new Error('Missing or invalid title field');
  }

  if (!response.description || typeof response.description !== 'string') {
    throw new Error('Missing or invalid description field');
  }

  if (!response.description || typeof response.description !== 'string') {
    throw new Error('Missing or invalid html field');
  }

  if (!response.seo || typeof response.seo !== 'string') {
    throw new Error('Missing or invalid seo field');
  }

  const titleLength = response.title.trim().length;
  if (titleLength < titleMinChars || titleLength > titleMaxChars) {
    throw new Error(
        `Title length ${titleLength} characters, should be ${titleMinChars}-${titleMaxChars} characters`
    );
  }

  const seoWords = response.seo.trim().split(/\s+/);
  if (seoWords.length < seoMinWords || seoWords.length > seoMaxWords) {
    throw new Error(
        `SEO field has ${seoWords.length} words, should be ${seoMinWords}-${seoMaxWords} words`
    );
  }
});
