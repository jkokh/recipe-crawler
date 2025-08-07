import * as cheerio from 'cheerio';
import { Prisma } from "@prisma/client";

interface ParagraphWithContent {
    title?: string;
    content: string;
    lists?: Array<{
        items: string[];
    }>;
    images?: number[]; // Changed from string[] to number[] for image IDs
}

interface ArticleJson {
    mainTitle: string;
    mainImage?: number; // ID of the main/lead image
    paragraphs: ParagraphWithContent[];
}

type RecipeWithImages = Prisma.RecipeUrlGetPayload<{
    select: {
        id: true
        recipeUrl: true
        htmlClean: true
        htmlContent: true
        images: true
    }
}>

/**
 * Helper function to match image URLs with database image IDs
 */
function getImageIdFromUrl(imageUrl: string, recipeImages: RecipeWithImages['images']): number | null {
    const matchingImage = recipeImages.find(img => img.imageUrl === imageUrl);
    return matchingImage ? matchingImage.id : null;
}

export const extractArticleContent = (html: string, recipe: RecipeWithImages): ArticleJson => {
    const $ = cheerio.load(html);

    // Initialize result with properly typed arrays
    const result: ArticleJson = {
        mainTitle: '',
        mainImage: undefined,
        paragraphs: []
    };

    // Extract main title (h1 or first major heading)
    result.mainTitle = $('h1, .article-heading, .recipe-title').first().text().trim();
    if (!result.mainTitle) {
        // Fallback to first h2 if no h1 is found
        result.mainTitle = $('h2').first().text().trim();
    }

    // Remove recommendation sections before processing content
    removeRecommendationSections($ as any);

    // Find the article content container - use multiple selectors for better coverage
    let $articleContent = $('.article-content, .comp.article-content-container, .mntl-sc-page, .entry-content, #article-body');

    if (!$articleContent.length) {
        // If no specific content container is found, use the body
        $('script, style, header, footer, nav, .advertisement, .ad-container').remove();
        $articleContent = $('body');
    }

    // Extract all 1500x0 image sources from the article
    const imageUrls = extractImageUrls($ as any, $articleContent);

    // Convert image URLs to image IDs by matching with database images
    const imageIds: number[] = [];
    imageUrls.forEach(imageUrl => {
        const imageId = getImageIdFromUrl(imageUrl, recipe.images);
        if (imageId !== null) {
            imageIds.push(imageId);
        }
    });

    // Extract main image - prioritize first paragraph image if it's a LEAD type
    let mainImageId: number | undefined;

    // Check if first extracted image is a LEAD type
    if (imageIds.length > 0) {
        const firstImageId = imageIds[0];
        const firstImage = recipe.images.find(img => img.id === firstImageId);
        if (firstImage && firstImage.type && firstImage.type.startsWith('LEAD')) {
            mainImageId = firstImageId;
        }
    }

    // Fallback to first LEAD image from database if no LEAD image found in first paragraph
    if (!mainImageId) {
        const leadImages = recipe.images.filter(img => img.type && img.type.startsWith('LEAD')).sort((a, b) => a.type!.localeCompare(b.type!));
        if (leadImages.length > 0) {
            mainImageId = leadImages[0].id;
        }
    }

    result.mainImage = mainImageId;

    const headings: {text: string, element: cheerio.Element}[] = [];
    $articleContent.find('h2, h3, h4, h5, h6').each((_, heading) => {
        // Skip recommendation headings
        const headingText = $(heading).text().trim();
        if (isRecommendationHeading(headingText)) {
            return;
        }

        headings.push({
            text: removeAttribution(headingText),
            element: heading
        });
    });

    // Extract all paragraphs
    const paragraphs: ParagraphWithContent[] = [];
    let imageIndex = 0; // Track which image ID to assign to which paragraph

    $articleContent.find('p').each((_, p) => {
        // Check if this paragraph is inside a recommendation section
        if (isInRecommendationSection($ as any, p)) {
            return; // Skip this paragraph
        }

        // Get raw HTML and clean it
        let html = $(p).html() || '';

        // Create a new element with the cleaned HTML
        const $cleanP = $(`<div>${html}</div>`);

        // Remove any unwanted elements including images
        $cleanP.find('.advertisement, .social-share, img, figure').remove();

        // Get the text content
        const text = $cleanP.text().trim();

        // Skip empty paragraphs, advertisements, and social media prompts
        if (text &&
            !text.includes('Advertisement') &&
            !text.includes('Follow us on') &&
            !text.includes('Share this recipe') &&
            !text.includes('Read More') &&
            !text.includes('Try these')) {

            // Clean up text by removing attributions
            const cleanText = removeAttribution(text);
            if (cleanText) {
                // Create a properly typed paragraph object
                const paragraph: ParagraphWithContent = {
                    content: cleanText
                };

                // Assign image ID to paragraph if available
                if (imageIndex < imageIds.length) {
                    paragraph.images = [imageIds[imageIndex]];
                    imageIndex++;
                }

                paragraphs.push(paragraph);
            }
        }
    });

    // Filter duplicates by content and assign to result
    const uniqueParagraphs = Array.from(
        new Map(paragraphs.map(p => [p.content, p])).values()
    );
    result.paragraphs = uniqueParagraphs;

    // If there are remaining image IDs and we have paragraphs, distribute them
    while (imageIndex < imageIds.length && result.paragraphs.length > 0) {
        const paragraphIndex = (imageIndex - result.paragraphs.filter(p => p.images).length) % result.paragraphs.length;
        if (!result.paragraphs[paragraphIndex].images) {
            result.paragraphs[paragraphIndex].images = [];
        }
        result.paragraphs[paragraphIndex].images!.push(imageIds[imageIndex]);
        imageIndex++;
    }

    // Extract all lists
    const allLists: Array<{items: string[]}> = [];
    $articleContent.find('ul, ol').each((_, list) => {
        // Check if this list is a recommendation list
        if (isRecommendationList($ as any, list)) {
            return; // Skip this list
        }

        const items: string[] = [];
        $(list).find('li').each((_, li) => {
            // Get raw HTML and clean it
            let html = $(li).html() || '';

            // Create a new element with the cleaned HTML
            const $cleanLi = $(`<div>${html}</div>`);

            // Remove any unwanted elements including images
            $cleanLi.find('.advertisement, .social-share, img, figure').remove();

            // Get the text content
            const text = $cleanLi.text().trim();

            if (text) {
                items.push(removeAttribution(text));
            }
        });

        if (items.length > 0) {
            allLists.push({ items });
        }
    });

    // Process lists and attach them to paragraphs
    if (allLists.length > 0 && paragraphs.length > 0) {
        // Attach lists to paragraphs
        // Start by attaching the first list to the last paragraph
        const lastParagraph = result.paragraphs[result.paragraphs.length - 1];
        if (!lastParagraph.lists) {
            lastParagraph.lists = [];
        }
        lastParagraph.lists.push(allLists[0]);

        // Create new paragraphs for any remaining lists
        for (let i = 1; i < allLists.length; i++) {
            result.paragraphs.push({
                content: '',
                lists: [allLists[i]]
            });
        }
    } else if (allLists.length > 0) {
        // If we have lists but no paragraphs, create paragraphs for the lists
        allLists.forEach(list => {
            result.paragraphs.push({
                content: '',
                lists: [list]
            });
        });
    }

    return result;
};

