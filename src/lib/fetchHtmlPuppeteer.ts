import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readline from 'readline';
import fs from "fs/promises";

puppeteer.use(StealthPlugin());

export async function launchBrowser() {
    return puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
            '--window-size=800,600',
            '--window-position=-100,-100',
            '--no-first-run',
            '--disable-default-browser-check',
            '--disable-popup-blocking'
        ]
    });
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
    let resp = await page.goto(url, { waitUntil: "networkidle2" });
    let status = resp?.status() ?? 0;

    if (status === 403) {
        console.log("\n🛑 403 Forbidden or bot block detected. Please solve the challenge and press Enter...");
        await waitForUserInput("Press Enter once you've solved it: ");

        // Reload the page after user solves captcha
        resp = await page.reload({ waitUntil: "networkidle2" });
        status = resp?.status() ?? 0;
    }

    const html = await page.content();
    await page.close();
    return { html, status };
}

export async function downloadImageWithPuppeteer(imageUrl: string, filePath: string, referer: string) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
            '--window-size=1200,1200',
            '--window-position=0,0',
            '--no-first-run',
            '--disable-default-browser-check',
            '--disable-popup-blocking'
        ]
    });

    const page = await browser.newPage();

    try {
        // Set Referer
        await page.setExtraHTTPHeaders({ "referer": referer });

        let viewSource = await page.goto(imageUrl, { waitUntil: 'networkidle2' });
        let status = viewSource?.status() ?? 0;

        // Handle captcha/403 for image downloads too
        if (status === 403) {
            console.log(`\n🛑 403 Forbidden detected for image: ${imageUrl}`);
            console.log("Please solve the challenge in the browser and press Enter...");
            await waitForUserInput("Press Enter once you've solved it: ");

            // Reload the page after user solves captcha
            viewSource = await page.reload({ waitUntil: 'networkidle2' });
            status = viewSource?.status() ?? 0;
        }

        // Check if we still have issues after captcha resolution
        if (status !== 200) {
            throw new Error(`Failed to download image. Status: ${status}`);
        }

        const buffer = await viewSource!.buffer();

        // Add this check to throw error if buffer is empty
        if (!buffer || buffer.length === 0) {
            throw new Error('Downloaded file is empty');
        }

        await fs.writeFile(filePath, buffer);

    } finally {
        await browser.close();
    }
}