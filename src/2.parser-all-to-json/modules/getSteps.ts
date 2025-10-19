import * as cheerio from "cheerio";
import {SourceImage} from "@prisma/crawler";
import {getImageIds} from "./parserUtils";
import {Step} from "@/types";


export const getSteps = ($article: cheerio.Cheerio, sourceImages: SourceImage[]): Step[] | null  => {

    const $ = cheerio.load($article[0]);

    const $steps = $('.structured-project__steps');

    if (!$steps.length) {
        return null;
    }

    const data: Step[] = [];

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

        const images = getImageIds($step, sourceImages);

        data.push({
            title,
            instructions: instructions.trim(),
            images
        });
    });
    $steps.remove();
    return data.length ? data : null;
}

function removeAttribution(text: string): string {
    // Remove the "Simply Recipes / Name" pattern
    return text
        .replace(/Simply Recipes\s*\/\s*[^,.]+/g, '')
        .replace(/\(Simply Recipes\)/g, '')
        .replace(/Simply Recipes/g, '')
        // Clean up any double spaces that might result from removals
        .replace(/\s{2,}/g, ' ')
        .trim();
}