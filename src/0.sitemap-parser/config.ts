export interface SitemapConfig {
    title: string;          // Human-readable domain or project name
    files: string[];        // Paths to local sitemap files for that domain
}

export const sitemapsConfig: SitemapConfig[] = [
    {
        title: "simplyrecipes",
        files: [
            "./sitemaps/simplyrecipes/sitemap_1.xml"
        ]
    }
];
