import { iterate, prisma } from '../../iterator';
import {Recipe} from "./types";
import * as cheerio from "cheerio";

type Block = {
    tag: 'P' | 'DIV' | 'H2' | 'H1' | 'UL' | 'H3' | 'IMG';
    element: any;
    text?: string;
    list?: string[];
    images?: string[];
}

export function getSimplyDataSrc(el: cheerio.Cheerio): string[] {
    const urls: string[] = [];

    el.find("img[data-src]").each((_, img) => {
        const url = (img as any).attribs["data-src"]; // use same Cheerio context
        if (url && /^https:\/\/www\.simplyrecipes\.com\/thmb\/.+\/1500x0\/filters:/.test(url)) {
            urls.push(url);
        }
    });

    return urls;
}

export async function process() {
    await iterate(prisma.recipe)
        .select({
            id: true,
            steps: true,
            recipeUrl: {
                select: {
                    htmlContent: true,
                    json: true,
                    images: { select: { id: true, imageUrl: true } },
                    htmlClean: true
                },
            },
        })
        .where({
             id: 1
        })
        .startPosition(1)
        .perPage(50)
        .entityName('recipes')
        .forEachAsync(async (recipe: Recipe) => {
            const html = recipe.recipeUrl!.htmlContent!;
            const $ = cheerio.load(html);
            const articleTitle = $('article h1').text().trim();

            let blocks: Block[] = [];
            let exit = false;
            $('*[id^="mntl-sc-block_"]').each((index, element) => {
                let tag = $(element).prop('tagName');
                if ($(element).hasClass('lifestyle-sc-block-callout')) {
                    console.log('found callout:', index);
                    const header = $(element).find('.mntl-sc-block-callout-heading').text().trim();
                    const text = $(element).find('.mntl-sc-block-callout-body').text().trim();
                    if (header) {
                        blocks.push({ tag: 'H2', element, text: header });
                    }
                    if (text) {
                        blocks.push({ tag: 'P', element, text });
                    }
                    return;
                }
                const el = $(element)
                const text = el.text().trim();
                if (exit || (tag === 'H2') && text.toLocaleLowerCase().startsWith('more')) {
                    exit = true;
                    return;
                }

                // scan for lists inside
                const childUlElements = $(element).children('UL');
                if (childUlElements.length > 0) {
                    console.log('found UL inside:', index);
                }

                const list: string[] = [];
                if (tag === 'UL') {
                    $(element).find('LI').each((index, li) => {
                        const liText = $(li).text().trim();
                        if (liText) list.push(liText);
                    });
                    if (list.length > 0) {
                        tag = 'UL';
                    }
                }
                const images = getSimplyDataSrc($(element));
                const block: Block = { tag, element, text };
                if (images.length > 0) {
                    block.tag = 'IMG';
                    block.images = images;
                }
                if (list.length > 0) {
                    block.list = list;
                }
                blocks.push(block);
            })
            blocks = blocks.filter((data) => data.text && ['P', 'UL', 'DIV', 'IMG', 'H1', 'H2', 'H3'].some(tag => data.tag.includes(tag)));


            console.log(blocks);

            if (!articleTitle) console.log('NO ARTICLE TITLE')

        });

}

async function main() {
    try { await process(); }
    catch (error) { console.error('Error processing recipes:', error); }
}
void main();
