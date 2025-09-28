import { RecipeJson } from "../../types";

export const configs = {
    paragraphs: {
        batchIdsFile: 'batch-ids/paragraph.txt',
        parseBatchLine: (line: string) => {
            const [batchId, srcId] = line.split(' ');
            return { batchId, sourceId: srcId ? parseInt(srcId) : undefined };
        },
        parseCustomId: (customId: string) => ({ index: parseInt(customId) }),
        getDataArray: (json: RecipeJson) => json.paragraphs,
        getText: (p: any) => p.text || null,
        type: 'paragraph',
        version: 'claudebatch-{{sourceId}}_{{index}}'
    },

    images: {
        batchIdsFile: 'batch-ids/image.txt',
        parseBatchLine: (line: string) => ({ batchId: line.trim() }),
        parseCustomId: (customId: string) => {
            const [id, index] = customId.split('_');
            return { sourceId: parseInt(id), index: parseInt(index) };
        },
        getDataArray: (json: RecipeJson) => json.images,
        getText: (img: any) => img?.alt || null,
        type: 'image-alt',
        version: 'claudebatch-{{sourceId}}_{{index}}'
    },
    titles: {
        batchIdsFile: 'batch-ids/title.txt',
        parseBatchLine: (line: string) => ({ batchId: line.trim() }),
        parseCustomId: (customId: string) => ({
            sourceId: parseInt(customId),
            index: 0  // titles are single items, not arrays
        }),
        // For titles, we create a single-item array with the title
        getDataArray: (json: RecipeJson) => json.title ? [json.title] : null,
        getText: (title: string) => title,
        type: 'title',
        version: 'claudebatch-{{sourceId}}'
    }
} as const;