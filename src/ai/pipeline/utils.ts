export function getPrompt(data: any, prompt: string): string {
  // If data is a string, assume it's already processed
  if (typeof data === 'string') return data;

  // Replace <%data%> placeholder with stringified data
  return prompt.replace('<%data%>', JSON.stringify(data));
}