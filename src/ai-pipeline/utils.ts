export function getPrompt(data: any, prompt: string): string {
  // Replace <%data%> placeholder with stringified data
  return prompt.replace('<%data%>', JSON.stringify(data));
}
