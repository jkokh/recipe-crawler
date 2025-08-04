import { crawlerConfigs } from "./config.js";
import { extractLinks } from "./extractLinks.js";
import { fetchHtmlWithPuppeteer, launchBrowser } from "./fetchHtmlPuppeteer.js";
import { runCrawler } from "./crawlerEngine.js";

const config = crawlerConfigs[0];

(async () => {
    console.log(`Crawling: ${config.name}`);
    try {
        const { allLinks, visited, failed } = await runCrawler({
            seedUrl: config.seedUrl,
            extractLinks,
            fetchHtmlWithPuppeteer,
            launchBrowser,
            visitLimit: 5,
            delayMs: 3000,
            config
        });

        console.log(`\n🏁 ${allLinks.length} unique recipe links found:`);
        allLinks.forEach((link, i) =>
            console.log(`${visited.includes(link) ? "✅" : "—"}${failed.includes(link) ? "❌" : ""} ${i + 1}. ${link}`));
        console.log("\n✅ Visited links:", visited);
        if (failed.length) console.log("\n❌ Failed links:", failed);
    } catch (e: any) {
        console.error("Crawler error:", e.message);
    }
})();
