import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputPath = process.argv[2] ?? "public/rr-logo.png";
const tmpPath = `${inputPath}.tmp`;

function dist(rgb, bg) {
  const dr = rgb[0] - bg[0];
  const dg = rgb[1] - bg[1];
  const db = rgb[2] - bg[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function estimateBackgroundRGB(data, width, height, channels) {
  const sample = [];
  const pad = Math.min(50, width, height);
  const push = (x, y) => {
    const idx = (y * width + x) * channels;
    sample.push([data[idx], data[idx + 1], data[idx + 2]]);
  };

  for (let y = 0; y < pad; y++) for (let x = 0; x < pad; x++) push(x, y);
  for (let y = 0; y < pad; y++) for (let x = width - pad; x < width; x++) push(x, y);
  for (let y = height - pad; y < height; y++) for (let x = 0; x < pad; x++) push(x, y);
  for (let y = height - pad; y < height; y++) for (let x = width - pad; x < width; x++) push(x, y);

  const rs = sample.map((p) => p[0]);
  const gs = sample.map((p) => p[1]);
  const bs = sample.map((p) => p[2]);
  return [median(rs), median(gs), median(bs)];
}

async function main() {
  const image = sharp(inputPath, { failOn: "none" }).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  if (info.channels !== 4) {
    throw new Error(`Unexpected channel count: ${info.channels}`);
  }

  const bg = estimateBackgroundRGB(data, info.width, info.height, info.channels);

  const threshold = 85; // tuned for near-black backgrounds without eating into the white logo
  let changed = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const d = dist([data[i], data[i + 1], data[i + 2]], bg);
    if (d <= threshold) {
      const newA = Math.max(0, Math.min(255, Math.round(a * (d / threshold))));
      if (newA !== a) {
        data[i + 3] = newA;
        if (newA === 0) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
        changed++;
      }
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmpPath);

  await fs.rename(tmpPath, inputPath);
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      { inputPath, size: { width: info.width, height: info.height }, bg, threshold, changedPixels: changed },
      null,
      2,
    ),
  );
}

main().catch(async (err) => {
  try {
    await fs.rm(tmpPath, { force: true });
  } catch {
    // ignore
  }
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

