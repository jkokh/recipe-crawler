export const getImageIdsForTheStep = (stepImageUrls: string[], recipe: Recipe): number[] => {
    const recipeImages = recipe.recipeUrl?.images ?? [];

    if (!stepImageUrls?.length || !recipeImages.length) {
        return [];
    }

    // Create mapping from image URL to image ID
    const urlToImageIdMap = new Map<string, number>();
    for (const image of recipeImages) {
        if (image?.imageUrl && typeof image.id === 'number') {
            urlToImageIdMap.set(image.imageUrl, image.id);
        }
    }

    // Collect unique image IDs for step images
    const uniqueImageIds: number[] = [];
    const processedIds = new Set<number>();

    for (const imageUrl of stepImageUrls) {
        const imageId = urlToImageIdMap.get(imageUrl);
        if (imageId != null && !processedIds.has(imageId)) {
            uniqueImageIds.push(imageId);
            processedIds.add(imageId);
        }
    }

    return uniqueImageIds;
};

