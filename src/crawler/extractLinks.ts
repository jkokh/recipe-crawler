import * as cheerio from "cheerio";
import { CrawlerConfig } from "./types.js";

export function extractLinks(html: string, cfg: CrawlerConfig): string[] {
    const $ = cheerio.load(html);

    const links: string[] = [];
    $(cfg.recipeLinkSelector).each((_, el) => {
        let href = $(el).attr("href");
        if (!href) return;

        if (href.startsWith("/") && cfg.seedUrl.startsWith("https://")) {
            const domain = cfg.seedUrl.split("/").slice(0, 3).join("/");
            href = domain + href;
        }

        if (cfg.recipeLinkFilter ? cfg.recipeLinkFilter(href) : true) {
            links.push(href);
        }
    });

    return Array.from(new Set(links));
}
