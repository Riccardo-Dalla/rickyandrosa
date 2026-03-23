import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { deleteCommitment } from "@/lib/commitments";

const MEDIA_DOMAIN = "https://media.rickyandrosa.com";

function getR2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photoUrl = await deleteCommitment(id);

    if (photoUrl === null) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (photoUrl && photoUrl.startsWith(MEDIA_DOMAIN)) {
      const key = photoUrl.replace(`${MEDIA_DOMAIN}/`, "");
      const s3 = getR2Client();
      if (s3) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
          })
        ).catch(() => {});
      }
    }

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
