import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./image-out";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"];

const listImages = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
        const p = path.join(dir, e.name);
        return e.isDirectory()
            ? listImages(p)
            : e.isFile() && IMAGE_EXT.includes(path.extname(e.name).toLowerCase())
                ? [p]
                : [];
    });

const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getDims = (file: string) => {
    try {
        const [w, h] = execSync(`magick identify -format "%w %h" "${file}"`, { encoding: "utf-8" })
            .trim().split(" ").map(Number);
        return { w: w || 1, h: h || 1 };
    } catch {
        return { w: 1, h: 1 };
    }
};

const randomAngle = () => {
    const mag = 3 + Math.random() * 3;
    const sign = Math.random() < 0.5 ? -1 : 1;
    return +(sign * mag).toFixed(2);
};

function cropPercent(angle: number, aspect = 1): { w: number, h: number } {
    const theta = Math.abs(angle) * Math.PI / 180;
    const s = Math.sin(theta);
    const c = Math.cos(theta);

    const w = aspect;
    const h = 1;

    const rotatedW = w * c + h * s;
    const rotatedH = h * c + w * s;

    const inscribedW = w * c - h * s;
    const inscribedH = h * c - w * s;

    if (inscribedW <= 0 || inscribedH <= 0) return { w: 1, h: 1 };

    // Add 1% safety margin to avoid edge pixels
    const cropW = Math.floor((inscribedW / rotatedW) * 100) - 1;
    const cropH = Math.floor((inscribedH / rotatedH) * 100) - 1;

    return {
        w: Math.max(1, Math.min(100, cropW)),
        h: Math.max(1, Math.min(100, cropH))
    };
}

function rotateAndCrop(inputPath: string, outputPath: string, angle: number): boolean {
    try {
        ensureDir(path.dirname(outputPath));
        const { w, h } = getDims(inputPath);
        const crop = cropPercent(angle, w / h);
        const cmd =
            `magick "${inputPath}" ` +
            `-auto-orient ` +
            `-background none -rotate ${angle} +repage ` +
            `-gravity center -crop ${crop.w}%x${crop.h}%+0+0 +repage ` +
            `-background white -alpha remove -alpha off ` +
            `"${outputPath}"`;
        execSync(cmd, { stdio: "pipe" });
        console.log(`✓ ${path.basename(inputPath)} → ${angle}°, crop ${crop.w}%×${crop.h}%`);
        return true;
    } catch (e: any) {
        console.error(`✗ ${path.basename(inputPath)}: ${e.message}`);
        return false;
    }
}

function checkImageMagick(): boolean {
    try {
        execSync("magick -version", { stdio: "pipe" });
        return true;
    } catch {
        console.error("Error: ImageMagick not found. Install from https://imagemagick.org");
        return false;
    }
}

function main() {
    if (!checkImageMagick()) process.exit(1);

    if (!fs.existsSync(INPUT_DIR)) {
        console.error(`Input directory not found: ${INPUT_DIR}`);
        process.exit(1);
    }

    ensureDir(OUTPUT_DIR);

    const files = listImages(INPUT_DIR);
    if (!files.length) {
        console.log("No images found.");
        return;
    }

    console.log(`Processing ${files.length} image${files.length === 1 ? '' : 's'}…\n`);
    let ok = 0;
    for (const inPath of files) {
        const rel = path.relative(INPUT_DIR, inPath);
        const outPath = path.join(OUTPUT_DIR, rel);
        if (rotateAndCrop(inPath, outPath, randomAngle())) ok++;
    }
    console.log(`\nDone: ${ok}/${files.length} succeeded.`);
}

main();