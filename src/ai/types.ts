export interface AIRequestOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  num_predict?: number;
  repeat_penalty?: number;
  stop?: string[];
  [key: string]: any;
}

export interface AIProvider {

  ask<T = any>(
    prompt: string | any,
    model?: string,
    system?: string,
    options?: AIRequestOptions,
    jsonStructure?: any
  ): Promise<T>;
}

export interface RecipeContent {
  title: string;
  description: string;
  seo: string;
}