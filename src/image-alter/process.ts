import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const INPUT_DIR = "../3.image-download/images";
const OUTPUT_DIR = "./image-out";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"];

interface ProcessingConfig {
    rotation: {
        enabled: boolean;
        minAngle: number;
        maxAngle: number;
    };
    vignette: {
        enabled: boolean;
        inner: number;
        outer: number;
        feather: number;
        color: string;
        amount: number;
    };
    temperature: {
        enabled: boolean;
        /** -100..100 (negative=cool, positive=warm, 0=neutral) */
        value: number;
    };
    skipExisting: boolean;
    parallelWorkers: number; // Number of parallel workers (0 = auto-detect)
}

const CONFIG: ProcessingConfig = {
    rotation: {
        enabled: true,
        minAngle: 3,
        maxAngle: 6,
    },
    vignette: {
        enabled: true,
        inner: 99,
        outer: 128,
        feather: 6,
        amount: 30,
        color: "black",
    },
    temperature: {
        enabled: true,
        value: 6, // try 60 to see a clear effect; then tune (15–35)
    },
    skipExisting: true,
    parallelWorkers: 0, // 0 = auto (uses CPU count - 1), or set specific number
};

// ============================================================================
// File System Utilities
// ============================================================================

const listImages = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
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

const getTempPath = (outPath: string): string => {
    const dir = path.dirname(outPath);
    const base = path.basename(outPath, path.extname(outPath));
    // Add timestamp and random string to make it unique across parallel workers
    const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return path.join(dir, `${base}.${unique}.tmp.png`);
};

// ============================================================================
// Image Dimension Utilities
// ============================================================================

const getImageDimensions = (file: string): { w: number; h: number } => {
    try {
        const [w, h] = execSync(`magick identify -format "%w %h" "${file}"`, {
            encoding: "utf-8",
        })
            .trim()
            .split(" ")
            .map(Number);
        return { w: w || 1, h: h || 1 };
    } catch {
        return { w: 1, h: 1 };
    }
};

// Execute ImageMagick command asynchronously (non-blocking for parallel processing)
const execMagickAsync = (cmd: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = spawn("sh", ["-c", cmd], {
            stdio: ["ignore", "pipe", "pipe"],
        });

        let stderr = "";
        if (child.stderr) {
            child.stderr.on("data", (data) => {
                stderr += data.toString();
            });
        }

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(stderr || `Command failed with code ${code}`));
            }
        });

        child.on("error", reject);
    });
};

// ============================================================================
// Rotation Logic
// ============================================================================

const generateRotationAngle = (config: ProcessingConfig["rotation"]): number => {
    const mag = config.minAngle + Math.random() * (config.maxAngle - config.minAngle);
    const sign = Math.random() < 0.5 ? -1 : 1;
    return +(sign * mag).toFixed(2);
};

const calculateCropPercentages = (
    angle: number,
    aspect = 1
): { w: number; h: number } => {
    const theta = (Math.abs(angle) * Math.PI) / 180;
    const s = Math.sin(theta);
    const c = Math.cos(theta);

    const w = aspect;
    const h = 1;

    const rotatedW = w * c + h * s;
    const rotatedH = h * c + w * s;

    const inscribedW = w * c - h * s;
    const inscribedH = h * c - w * s;

    if (inscribedW <= 0 || inscribedH <= 0) return { w: 1, h: 1 };

    const cropW = Math.floor((inscribedW / rotatedW) * 100) - 1;
    const cropH = Math.floor((inscribedH / rotatedH) * 100) - 1;

    return {
        w: Math.max(1, Math.min(100, cropW)),
        h: Math.max(1, Math.min(100, cropH)),
    };
};

// ============================================================================
// Temperature Adjustment Logic
// ============================================================================

