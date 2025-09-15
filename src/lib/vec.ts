export function cosine(a: Float32Array, b: Float32Array): number {
    let dot=0, na=0, nb=0;
    for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
    return dot / (Math.sqrt(na)*Math.sqrt(nb) + 1e-12);
}
export function toBytes(v: Float32Array){ return Buffer.from(v.buffer, v.byteOffset, v.byteLength); }
export function fromBytes(buf: Buffer, dim: number){
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return new Float32Array(ab, 0, dim);
}