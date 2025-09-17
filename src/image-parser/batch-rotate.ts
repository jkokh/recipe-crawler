import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import fg from "fast-glob";
import pLimit from "p-limit";
import sharp from "sharp";

type GradeOptions = {
    rotateMinDeg?: number; // default 3
    rotateMaxDeg?: number; // default 5
    saturation?: number;   // default 1.06
    brightness?: number;   // default 1.02
    hue?: number;          // default +6°
    linearA?: number;      // default 1.05 (contrast scale)
    linearB?: number;      // default -6  (contrast offset)
    gamma?: number;        // default 1.02 (must be 1.0..3.0)
    sharpenSigma?: number; // default 0.6
    srcDir?: string;       // default "test-images"
    outDir?: string;       // default "test-output"
    concurrency?: number;  // default CPU-1 (clamped 2..8)
    seed?: number;         // optional deterministic randomness
};

function createRng(seed = Math.floor(Math.random() * 2 ** 31)) {
    // xorshift32
    let x = seed || 1;
    return {
        next: () => {
            x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
            return ((x >>> 0) / 0x100000000); // [0,1)
        }
    };
}

function randomAngle(
    rng: ReturnType<typeof createRng>,
    minDeg: number,
    maxDeg: number
) {
    const mag = minDeg + (maxDeg - minDeg) * rng.next();
    return (rng.next() < 0.5 ? -1 : 1) * mag;
}

// Calculate the scale factor based on rotation angle
function calculateScaleFactor(angleDeg: number, width: number, height: number) {
    const rad = Math.abs(angleDeg) * Math.PI / 180;
    const cosA = Math.abs(Math.cos(rad));
    const sinA = Math.abs(Math.sin(rad));
    const newWidth = Math.abs(height * sinA) + Math.abs(width * cosA);
    const newHeight = Math.abs(height * cosA) + Math.abs(width * sinA);
    return Math.max(newWidth / width, newHeight / height);
}

async function processOne(
    inputPath: string,
    outputPath: string,
    rng: ReturnType<typeof createRng>,
    opts: Required<GradeOptions>
) {
    const meta = await sharp(inputPath).metadata();
    if (!meta.width || !meta.height) {
        throw new Error(`No dimensions: ${inputPath}`);
    }
    const W = meta.width;
    const H = meta.height;

    // Random tiny rotation
    const angle = randomAngle(rng, opts.rotateMinDeg, opts.rotateMaxDeg);
    const scaleFactor = calculateScaleFactor(angle, W, H);

    let pipe = sharp(inputPath)
        // Step 1: Rotate with transparent background
        .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        // Step 2: Scale up to cover the original dimensions
        .resize(Math.round(W * scaleFactor), Math.round(H * scaleFactor), {
            fit: 'cover',
            position: 'center',
            kernel: sharp.kernel.lanczos3
        })
        // Step 3: Crop back to original dimensions
        .extract({ left: 0, top: 0, width: W, height: H });

    // Encode based on output extension
    const ext = path.extname(outputPath).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg") {
        pipe = pipe.jpeg({ quality: 84, mozjpeg: true });
    } else if (ext === ".png") {
        pipe = pipe.png({ compressionLevel: 9 });
    } else if (ext === ".webp") {
        pipe = pipe.webp({ quality: 82 });
    } else if (ext === ".avif") {
        pipe = pipe.avif({ quality: 45 });
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await pipe.toFile(outputPath);
}

export async function batchProcess(options: GradeOptions = {}) {
    const CPU = Math.max(1, os.cpus()?.length ?? 1);
    const defaultConcurrency = Math.max(2, Math.min(8, CPU - 1));

    const opts: Required<GradeOptions> = {
        rotateMinDeg: options.rotateMinDeg ?? 3,
        rotateMaxDeg: options.rotateMaxDeg ?? 5,
        saturation: options.saturation ?? 1.06,
        brightness: options.brightness ?? 1.02,
        hue: options.hue ?? 6,
        linearA: options.linearA ?? 1.05,
        linearB: options.linearB ?? -6,
        gamma: options.gamma ?? 1.02,
        sharpenSigma: options.sharpenSigma ?? 0.6,
        srcDir: options.srcDir ?? "test-images",
        outDir: options.outDir ?? "test-output",
        concurrency: options.concurrency ?? defaultConcurrency,
        seed: options.seed ?? Math.floor(Math.random() * 2 ** 31),
    };

    const rng = createRng(opts.seed);
    const files = await fg(["**/*.{jpg,jpeg,png,webp,avif}"], {
        cwd: opts.srcDir,
        dot: false,
    });

    const limit = pLimit(opts.concurrency);

    await Promise.all(
        files.map((rel) =>
            limit(async () => {
                const inPath = path.join(opts.srcDir, rel);
                const outPath = path.join(opts.outDir, rel);
                await processOne(inPath, outPath, rng, opts);
            })
        )
    );
}