const buildTemperatureCommand = (config: ProcessingConfig["temperature"]): string => {
    if (!config.enabled || config.value === 0) return "";

    const t = Math.max(-100, Math.min(100, config.value));
    const k = t / 100; // -1..1
    const r = 1 + 0.35 * k; // ±35% red
    const g = 1 + 0.1 * k; // ±10% green
    const b = 1 - 0.35 * k; // ∓35% blue
    const rc = Math.max(0.3, Math.min(1.7, r)).toFixed(3);
    const gc = Math.max(0.3, Math.min(1.7, g)).toFixed(3);
    const bc = Math.max(0.3, Math.min(1.7, b)).toFixed(3);

    const warmTint = "#FFD2AE"; // peach/amber
    const coolTint = "#AED7FF"; // light blue
    const tintAmt = Math.round(Math.abs(k) * 25); // up to 25% blend

    const tint =
        t > 0
            ? `-fill "${warmTint}" -colorize ${tintAmt}%`
            : `-fill "${coolTint}" -colorize ${tintAmt}%`;

    return (
        `-colorspace sRGB ` +
        `-channel R -evaluate multiply ${rc} ` +
        `-channel G -evaluate multiply ${gc} ` +
        `-channel B -evaluate multiply ${bc} ` +
        `+channel -clamp ` +
        `${tint} `
    );
};

// ============================================================================
// Vignette Effect Logic
// ============================================================================

const buildVignetteCommand = (
    config: ProcessingConfig["vignette"],
    imgWidth: number,
    imgHeight: number
): string => {
    if (!config.enabled) return "";

    const wwo = Math.round((config.outer * imgWidth) / 100);
    const hho = Math.round((config.outer * imgHeight) / 100);
    const mwh = Math.round((config.outer * Math.min(imgWidth, imgHeight)) / 100);

    let mlevel = "";
    if (config.inner !== 0) {
        const innerAdj = 100 - config.inner;
        mlevel = `-level 0x${innerAdj}%`;
    }

    let plevel = "";
    if (config.amount !== 100) {
        const amountAdj = 100 - config.amount;
        plevel = `+level ${amountAdj}x100%`;
    }

    const featherPixels = Math.round(
        (config.feather / 100) * Math.min(imgWidth, imgHeight)
    );
    const feathering = featherPixels > 0 ? `-blur ${featherPixels}x65000` : "";

    return (
        `-background "${config.color}" ` +
        `\\( -size ${mwh}x${mwh} radial-gradient: -resize ${wwo}x${hho}! ` +
        `-gravity center -crop ${imgWidth}x${imgHeight}+0+0 +repage ${mlevel} ${plevel} ${feathering} \\) ` +
        `-alpha off -compose copy_opacity -composite ` +
        `+channel -compose over -flatten`
    );
};

// ============================================================================
// Image Processing Pipeline
// ============================================================================

const applyRotation = async (
    inputPath: string,
    tempPath: string,
    angle: number
): Promise<{ success: boolean; dimensions?: { w: number; h: number } }> => {
    try {
        const { w, h } = getImageDimensions(inputPath);
        const crop = calculateCropPercentages(angle, w / h);

        const cmd =
            `magick "${inputPath}" ` +
            `-auto-orient ` +
            `-background none -rotate ${angle} +repage ` +
            `-gravity center -crop ${crop.w}%x${crop.h}%+0+0 +repage ` +
            `-background white -alpha remove -alpha off ` +
            `"${tempPath}"`;

        await execMagickAsync(cmd);

        const rotatedDims = getImageDimensions(tempPath);

        return { success: true, dimensions: rotatedDims };
    } catch (e: any) {
        return { success: false };
    }
};

