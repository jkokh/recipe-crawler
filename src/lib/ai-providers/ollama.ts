import { Ollama } from 'ollama';
import {AIProvider, AIRequestOptions} from "../../ai/types";


interface OllamaProviderConfig {
  host?: string;
  returnJsonStructure?: string | object;
}

export class OllamaProvider implements AIProvider {
  private ollama: Ollama;
  public model = 'llama3.1:latest';
  private readonly returnJsonStructure?: string | object;

  constructor(config: OllamaProviderConfig = {}) {
    this.ollama = new Ollama({
      host: config.host || 'http://localhost:11434',
    });
    this.returnJsonStructure = config.returnJsonStructure;
  }

  async ask<T = any>(prompt: string | any, model?: string, system?: string, options?: AIRequestOptions, jsonStructure?: any): Promise<T> {
    try {
      let promptText = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);

      // Use provided jsonStructure or fallback to instance returnJsonStructure
      const structure = jsonStructure || this.returnJsonStructure;
      if (structure) {
        const structureString = typeof structure === 'string' ? structure : JSON.stringify(structure);
        promptText += `\n\nPlease return a JSON response following this structure: ${structureString}`;
      }

      const response = await this.ollama.generate({
        model: model || this.model,
        prompt: promptText,
        system,
        stream: false,
        format: 'json',
        options,
      });

      if (!response.response || response.response.trim() === '') {
        throw new Error('Empty response from Ollama');
      }

      // Try to parse JSON, with fallback for malformed responses
      try {
        return JSON.parse(response.response);
      } catch (parseError) {
        const jsonMatch = response.response.match(/\{.*\}/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw parseError;
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from Ollama: ${error.message}`);
      }
      throw new Error(`Ollama JSON request failed: ${error.message}`);
    }
  }
}