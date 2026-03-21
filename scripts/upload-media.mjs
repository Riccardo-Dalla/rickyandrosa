import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, relative } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, CF_API_TOKEN, CF_ZONE_ID } = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 env vars. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME in .env.local");
  process.exit(1);
}

const MEDIA_DOMAIN = "https://media.rickyandrosa.com";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const PUBLIC_DIR = resolve("public");
const EXTENSIONS = new Set([".mp4", ".mp3", ".mov", ".webm"]);

const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

function findMedia(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMedia(full));
    } else if (EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
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

async function purgeCache(urls) {
  if (!CF_API_TOKEN || !CF_ZONE_ID || urls.length === 0) return;

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: urls }),
    }
  );
  const data = await res.json();
  if (data.success) {
    console.log(`⚡ Purged cache for ${urls.length} file(s)`);
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