const applyEffects = async (
    tempPath: string,
    outputPath: string,
    config: ProcessingConfig,
    dimensions: { w: number; h: number }
): Promise<boolean> => {
    // Create unique temp output to avoid collisions
    const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const tempOutputPath = `${outputPath}.${unique}.tmp`;

    try {
        const tempCmd = buildTemperatureCommand(config.temperature);
        const vignetteCmd = buildVignetteCommand(
            config.vignette,
            dimensions.w,
            dimensions.h
        );

        const cmd =
            `magick "${tempPath}" ` +
            `${tempCmd}` +
            `${vignetteCmd} ` +
            `"${tempOutputPath}"`;

        await execMagickAsync(cmd);

        // Atomic rename - only replace the final file if processing succeeded
        fs.renameSync(tempOutputPath, outputPath);

        return true;
    } catch (e: any) {
        // Clean up temporary output file if it exists
        try {
            if (fs.existsSync(tempOutputPath)) {
                fs.unlinkSync(tempOutputPath);
            }
        } catch {}
        return false;
    }
};

const processImage = async (
    inputPath: string,
    outputPath: string,
    config: ProcessingConfig
): Promise<boolean> => {
    const tempPath = getTempPath(outputPath);

    try {
        ensureDir(path.dirname(outputPath));

        // Apply rotation if enabled
        let dimensions: { w: number; h: number };
        if (config.rotation.enabled) {
            const angle = generateRotationAngle(config.rotation);
            const result = await applyRotation(inputPath, tempPath, angle);
            if (!result.success || !result.dimensions) {
                throw new Error("Rotation failed");
            }
            dimensions = result.dimensions;
        } else {
            // No rotation, just copy to temp
            fs.copyFileSync(inputPath, tempPath);
            dimensions = getImageDimensions(tempPath);
        }

        // Apply temperature and vignette effects
        const success = await applyEffects(tempPath, outputPath, config, dimensions);

        // Cleanup temp file
        try {
            fs.unlinkSync(tempPath);
        } catch {}

        return success;
    } catch (e: any) {
        try {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch {}
        return false;
    }
};

// ============================================================================
// Parallel Processing Utilities
// ============================================================================

interface ProcessingResult {
    success: boolean;
    skipped: boolean;
}

async function processImageAsync(
    inputPath: string,
    outputPath: string,
    config: ProcessingConfig
): Promise<ProcessingResult> {
    // Check and skip before processing
    if (config.skipExisting && fs.existsSync(outputPath)) {
        return { success: true, skipped: true };
    }

    const success = await processImage(inputPath, outputPath, config);
    return { success, skipped: false };
}

async function processBatch(
    files: Array<{ inPath: string; outPath: string }>,
    config: ProcessingConfig,
    onProgress: (result: ProcessingResult) => void
): Promise<void> {
    const limit = config.parallelWorkers || Math.max(1, os.cpus().length - 1);

    let index = 0;

    const processNext = async (): Promise<void> => {
        while (index < files.length) {
            const currentIndex = index++;
            const { inPath, outPath } = files[currentIndex];

            const result = await processImageAsync(inPath, outPath, config);
            onProgress(result);
        }
    };

    // Start worker pool
    const workers = Array(Math.min(limit, files.length))
        .fill(null)
        .map(() => processNext());

    await Promise.all(workers);
}

// ============================================================================
// Progress Reporting
// ============================================================================

const REPORT_INTERVAL = 100;

const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
};

const printProgress = (
    current: number,
    total: number,
    succeeded: number,
    skipped: number,
    startTime: number
) => {
    const percent = ((current / total) * 100).toFixed(1);
    const failed = current - succeeded;
    const elapsed = (Date.now() - startTime) / 1000;
    const avgTimePerImage = elapsed / current;
    const remaining = (total - current) * avgTimePerImage;

    const skipInfo = skipped > 0 ? ` | ⊘ ${skipped} skipped` : "";

    process.stdout.write(
        `\rProgress: ${current}/${total} (${percent}%) | ` +
        `✓ ${succeeded} | ✗ ${failed}${skipInfo} | ` +
        `ETA: ${formatTime(remaining)}`
    );
};