/**
 * Extracts 1500x0 image URLs from the article content
 */
function extractImageUrls($: cheerio.CheerioAPI, $articleContent: cheerio.Cheerio): string[] {
    const imageUrls: string[] = [];
    const seenUrls = new Set<string>(); // To avoid duplicates

    // Look for images in various attributes and elements
    $articleContent.find('img, figure').each((_, element) => {
        const $el = $(element);

        // Check data-src attribute
        let src = $el.attr('data-src');
        if (!src) {
            // Check src attribute
            src = $el.attr('src');
        }
        if (!src) {
            // Check data-hi-res-src attribute
            src = $el.attr('data-hi-res-src');
        }

        // Type-safe check for figure elements
        if (!src && 'tagName' in element && element.tagName === 'figure') {
            // Look for img inside figure
            const imgSrc = $el.find('img').attr('data-src') || $el.find('img').attr('src') || $el.find('img').attr('data-hi-res-src');
            if (imgSrc) {
                src = imgSrc;
            }
        }

        // Check if the URL contains 1500x0 and is not already added
        if (src && src.includes('1500x0') && !seenUrls.has(src)) {
            imageUrls.push(src);
            seenUrls.add(src);
        }

        // Also check srcset for 1500x0 URLs
        const srcset = $el.attr('srcset') || $el.attr('data-srcset');
        if (srcset) {
            const srcsetUrls = srcset.split(',');
            srcsetUrls.forEach(srcsetUrl => {
                const url = srcsetUrl.trim().split(' ')[0]; // Get URL part, ignore width descriptor
                if (url.includes('1500x0') && !seenUrls.has(url)) {
                    imageUrls.push(url);
                    seenUrls.add(url);
                }
            });
        }
    });

    return imageUrls;
}

