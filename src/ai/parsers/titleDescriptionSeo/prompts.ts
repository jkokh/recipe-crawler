export const prompts = [
    // Strict
    `Return ONLY JSON: { "title": string, "seo": string, "description": string }

RULES:
- Creative, professional, appetizing, keyword-rich (not spammy)
- Remove all personal references and names
- Don’t start paragraphs with verbs like “Discover” or “Indulge”, or other verbs
- Use <strong> only 1–2 times total, no self-closing tags

LENGTH:
- title: 30–70 chars
- seo: 2–3 words
- description: 3–4 paragraphs, each 40–80 words, ≥250 chars, wrapped in <p>...</p>

DATA: <%data%>`,

    // Looser
    `Return ONLY JSON: { "title", "seo", "description" }

RULES:
- Professional, appetizing, keyword-rich
- No personal references or names
- Use <strong> sparingly, no self-closing tags

LENGTH:
- title: 30–70 chars
- seo: 2–3 words
- description: 2–3 paragraphs, 40–80 words each, wrapped in <p>...</p>

DATA: <%data%>`,

    // Validation-focused
    `Output ONLY JSON: { "title", "seo", "description" }

RULES:
- No personal references or names
- Professional, appetizing, full sentences, vivid details
- Use <strong> max twice in total

LENGTH:
- title: 30–70 chars
- seo: 2–3 words
- description: 2–3 paragraphs, each 40–80 words AND ≥250 chars, wrapped in <p>...</p>

DATA: <%data%>`
];
