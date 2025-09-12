export const prompts = [
    `You are a function that only outputs JSON.

INPUT is an object: { header: "string", text: "string" }

TASK
- Rephrase both "header" if possible and "text".
- The "header" must stay concise (short and clear).
- The "text" must be rephrased but keep the original meaning.
- If rephrasing of header is not possible, return the original value.

OUTPUT (STRICT)
Return ONLY a JSON object:
{ "header": "string", "text": "string" }

NO other text, explanations, or formatting.

DATA TO PROCESS:
<%data%>`
];