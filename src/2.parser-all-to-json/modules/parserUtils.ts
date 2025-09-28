import crypto from 'crypto';
import {Source} from "@prisma/client";
import {stableIdFromUrl} from "./getImages";

export function getSimplyDataSrc(el: cheerio.Cheerio): string[] {
    const urls: string[] = [];

    el.find("img").each((_, img) => {
        // Try multiple sources in order of preference
        const url = (img as any).attribs["data-src"] ||
            (img as any).attribs["src"] ||
            (img as any).attribs["data-hi-res-src"];

        if (url && /^https:\/\/www\.simplyrecipes\.com\/thmb\/.+\/1500x0\/filters:/.test(url)) {
            urls.push(url);
        }
    });

    return urls;
}

export function getImageIds(element: cheerio.Cheerio, source: Source): number[] {
    const imageUrls = getSimplyDataSrc(element)
    const src = (source as any).sourceImages ?? [];
    if (!imageUrls?.length || !src.length) return [];

    const stableIdToId = new Map(
        src.filter((img: any) => img?.stableId && typeof img.id === 'number')
            .map((img: any) => [img.stableId, img.id] as [string, number])
    );

    return [...new Set(
        imageUrls.map(url => stableIdToId.get(stableIdFromUrl(url)))
            .filter((id): id is number => id != null)
    )];
}

export function hasLinks(el: cheerio.Cheerio): boolean {
    return el.find("a[href]").length > 0;
}

export function cryptoHash(str: string, algorithm: 'md5' | 'sha1' | 'sha256' = 'sha256'): string {
    return crypto.createHash(algorithm).update(str).digest('hex');
}