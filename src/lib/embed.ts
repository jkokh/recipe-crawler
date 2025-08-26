// src/lib/embed.ts
import { pipeline, env } from "@xenova/transformers";
env.cacheDir = "./.models";

let pipe: any;

function l2(v: Float32Array) {
    let s = 0; for (let i=0;i<v.length;i++) s += v[i]*v[i];
    const inv = 1 / Math.max(Math.sqrt(s), 1e-12);
    const out = new Float32Array(v.length);
    for (let i=0;i<v.length;i++) out[i] = v[i] * inv;
    return out;
}

export async function embed(texts: string[], prefix: "passage"|"query"="passage") {
    if (!pipe) pipe = await pipeline("feature-extraction", "Xenova/bge-m3");

    const inputs = texts.map(t => `${prefix}: ${t}`);
    const reps = await pipe(inputs, { pooling: "mean", normalize: false });

    const out: Float32Array[] = [];

    // Case 1: Xenova returns an array of outputs (one per input)
    if (Array.isArray(reps)) {
        for (const r of reps) {
            const data = r.data as Float32Array | number[];
            const vec = ArrayBuffer.isView(data) ? (data as Float32Array)
                : Float32Array.from(data as number[]);
            out.push(l2(vec));
        }
        return out;
    }

    // Case 2: Xenova returns a single tensor for the whole batch
    const data = (reps as any).data as Float32Array | number[];
    const dims = (reps as any).dims as number[] | undefined;

    const flat = ArrayBuffer.isView(data) ? (data as Float32Array)
        : Float32Array.from(data as number[]);

    // If dims look like [batch, dim], slice rows; otherwise treat as 1D
    if (Array.isArray(dims) && dims.length === 2) {
        const [batch, dim] = dims;
        for (let i = 0; i < batch; i++) {
            const start = i * dim;
            const row = flat.subarray(start, start + dim); // view, no copy
            out.push(l2(row));
        }
    } else {
        out.push(l2(flat));
    }

    return out;
}
