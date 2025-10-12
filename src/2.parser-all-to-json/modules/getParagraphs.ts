import * as cheerio from "cheerio";
import {getImageIds, hasLinks} from "./parserUtils";
import {SourceImage} from "@prisma/client";
import {Paragraph} from "../../types";


export type ParagraphsResult = Paragraph[] | null;

export const getParagraphs = ($article: cheerio.Cheerio, sourceImages: SourceImage[]): ParagraphsResult => {
    const $ = cheerio.load($article[0]);

    const $paragraphs = $('.article-content-container');

    if (!$paragraphs.length) {
        return null;
    }

    let data: Paragraph[] = [];
    let exit = false;

    $('*[id^="mntl-sc-block_"]').each((index, element) => {
        const paragraph: Paragraph = {};
        const el = $(element);

        if (el.text().toLocaleLowerCase().includes('did you love the recipe')) {
            return;
        }


        if (/read more:/i.test(el.text())) {
            return;
        }

        if (/make it a meal:/i.test(el.text())) {
            return;
        }

        let tag = $(element).prop('tagName');

        if ($(element).hasClass('lifestyle-sc-block-callout')) {
            const header = $(element).find('.mntl-sc-block-callout-heading').text().trim();
            const text = $(element).find('.mntl-sc-block-callout-body').text().trim();
            if (header) {
                // data.push({ header });
            }
            if (text) {
                data.push({ text });
            }
            return;
        }
        const text = el.text().trim();
        if (exit || (tag === 'H2') && text.toLocaleLowerCase().startsWith('more')) {
            exit = true;
            return;
        }
        if (tag === 'H2' || tag === 'H3' || tag === 'H1') {
            paragraph.header = text;
        } else if (tag === 'P') {
            paragraph.text = text;
        }
        const list: string[] = [];
        if (tag === 'UL' || tag === 'OL') {
            const $lis = $(element).find('LI');
            const list: string[] = [];

            $lis.each((_, li) => {
                const $li = $(li);
                const liText = $li.text().trim();
                if (liText) list.push(liText);
            });

            // skip if all items have links
            if ($lis.length > 0 && $lis.toArray().every(li => hasLinks($(li)))) {
                return;
            }

            if (list.length > 0) {
                paragraph.list = list;
            }
        }
        const images = getImageIds($(element), sourceImages);

        if (images.length > 0) {
            paragraph.images = images;
        }
        if (list.length > 0) {
            paragraph.list = list;
        }

        if (paragraph.text || paragraph.header || paragraph.list || paragraph.images) {
            data.push(paragraph);
        }
    })

    $paragraphs.remove();

    const lastParagraph = data[data.length - 1];
    if (lastParagraph?.header && !lastParagraph.text && !lastParagraph.list && !lastParagraph.images) {
        data.pop();
    }

    return data.length ? data : null;
}