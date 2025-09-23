import OpenAI from "openai";
import "dotenv/config";
import {AIProvider, AIRequestOptions} from "../ai/types";

const MODEL = "gpt-4.1-nano";

interface GPTProviderConfig {
  apiKey?: string;            // defaults to process.env.OPENAI_API_KEY
  baseURL?: string;           // optional (proxy/self-hosted)
  model?: string;             // default below
  returnJsonStructure?: string | object;
  maxInputLength?: number;    // character limit for input
}

export class GPTProvider implements AIProvider {
  private client: OpenAI;
  public model: string;
  private readonly returnJsonStructure?: string | object;
  private readonly maxInputLength: number;

  constructor(config: GPTProviderConfig = {}) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: config.baseURL,
    });
    this.model = MODEL;
    this.returnJsonStructure = config.returnJsonStructure;
    this.maxInputLength = config.maxInputLength || 3000;
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    // Try to truncate at a sensible boundary (sentence or paragraph)
    const truncated = text.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    const lastParagraph = truncated.lastIndexOf('\n');

    if (lastSentence > maxLength * 0.8) {
      return truncated.substring(0, lastSentence + 1);
    } else if (lastParagraph > maxLength * 0.8) {
      return truncated.substring(0, lastParagraph);
    }

    return truncated + '...';
  }

  async ask<T = any>(
      prompt: string | any,
      model?: string,
      system?: string,
      options?: AIRequestOptions
  ): Promise<T> {
    try {
      let promptText = typeof prompt === "string" ? prompt : JSON.stringify(prompt);

      // Truncate input if it exceeds limit
      promptText = this.truncateText(promptText, this.maxInputLength);

      /*const structure = jsonStructure ?? this.returnJsonStructure;
      if (structure) {
        const structureString = typeof structure === "string" ? structure : JSON.stringify(structure);
        promptText += `\n\nPlease return a JSON response following this structure: ${structureString}`;
      }*/

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (system) {
        messages.push({ role: "system", content: system });
      }

      messages.push({ role: "user", content: promptText });

      // Build request parameters
      const requestParams: OpenAI.Chat.ChatCompletionCreateParams = {
        model: model || this.model,
        messages,
        temperature: options?.temperature,
        top_p: options?.top_p,
        presence_penalty: options?.repeat_penalty ? options.repeat_penalty - 1 : undefined,
        frequency_penalty: (options as any)?.frequency_penalty,
        stop: options?.stop,
      };

      // Add response format if structure is provided
/*      if (structure) {
        requestParams.response_format = { type: "json_object" };
      }*/

      const response = await this.client.chat.completions.create(requestParams);

      const text = response.choices[0]?.message?.content ?? "";

      if (!text || text.trim() === "") {
        throw new Error("Empty response from GPT");
      }

      try {
        return text as T;
      } catch (parseError) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw parseError;
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from GPT: ${error.message}`);
      }
      throw new Error(`GPT JSON request failed: ${error.message}`);
    }
  }
}