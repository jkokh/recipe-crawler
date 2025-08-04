export async function runCrawler({
                                     seedUrl,
                                     extractLinks,
                                     fetchHtmlWithPuppeteer,
                                     launchBrowser,
                                     visitLimit = 5,
                                     delayMs = 3000,
                                     config,
                                 }: {
    seedUrl: string,
    extractLinks: (html: string, config: any) => string[],
    fetchHtmlWithPuppeteer: (url: string, browser: any) => Promise<{ html: string, status: number }>,
    launchBrowser: () => Promise<any>,
    visitLimit?: number,
    delayMs?: number,
    config: any
}) {
    let browser = null;
    const allLinks = new Set<string>(), toVisit: string[] = [], visited: string[] = [], failed: string[] = [];
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
        browser = await launchBrowser();
        const { html } = await fetchHtmlWithPuppeteer(seedUrl, browser);
        extractLinks(html, config).forEach(link => { allLinks.add(link); toVisit.push(link); });

        while (toVisit.length && visited.length < visitLimit) {
            const link = toVisit.shift();
            if (!link || visited.includes(link)) continue;
            try {
                const { html: pageHtml, status } = await fetchHtmlWithPuppeteer(link, browser);
                console.log(`✅ Visited: ${link} (${status})`);
                visited.push(link);
                extractLinks(pageHtml, config).forEach(newLink => {
                    if (!allLinks.has(newLink)) { allLinks.add(newLink); toVisit.push(newLink); }
                });
            } catch (e: any) {
                console.error(`❌ ${link}:`, e.message);
                failed.push(link);
            }
            await sleep(delayMs);
        }

        return { allLinks: [...allLinks], visited, failed };

    } finally {
        if (browser) await browser.close();
    }
}
