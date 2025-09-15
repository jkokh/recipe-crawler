import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readline from 'readline';
import fs from "fs/promises";

puppeteer.use(StealthPlugin());

export async function launchBrowser() {
    return puppeteer.launch({ headless: false });
}

function waitForUserInput(message: string) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise<void>((resolve) => rl.question(message, () => {
        rl.close();
        resolve();
    }));
}

// Returns: { html, status }
export async function fetchHtmlWithPuppeteer(url: string, browser: any): Promise<{ html: string, status: number }> {
    const page = await browser.newPage();
    const resp = await page.goto(url, { waitUntil: "networkidle2" });
    const status = resp?.status() ?? 0;
    if (status === 403) {
        console.log("\n🛑 403 Forbidden or bot block detected. Please solve the challenge and press Enter...");
        await waitForUserInput("Press Enter once you've solved it: ");
    }
    const html = await page.content();
    await page.close();
    return { html, status };
}

export async function downloadImageWithPuppeteer(imageUrl: string, filePath: string, referer: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set Referer
    await page.setExtraHTTPHeaders({ "referer": referer });

    const viewSource = await page.goto(imageUrl, { waitUntil: 'networkidle2' });
    const buffer = await (viewSource!).buffer();

    await fs.writeFile(filePath, buffer);

    await browser.close();
}