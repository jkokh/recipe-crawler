import * as cheerio from "cheerio";
import {Step} from "../types";
import {Source} from "@prisma/client";
import {getImageIds, hasLinks} from "./parserUtils";


interface StepsResult {
    data: Step[] | null;
    needsReview: boolean;
}

export const getSteps = ($article: cheerio.Cheerio, source: Source): StepsResult  => {

    const $ = cheerio.load($article[0]);

    const $steps = $('.structured-project__steps');

    if (!$steps.length) {
        return { data: null, needsReview: false };
    }

    const data: Step[] = [];
    let needsReview = false;

    $steps.find('ol > li').each((_, stepElement) => {
        const $step = $(stepElement);
        const $subheading = $step.find('.mntl-sc-block-subheading__text');
        const title = $subheading.text().trim();
        let instructions = '';
        $step.find('p').each((_, p) => {
            let text = $(p).text().trim();
            if (text.includes('Did you love the recipe?')) {
                return;
            }
            text = removeAttribution(text);
            if (text) {
                instructions += text + ' ';
            }
        });

        const images: string[] = [];
        $step.find('img').each((_, img) => {
            const src = $(img).attr('src');
            if (src) {
                images.push(src);
            } else {
                const dataSrc = $(img).attr('data-src');
                if (dataSrc) {
                    images.push(dataSrc);
                }
            }
        });

        if (hasLinks($steps)) {
            needsReview = true;
        }

        data.push({
            title,
            instructions: instructions.trim(),
            images: getImageIds(images, source)
        });
    });
    $steps.remove();
    return { data: data.length ? data : null, needsReview };
}

function removeAttribution(text: string): string {
    // Remove "Simply Recipes / Name" pattern
    return text
        .replace(/Simply Recipes\s*\/\s*[^,\.]+/g, '')
        .replace(/\(Simply Recipes\)/g, '')
        .replace(/Simply Recipes/g, '')
        // Clean up any double spaces that might result from removals
        .replace(/\s{2,}/g, ' ')
        .trim();
}