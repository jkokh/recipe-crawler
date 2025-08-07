export const prompts = [
    `TEXT:<%data%>

TASK:
Check if TEXT contains any personal references. Match ONLY these exact whole words:

I, me, my, mine, myself, you, your, yours, yourself, he, him, his, she, her, hers, herself, we, us, our, ours, ourselves, they, them, their, theirs, themselves, grandma's, mom's, dad's, or any first/last name.

OUTPUT:
If found, return: { "result": "yes" }
If not found, return: { "result": "no" }

Return ONLY valid JSON, nothing else.`
];
