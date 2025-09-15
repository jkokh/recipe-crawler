export const prompts = [
    `Rewrite this recipe text to be neutral and instructional while preserving all cooking details.

REMOVE:
• Personal language (I, me, my, we, our, family references)
• Stories, anecdotes, and opinions
• Brand mentions and subjective descriptions

PRESERVE EXACTLY:
• All measurements, temperatures, and times
• All ingredients and cooking instructions
• Serving sizes and storage information

CONVERT TO NEUTRAL TONE:
• Personal instructions to general instructions
• Subjective opinions to objective statements
• Remove personal anecdotes while keeping useful context

EXAMPLES:
"I always use 2 cups flour and my mom taught me to add 1 tsp vanilla."
→ "Use 2 cups flour and add 1 tsp vanilla."

"This is amazing! Bake at 400°F for 25 minutes - it's perfect!"
→ "Bake at 400°F for 25 minutes."

Return only the rewritten recipe text. No explanations, comments, or analysis.

Text to rewrite:
<%data%>`
];