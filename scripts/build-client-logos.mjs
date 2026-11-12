// Builds the monochrome client logos in public/clients/mono from the
// originals in public/clients. The site paints them with a CSS mask in
// currentColor, so each output is a trimmed alpha mask (black + alpha).
//
//   node scripts/build-client-logos.mjs
//
// Two kinds of source art:
//   "alpha": artwork on a transparent background; ink is wherever alpha is.
//   "luma":  light artwork with white knockouts (IKEA, Liverpool); ink is
//            wherever the pixel is darker than paper, white becomes clear.
// No dependencies: PNG decode/encode with node:zlib.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { crc32, deflateSync, inflateSync } from "node:zlib";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "public/clients");
const OUT = join(SRC, "mono");
const TARGET_HEIGHT = 96;

/** @type {{ slug: string; file: string; mode: "alpha" | "luma" }[]} */
const LOGOS = [
  { slug: "ikea", file: "ikea.png", mode: "luma" },
  { slug: "nasdaq", file: "nasdaq.png", mode: "alpha" },
  { slug: "thomson-reuters", file: "thomson-reuters.png", mode: "alpha" },
  { slug: "liverpool", file: "liverpool.png", mode: "luma" },
  { slug: "stabenfeldt", file: "stabenfeldt.png", mode: "alpha" },
];

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const depth = data[8];
      colorType = data[9];
      const interlace = data[12];
      if (depth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
        throw new Error(`unsupported PNG (depth ${depth}, type ${colorType}, interlace ${interlace})`);
      }
    } else if (type === "IDAT") {
      idat.push(data);
    }
    pos += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const rgba = new Uint8ClampedArray(width * height * 4);
  let prev = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = Uint8Array.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? line[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      if (filter === 1) line[x] = (line[x] + a) & 255;
      else if (filter === 2) line[x] = (line[x] + b) & 255;
      else if (filter === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      rgba[o] = line[x * bpp];
      rgba[o + 1] = line[x * bpp + 1];
      rgba[o + 2] = line[x * bpp + 2];
      rgba[o + 3] = bpp === 4 ? line[x * bpp + 3] : 255;
    }
    prev = line;
  }
  return { width, height, rgba };
}

function encodeGrayAlpha(width, height, alpha) {
  const raw = Buffer.alloc(height * (width * 2 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 2 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const o = y * (width * 2 + 1) + 1 + x * 2;
      raw[o] = 0;
      raw[o + 1] = alpha[y * width + x];
    }
  }
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])) >>> 0, 0);
    return Buffer.concat([head, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 4;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Ink coverage 0..1 per pixel. */
function coverage({ width, height, rgba }, mode) {
  const out = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const a = rgba[i * 4 + 3] / 255;
    if (mode === "alpha") {
      out[i] = a;
      continue;
    }
    const l = (0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2]) / 255;
    // Paper (>= 0.97) is clear, the logo's grey (<= 0.84) is full ink.
    out[i] = a * Math.min(1, Math.max(0, (0.97 - l) / (0.97 - 0.84)));
  }
  return out;
}

function trim(width, height, cov) {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cov[y * width + x] > 0.03) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/** Area-average downscale of the trimmed box. */
function resample(width, cov, box, outW, outH) {
  const out = new Uint8Array(outW * outH);
  const sx = box.w / outW;
  const sy = box.h / outH;
  for (let oy = 0; oy < outH; oy++) {
    const fy0 = box.y0 + oy * sy;
    const fy1 = fy0 + sy;
    for (let ox = 0; ox < outW; ox++) {
      const fx0 = box.x0 + ox * sx;
      const fx1 = fx0 + sx;
      let sum = 0;
      let area = 0;
      for (let y = Math.floor(fy0); y < Math.ceil(fy1); y++) {
        const wy = Math.min(fy1, y + 1) - Math.max(fy0, y);
        for (let x = Math.floor(fx0); x < Math.ceil(fx1); x++) {
          const wx = Math.min(fx1, x + 1) - Math.max(fx0, x);
          sum += cov[y * width + x] * wx * wy;
          area += wx * wy;
        }
      }
      out[oy * outW + ox] = Math.round((sum / area) * 255);
    }
  }
  return out;
}

mkdirSync(OUT, { recursive: true });
for (const logo of LOGOS) {
  const png = decodePng(readFileSync(join(SRC, logo.file)));
  const cov = coverage(png, logo.mode);
  const box = trim(png.width, png.height, cov);
  const outH = Math.min(TARGET_HEIGHT, box.h);
  const outW = Math.round((box.w * outH) / box.h);
  const alpha = resample(png.width, cov, box, outW, outH);
  writeFileSync(join(OUT, `${logo.slug}.png`), encodeGrayAlpha(outW, outH, alpha));
  console.log(`${logo.slug}: ${outW}x${outH} (aspect ${(box.w / box.h).toFixed(3)})`);
}
