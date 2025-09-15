export const prompts = [
    `You are a function that outputs JSON only.

CONTEXT
The input is a RECIPE.

GOAL
Return an array of step objects in cooking order (MINIMUM 2 STEPS):
[{ "title": "...", "instructions": "..." }]

RULES
• Split into multiple steps. Do NOT return a single element containing "1) 2) 3) …".
• Remove list markers and numbering from each step: leading bullets (•, -, —) and numerals like "1.", "1)", "1)".
• EXCLUDE ingredient lines/lists (lines that start with quantities like "1", "1/2", "2–3", "¼", or contain units like cup(s), tbsp, tsp, oz, lb, g, ml, liter(s), clove(s), stick(s), can(s), jar(s), bottle(s), bag(s), package, pkg).
• Keep only procedural instructions (actions, times, temps). Ignore tips, notes, yields, and equipment lists.

TITLE
• Imperative verb phrase, concise (≤ 5 words). If a heading exists but isn’t an action, rewrite it as an imperative; strip trailing ":".
• If no heading, derive from the instruction’s first action.

INSTRUCTIONS
• Use the recipe’s actual procedure; merge wrapped lines that belong together. Do not invent details.

OUTPUT (STRICT)
Return ONLY a JSON array of {"title","instructions"} with at least 2 items. If truly no steps exist, return [].

DATA TO PROCESS:
<%data%>`
];
