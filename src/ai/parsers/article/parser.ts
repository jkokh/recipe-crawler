import * as cheerio from "cheerio";

export type Block = {
    type: "heading" | "paragraph" | "list";
    text?: string;       // for heading/paragraph
    images?: string[];   // optional images discovered in-scope
    list?: string[];     // for list blocks
};

// --- helpers --------------------------------------------------------------

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

const isHeading = ($el: cheerio.Cheerio) => {
    const tag = ($el.prop("tagName") || "").toString().toUpperCase();
    return tag === "H1" || tag === "H2" || tag === "H3";
};

const isParagraph = ($el: cheerio.Cheerio) =>
    $el.is("p.mntl-sc-block-html") || ($el.prop("tagName") || "").toString().toUpperCase() === "P";

const isList = ($el: cheerio.Cheerio) => {
    const tag = ($el.prop("tagName") || "").toString().toUpperCase();
    return tag === "UL" || tag === "OL";
};

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
// Extract <li> texts from a UL/OL
function extractList($ul: cheerio.Cheerio, $: cheerio.CheerioAPI): string[] {
    return $ul.find("> li").map((_, li) => norm($(li).text())).get().filter(Boolean);
}

// Push helpers
function pushHeading(blocks: Block[], text: string, images?: string[]) {
    const t = norm(text);
    if (!t) return;
    const b: Block = { type: "heading", text: t };
    if (images && images.length) b.images = images;
    blocks.push(b);
}
function pushParagraph(blocks: Block[], text: string, images?: string[]) {
    const t = norm(text);
    if (!t) return;
    const b: Block = { type: "paragraph", text: t };
    if (images && images.length) b.images = images;
    blocks.push(b);
}
function pushList(blocks: Block[], items: string[], images?: string[]) {
    const arr = items.filter(Boolean);
    if (!arr.length) return;
    const b: Block = { type: "list", list: arr };
    if (images && images.length) b.images = images;
    blocks.push(b);
}

// --- core flattening ------------------------------------------------------

/**
 * Collect blocks from any element scope, flattening nested callouts, lists, and headings.
 * - Callouts: emits heading (title) then list (items) if found.
 * - Generic containers: recursively collects nested headings/paragraphs/lists.
 */
function collectBlocksFromScope($scope: cheerio.Cheerio, $: cheerio.CheerioAPI, out: Block[]) {
    // 0) Any images inside scope
    const scopedImages = getSimplyDataSrc($scope);

    // 1) Handle any callouts INSIDE this scope (flatten)
    $scope.find(".mntl-sc-block-callout").each((_, callout) => {
        const $callout = $(callout);

        const title = norm($callout.find(".mntl-sc-block-callout-heading").first().text());
        if (title) pushHeading(out, title, getSimplyDataSrc($callout));

        // List items inside body
        const $body = $callout.find(".mntl-sc-block-callout-body").first();
        if ($body.length) {
            // Prefer direct UL/OL > LI
            const listItems: string[] = [];
            $body.find("ul,ol").each((_, ul) => {
                listItems.push(...extractList($(ul), $));
            });
            // If no explicit list, fall back to text paragraph
            if (listItems.length) {
                pushList(out, listItems, getSimplyDataSrc($body));
            } else {
                const paraText = norm($body.text());
                if (paraText) pushParagraph(out, paraText, getSimplyDataSrc($body));
            }
        }
    });

    // 2) Direct children flattening in DOM order (headings, paragraphs, lists)
    $scope.children().each((_, child) => {
        const $el = $(child);

        // Skip if this child is (or inside) a callout—we already processed callout's internals
        if ($el.closest(".mntl-sc-block-callout").length) return;

        if (isHeading($el)) {
            pushHeading(out, $el.text(), getSimplyDataSrc($el));
            return;
        }
        if (isParagraph($el)) {
            pushParagraph(out, $el.text(), getSimplyDataSrc($el));
            return;
        }
        if (isList($el)) {
            const items = extractList($el, $);
            pushList(out, items, getSimplyDataSrc($el));
            return;
        }

        // If this is a generic container, recurse to pull any nested structure
        if ($el.find(".mntl-sc-block-callout, h1, h2, h3, p, ul, ol").length) {
            collectBlocksFromScope($el, $, out);
        } else {
            // Otherwise, if it's a leaf with meaningful text, treat as paragraph
            const text = norm($el.text() || "");
            if (text) pushParagraph(out, text, getSimplyDataSrc($el));
        }
    });

    // 3) If the scope itself had images but no content got them, attach to a trivial paragraph
    // (optional behavior; comment out if you don't want loose image-only blocks)
    if (scopedImages.length === 1 && out.length && !out[out.length - 1].images) {
        // attach to last block heuristically
        out[out.length - 1].images = scopedImages;
    }
}

// --- public API -----------------------------------------------------------

/**
 * Parse Simply Recipes-style article content into flattened blocks.
 * Honors the "stop at H2 starting with 'more'" behavior.
 */
export function parseMntlBlocks($: ReturnType<typeof cheerio.load>): Block[] {
    const blocks: Block[] = [];
    let exit = false;

    $('*[id^="mntl-sc-block"]').each((_, el) => {
        if (exit) return;

        const $el = $(el);
        const tag = ($el.prop("tagName") || "").toString().toUpperCase();
        const text = norm($el.text() || "");

        // Stop when encountering H2 that starts with "more"
        if (tag === "H2" && text.toLowerCase().startsWith("more")) {
            exit = true;
            return;
        }

        // Flatten this block's content
        collectBlocksFromScope($el, $ as cheerio.CheerioAPI, blocks);
    });

    // Final clean
    return blocks.filter((b) => {
        if (b.type === "list") return !!(b.list && b.list.length);
        if (b.type === "paragraph" || b.type === "heading") return !!(b.text && b.text.length);
        return false;
    });
}

// --- example integration in your loop ------------------------------------

// .forEachAsync(async (recipe: Recipe) => {
//   const html = recipe.recipeUrl!.htmlContent!;
//   const $ = cheerio.load(html);
//   const articleTitle = $("article h1").text().trim();
//
//   const blocks = parseMntlBlocks($);
//   console.log(blocks);
//
//   if (!articleTitle) console.log("NO ARTICLE TITLE");
// });