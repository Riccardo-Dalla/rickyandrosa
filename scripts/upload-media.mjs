// 22Oct2026 - Used Composer via Cursor to purge CF cache-bust ?v= hero URLs with uploads
// 22Oct2026 - Used Composer via Cursor to upload brand gold PNGs (names + amp) to R2
// 22Oct2026 - Used Composer via Cursor to purge ?v= cache-bust URLs for hero gold PNGs too
// 22Oct2026 - Used Composer via Cursor to sync HERO_CACHE_BUST with page after Rosa PNG swap
// 22Oct2026 - Used Composer via Cursor to bump HERO_CACHE_BUST to v=20261022f with Rosa re-upload
import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, relative, basename } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, CF_API_TOKEN, CF_ZONE_ID } = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 env vars. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME in .env.local");
  process.exit(1);
}

const MEDIA_DOMAIN = "https://media.rickyandrosa.com";
/** Keep in sync with HERO_CACHE_BUST in src/app/page.tsx — CF caches ?v= separately from bare URL. */
const HERO_CACHE_BUST = "v=20261022f";
const HERO_GOLD_PNGS = new Set(["rosa-gold.png", "riccardo-gold.png", "rr-amp-gold.png"]);

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const PUBLIC_DIR = resolve("public");
const EXTENSIONS = new Set([".mp4", ".mp3", ".mov", ".webm", ".png"]);
/** Site chrome served by Next — keep off the media CDN. */
const PNG_SKIP = new Set([
  "apple-touch-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "icon-192x192.png",
  "icon-512x512.png",
  "icon.png",
  "media-artwork.png",
  "og-home.png",
]);

const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".png": "image/png",
};

function findMedia(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMedia(full));
    } else {
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      if (!EXTENSIONS.has(ext)) continue;
      if (ext === ".png" && PNG_SKIP.has(basename(full))) continue;
      results.push(full);
    }
  }
  return results;
}

async function listAllObjects() {
  const objects = new Map();
  let continuationToken;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of res.Contents ?? []) {
      objects.set(obj.Key, obj.Size);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects;
}

/** Bare URL plus homepage cache-bust variant for hero MP4s / gold PNGs. */
function expandPurgeUrls(bareUrl) {
  const urls = [bareUrl];
  try {
    const { pathname } = new URL(bareUrl);
    const base = pathname.split("/").pop() || "";
    if (
      (pathname.startsWith("/hero-videos/") && pathname.endsWith(".mp4")) ||
      HERO_GOLD_PNGS.has(base)
    ) {
      urls.push(`${bareUrl}?${HERO_CACHE_BUST}`);
    }
  } catch {
    /* ignore malformed */
  }
  return urls;
}

async function purgeCache(urls) {
  if (!CF_API_TOKEN || !CF_ZONE_ID || urls.length === 0) return;

  const files = [...new Set(urls.flatMap(expandPurgeUrls))];

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    }
  );
  const data = await res.json();
  if (data.success) {
    console.log(`⚡ Purged cache for ${files.length} URL(s)`);
  } else {
    console.warn("⚠ Cache purge failed:", data.errors);
  }
}

async function main() {
  const files = findMedia(PUBLIC_DIR);

  if (files.length === 0) {
    console.log("No media files found in public/");
    return;
  }

  const existing = await listAllObjects();
  const uploadedUrls = [];

  for (const filePath of files) {
    const key = relative(PUBLIC_DIR, filePath);
    const localSize = statSync(filePath).size;
    const remoteSize = existing.get(key);

    if (remoteSize !== undefined && remoteSize === localSize) {
      console.log(`⊘ ${key} — unchanged, skipping`);
      continue;
    }

    console.log(remoteSize !== undefined ? `↻ ${key} — replacing...` : `↑ ${key} — uploading...`);

    const ext = key.slice(key.lastIndexOf("."));
    const data = readFileSync(filePath);

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: data,
        ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
        // Long TTL so Cloudflare edge caches hero media (was DYNAMIC without this).
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = `${MEDIA_DOMAIN}/${key}`;
    console.log(`  → ${url}`);
    uploadedUrls.push(url);
  }

  await purgeCache(uploadedUrls);
  console.log("\nDone.");
}

main().catch(console.error);
