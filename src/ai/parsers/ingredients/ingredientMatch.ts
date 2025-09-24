import {prisma} from "../../../lib/iterator";


export type LoadedIng = {
    id: bigint;
    name: string;
    key: string;     // normalized
    altKey: string;  // hyphens -> spaces
    tokens: number;
    len: number;
};

function norm(s: string): string {
    return s
        .normalize("NFC")
        .toLowerCase()
        .replace(/[^a-z -]+/g, " ") // keep letters, spaces, hyphens
        .replace(/\s+/g, " ")
        .trim();
}

export async function preloadIngredients(): Promise<LoadedIng[]> {
    const rows = await prisma.ingredient.findMany({
        select: { id: true, name: true },
    });

    const list: LoadedIng[] = rows.map(r => {
        const key = norm(r.name);
        const altKey = key.replace(/-/g, " ");
        const tokens = altKey.split(" ").filter(Boolean).length;
        return { id: r.id, name: r.name, key, altKey, tokens, len: altKey.length };
    }).filter(x => x.key);

    // longest phrase first
    list.sort((a, b) => b.tokens - a.tokens || b.len - a.len);
    return list;
}

export function findIngredientId(text: string, list: LoadedIng[]): bigint | null {
    const hay1 = ` ${norm(text)} `;
    const hay2 = ` ${norm(text).replace(/-/g, " ")} `;
    for (const it of list) {
        if (hay1.includes(` ${it.key} `) || hay2.includes(` ${it.altKey} `)) {
            return it.id;
        }
    }
    return null;
}
