import { put, list, del } from "@vercel/blob";
import { readFileSync, readdirSync } from "fs";
import { resolve, basename } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const MEDIA_DIR = resolve("public");
const EXTENSIONS = new Set([".mp4", ".mp3", ".mov", ".webm"]);

async function main() {
  const files = readdirSync(MEDIA_DIR).filter((f) =>
    EXTENSIONS.has(f.slice(f.lastIndexOf(".")))
  );

  if (files.length === 0) {
    console.log("No media files found in public/");
    return;
  }

  const existing = await list();
  const existingByName = new Map(
    existing.blobs.map((b) => [basename(b.pathname), b])
  );

  for (const file of files) {
    const filePath = resolve(MEDIA_DIR, file);
    const localSize = readFileSync(filePath).length;
    const remote = existingByName.get(file);

    if (remote && remote.size === localSize) {
      console.log(`⊘ ${file} — unchanged, skipping`);
      continue;
    }

    if (remote) {
      await del(remote.url);
      console.log(`↻ ${file} — replacing...`);
    } else {
      console.log(`↑ ${file} — uploading...`);
    }

    const data = readFileSync(filePath);
    const blob = await put(file, data, { access: "public" });
    console.log(`  → ${blob.url}`);
  }

  console.log("\nDone. Update your code with any new URLs above.");
}

main().catch(console.error);
