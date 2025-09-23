import { ImagesParsed } from "../../types";
import {Source} from "@prisma/client";
import crypto from "node:crypto";
import {getImageIds} from "./parserUtils";


const sha1 = (s: string) => crypto.createHash("sha1").update(s).digest("hex");
const EXT_RX = /\.(jpe?g|png|gif|webp|avif|bmp|tiff?)$/i;

export function stableIdFromUrl(raw: string): string {
    const u = new URL(raw);
    u.hash = "";
    u.search = "";
    let path = u.pathname.toLowerCase();
    if (path.includes("/thmb/")) {
        const parts = path.split("/").filter(Boolean);
        const idx = parts.findIndex(seg => EXT_RX.test(seg));
        if (idx !== -1) path = "/" + parts.slice(idx).join("/");
    }
    path = path.replace(/[-_]+/g, "-");
    return sha1(u.hostname.toLowerCase() + path);
}


export function parseImages($article: cheerio.Cheerio, source: Source): ImagesParsed[] | null {
    const images: ImagesParsed[] = [];

    $article.find("img").each((_, img) => {

        const url = (img as any).attribs["data-src"] ||
            (img as any).attribs["src"] ||
            (img as any).attribs["data-hi-res-src"];

        const alt = (img as any).attribs["alt"] || "";

        if (url) {
            let lead = false;
            if (url.toLowerCase().includes("lead")) {
                lead = true;
            }

            if (/^https:\/\/www\.simplyrecipes\.com\/thmb\/.+\/1500x0\/filters:/.test(url)) {
                const stableId = stableIdFromUrl(url);
                images.push({ stableId, url, alt, lead });
            }
        }
    });

    if (images.length === 0) {
        return null;
    }

    return images;
}