const printIntermediateReport = (
    current: number,
    total: number,
    succeeded: number,
    skipped: number,
    startTime: number
) => {
    const failed = current - succeeded;
    const elapsed = (Date.now() - startTime) / 1000;
    const avgTimePerImage = elapsed / current;
    const remaining = (total - current) * avgTimePerImage;

    const skipInfo = skipped > 0 ? `\n   Skipped: ${skipped}` : "";

    console.log(
        `\n── Checkpoint at ${current}/${total} images ──` +
        `\n   Succeeded: ${succeeded} | Failed: ${failed}${skipInfo}` +
        `\n   Elapsed: ${formatTime(elapsed)} | ETA: ${formatTime(remaining)}\n`
    );
};

// ============================================================================
// System Checks
// ============================================================================

const checkImageMagick = (): boolean => {
    try {
        execSync("magick -version", { stdio: "pipe" });
        return true;
    } catch {
        console.error(
            "Error: ImageMagick not found. Install from https://imagemagick.org"
        );
        return false;
    }
};

// ============================================================================
// Main Entry Point
// ============================================================================

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

    const workers = CONFIG.parallelWorkers || Math.max(1, os.cpus().length - 1);

    console.log(`Processing ${files.length} image${files.length === 1 ? "" : "s"}…\n`);
    console.log("Configuration:");
    console.log(`  Parallel workers: ${workers}`);
    console.log(`  Skip existing: ${CONFIG.skipExisting ? "enabled" : "disabled"}`);
    console.log(`  Rotation: ${CONFIG.rotation.enabled ? "enabled" : "disabled"}`);
    if (CONFIG.rotation.enabled) {
        console.log(
            `    Angle range: ${CONFIG.rotation.minAngle}° to ${CONFIG.rotation.maxAngle}°`
        );
    }
    console.log(`  Vignette: ${CONFIG.vignette.enabled ? "enabled" : "disabled"}`);
    if (CONFIG.vignette.enabled) {
        console.log(`    Inner: ${CONFIG.vignette.inner}%, Outer: ${CONFIG.vignette.outer}%`);
        console.log(
            `    Feather: ${CONFIG.vignette.feather}%, Amount: ${CONFIG.vignette.amount}%`
        );
        console.log(`    Color: ${CONFIG.vignette.color}`);
    }
    console.log(`  Temperature: ${CONFIG.temperature.enabled ? "enabled" : "disabled"}`);
    if (CONFIG.temperature.enabled) {
        console.log(`    Value: ${CONFIG.temperature.value}\n`);
    }

    let succeeded = 0;
    let skipped = 0;
    let processed = 0;
    const startTime = Date.now();

    const filePairs = files.map((inPath) => ({
        inPath,
        outPath: path.join(OUTPUT_DIR, path.relative(INPUT_DIR, inPath)),
    }));

    processBatch(filePairs, CONFIG, (result) => {
        processed++;
        if (result.success) {
            succeeded++;
            if (result.skipped) {
                skipped++;
            }
        }

        printProgress(processed, files.length, succeeded, skipped, startTime);

        if (processed % REPORT_INTERVAL === 0 && processed < files.length) {
            printIntermediateReport(processed, files.length, succeeded, skipped, startTime);
        }
    }).then(() => {
        const failed = files.length - succeeded;
        const totalTime = (Date.now() - startTime) / 1000;

        const skipInfo = skipped > 0 ? `\n  ⊘ Skipped: ${skipped}` : "";

        console.log(
            `\n\n${"=".repeat(50)}` +
            `\nFinal Summary:` +
            `\n  Total: ${files.length} images` +
            `\n  ✓ Succeeded: ${succeeded}` +
            `\n  ✗ Failed: ${failed}${skipInfo}` +
            `\n  Success rate: ${((succeeded / files.length) * 100).toFixed(1)}%` +
            `\n  Total time: ${formatTime(totalTime)}` +
            `\n  Avg time/image: ${(totalTime / files.length).toFixed(2)}s` +
            `\n${"=".repeat(50)}`
        );
    });
}

main()