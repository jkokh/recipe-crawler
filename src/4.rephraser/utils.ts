export type IndexedText = { index: number; text: string };
export type TextPair = { sourceText: string; alteredText: string };
export type MappedTextPair = TextPair & { index: number };

export function mapIndexedTexts<T>(
    source: T[],
    altered: IndexedText[],
    getText: (item: T) => string | null
): MappedTextPair[] {
    return altered
        .map(({ index, text }) => {
            const sourceItem = source[index];
            const sourceText = sourceItem ? getText(sourceItem) : null;
            return sourceText ? { sourceText, alteredText: text, index } : null;
        })
        .filter((pair): pair is MappedTextPair => pair !== null);
}