/**
 * Removes attribution text like "Simply Recipes / {name}" from text
 */
function removeAttribution(text: string): string {
    return text
        .replace(/Simply Recipes\s*\/\s*[^,\.]+/g, '')
        .replace(/\(Simply Recipes\)/g, '')
        .replace(/Simply Recipes/g, '')
        // Clean up any double spaces that might result from removals
        .replace(/\s{2,}/g, ' ')
        .trim();
}

/**
 * Removes recommendation sections like "More X to Try" from the DOM
 */
function removeRecommendationSections($: cheerio.CheerioAPI): void {
    // First pass: Find and remove recommendation headings and their associated content
    $('h2, h3, h4').each((_, heading) => {
        const headingText = $(heading).text().trim().toLowerCase();

        if (headingText.includes('more') &&
            (headingText.includes('to try') ||
                headingText.includes('recipes') ||
                headingText.includes('you might like'))) {

            // Remove this heading and all elements until the next heading
            $(heading).nextUntil('h2, h3, h4').remove();
            $(heading).remove();
        }
    });

    // Second pass: Remove elements with recommendation-related classes
    $('.recipe-card, .related-content, .recommended, .suggestion-box').remove();

    // Third pass: Remove lists that primarily contain links
    $('ul, ol').each((_, list) => {
        const $list = $(list);
        const $links = $list.find('a');
        const $listItems = $list.find('li');

        // If most list items contain links, this is likely a recommendation list
        if ($links.length > 0 && $links.length >= $listItems.length * 0.7) {
            $list.remove();
        }
    });

    // Fourth pass: Remove data-src and src attributes from recommendation sections only
    $('.recipe-card, .related-content, .recommended, .suggestion-box [data-src]').removeAttr('data-src');
    $('.recipe-card, .related-content, .recommended, .suggestion-box [src]').not('script').removeAttr('src');
    $('.recipe-card, .related-content, .recommended, .suggestion-box [srcset]').removeAttr('srcset');

    // Fifth pass: Clean up any potential empty paragraphs or containers left after removals
    $('p:empty').remove();
    $('.empty').remove();
}

/**
 * Checks if an element is within a recommendation section
 */
function isInRecommendationSection($: cheerio.CheerioAPI, element: cheerio.Element): boolean {
    // Check if any parent or previous sibling headings indicate this is in a recommendation section
    let isInRecSection = false;
    let currentElement = element;

    // Check previous sibling headings
    $(currentElement).prevAll('h2, h3, h4').each((_, heading) => {
        const headingText = $(heading).text().trim().toLowerCase();
        if (isRecommendationHeading(headingText)) {
            isInRecSection = true;
            return false; // break the each loop
        }
    });

    if (isInRecSection) return true;

    // Check parent containers
    let $parent = $(element).parent();
    while ($parent.length && !$parent.is('body')) {
        // Check if this parent has a recommendation class
        if ($parent.hasClass('related-content') ||
            $parent.hasClass('recommended') ||
            $parent.hasClass('suggestion-box')) {
            return true;
        }

        // Check previous sibling headings of this parent
        $parent.prevAll('h2, h3, h4').each((_, heading) => {
            const headingText = $(heading).text().trim().toLowerCase();
            if (isRecommendationHeading(headingText)) {
                isInRecSection = true;
                return false; // break the each loop
            }
        });

        if (isInRecSection) return true;

        // Move up to the next parent
        $parent = $parent.parent();
    }

    return false;
}

/**
 * Checks if a list element is a recommendation list
 */
function isRecommendationList($: cheerio.CheerioAPI, list: cheerio.Element): boolean {
    const $list = $(list);

    // Check if this list is within a recommendation section
    if (isInRecommendationSection($, list)) {
        return true;
    }

    // Check if this list has many links (typical of recommendation lists)
    const $links = $list.find('a');
    const $listItems = $list.find('li');

    // If more than 70% of list items contain links, it's likely a recommendation list
    if ($links.length > 0 && $links.length >= $listItems.length * 0.7) {
        return true;
    }

    return false;
}

/**
 * Checks if a heading text indicates a recommendation section
 */
function isRecommendationHeading(headingText: string): boolean {
    const lowerText = headingText.toLowerCase();

    return (lowerText.includes('more') &&
            (lowerText.includes('to try') ||
                lowerText.includes('recipes') ||
                lowerText.includes('you might like'))) ||
        lowerText.includes('related') ||
        lowerText.includes('recommended') ||
        lowerText.includes('try these') ||
        lowerText.includes('similar recipes') ||
        lowerText.includes('see also');
}