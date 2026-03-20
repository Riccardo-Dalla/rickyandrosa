import { put, list, del } from "@vercel/blob";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, relative } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const PUBLIC_DIR = resolve("public");
const EXTENSIONS = new Set([".mp4", ".mp3", ".mov", ".webm"]);

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

async function main() {
  const files = findMedia(PUBLIC_DIR);

  if (files.length === 0) {
    console.log("No media files found in public/");
    return;
  }

  const existing = await list();
  const existingByPath = new Map(
    existing.blobs.map((b) => [b.pathname, b])
  );

  for (const filePath of files) {
    const blobName = relative(PUBLIC_DIR, filePath);
    const localSize = statSync(filePath).size;
    const remote = existingByPath.get(blobName);

    if (remote && remote.size === localSize) {
      console.log(`⊘ ${blobName} — unchanged, skipping`);
      continue;
    }

    if (remote) {
      await del(remote.url);
      console.log(`↻ ${blobName} — replacing...`);
    } else {
      console.log(`↑ ${blobName} — uploading...`);
    }

    const data = readFileSync(filePath);
    const blob = await put(blobName, data, { access: "public" });
    console.log(`  → ${blob.url}`);
  }

  console.log("\nDone. Update your code with any new URLs above.");
}

main().catch(console.error);
