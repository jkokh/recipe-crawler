import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const PAGE_SIZE = 100;

// Allowed attributes
const IMG_ALLOWED_ATTRS = ['src', 'alt'];
const A_ALLOWED_ATTRS = ['href'];

// Tags to fully remove
const REMOVE_TAGS = ['svg', 'button', 'figcaption'];

// Tags to strip all attributes
const STRIP_ALL_ATTRS_TAGS = ['div', 'p', 'ul', 'li', 'figure', 'span', 'article', 'h1'];

function cleanAttributes($: cheerio.CheerioAPI, el: cheerio.Element, allowed: string[] = []) {
    const $el = $(el);
    const attrs = $el.attr() || {};
    Object.keys(attrs).forEach(attr => {
        if (!allowed.includes(attr)) {
            $el.removeAttr(attr);
        }
    });
}

function cleanNodeRecursive($: cheerio.CheerioAPI, node: cheerio.Element) {
    if (node.type !== 'tag') return;

    const tag = node.tagName.toLowerCase();
    const $el = $(node);

    if (REMOVE_TAGS.includes(tag)) {
        $el.remove();
        return;
    }

    if (tag === 'img') {
        cleanAttributes($, node, IMG_ALLOWED_ATTRS);
    } else if (tag === 'a') {
        cleanAttributes($, node, A_ALLOWED_ATTRS);
    } else if (STRIP_ALL_ATTRS_TAGS.includes(tag)) {
        cleanAttributes($, node);
    }

    if (tag === 'noscript') {
        const rawHtml = $el.html()?.trim();
        if (rawHtml && rawHtml.includes('<img')) {
            const inner$ = cheerio.load(rawHtml, { decodeEntities: false });
            inner$('img').each((_, img) => {
                cleanAttributes(inner$, img, IMG_ALLOWED_ATTRS);
            });
            $el.html(inner$('body').html() || '');
        }
    }

    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            cleanNodeRecursive($, child);
        }
    }
}

// 🪓 Remove everything *after* the first <div><div>Explore More:</div></div>
function truncateAfterExploreMore($: cheerio.CheerioAPI, $article: cheerio.Cheerio) {
    const match = $article.find('div > div').filter((_, el) => $(el).text().trim() === 'Explore More:').first();

    if (match.length) {
        const outerDiv = match.parent();
        const cutoff = outerDiv.length ? outerDiv : match;

        let $parent = cutoff;
        while ($parent.length && !$parent.is('article')) {
            $parent.nextAll().remove(); // Remove all siblings after this block
            $parent = $parent.parent();
        }

        cutoff.remove(); // Remove Explore More block itself
    }
}

// 🧹 Recursively remove empty and unhelpful wrappers like <div><div></div></div>
function removeEmptyContainers($: cheerio.CheerioAPI, $root: cheerio.Cheerio) {
    let changed = true;
    while (changed) {
        changed = false;

        $root.find('div, span').each((_, el) => {
            const $el = $(el);
            const attrs = $el.attr() || {};

            // Remove if no attributes and:
            // - No text
            // - No non-empty children
            const onlyEmptyChildren =
                $el.children().length === 1 &&
                ($el.children().is('div') || $el.children().is('span')) &&
                !$el.text().trim();

            if (Object.keys(attrs).length === 0 && !$el.text().trim() && $el.children().length === 0) {
                $el.remove();
                changed = true;
            } else if (onlyEmptyChildren) {
                $el.replaceWith($el.children());
                changed = true;
            }
        });
    }
}

function extractCleanArticleHtml(html: string): string {
    const $ = cheerio.load(html, { decodeEntities: false });
    const $article = $('article').first();

    if (!$article.length) return '';

    cleanNodeRecursive($, $article[0]);

    truncateAfterExploreMore($, $article);

    removeEmptyContainers($, $article);

    return $.html($article);
}

async function main() {
    let skip = 0;
    const total = await prisma.recipeUrl.count({
        where: { htmlContent: { not: null } }
    });

    while (skip < total) {
        const recipes = await prisma.recipeUrl.findMany({
            where: { htmlContent: { not: null } },
            select: { id: true, htmlContent: true },
            skip,
            take: PAGE_SIZE
        });

        if (!recipes.length) break;

        for (const recipe of recipes) {
            if (!recipe.htmlContent) continue;

            const cleaned = extractCleanArticleHtml(recipe.htmlContent);

            await prisma.recipeUrl.update({
                where: { id: recipe.id },
                data: { htmlClean: cleaned }
            });

            console.log(`[SAVED] id=${recipe.id}`);
        }

        skip += recipes.length;
        console.log(`[PROGRESS] Processed ${skip}/${total}`);
    }

    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
