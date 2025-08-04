export interface CrawlerConfig {
    name: string;
    seedUrl: string;
    recipeLinkSelector: string;
    recipeLinkFilter?: (href: string) => boolean;
}
