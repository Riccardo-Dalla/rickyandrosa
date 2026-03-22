import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { updateCommitmentPhoto } from "@/lib/commitments";

const MEDIA_DOMAIN = "https://media.rickyandrosa.com";

function getR2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("Missing R2 env vars");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

const IMAGE_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
};

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const commitmentId = form.get("commitmentId") as string | null;

    if (!file || !commitmentId) {
      return NextResponse.json(
        { error: "File and commitmentId are required" },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const key = `photos/${commitmentId}-${Date.now()}.${ext}`;
    const bucket = process.env.R2_BUCKET_NAME!;

    const buffer = Buffer.from(await file.arrayBuffer());

    const s3 = getR2Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: IMAGE_CONTENT_TYPES[ext] || "application/octet-stream",
      })
    );

    const photoUrl = `${MEDIA_DOMAIN}/${key}`;
    const commitment = await updateCommitmentPhoto(commitmentId, photoUrl);

    return NextResponse.json(commitment);
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
