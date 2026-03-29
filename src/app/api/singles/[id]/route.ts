import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getProfile, updateProfile, deleteProfile } from "@/lib/singles";

const ADMIN_KEY = process.env.SINGLES_ADMIN_KEY;
const MEDIA_DOMAIN = "https://media.rickyandrosa.com";

function getR2Client() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    return null;
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

async function deletePhotoFromR2(photoUrl: string) {
  if (!photoUrl || !photoUrl.startsWith(MEDIA_DOMAIN)) return;
  
  const key = photoUrl.replace(`${MEDIA_DOMAIN}/`, "");
  const s3 = getR2Client();
  if (!s3) return;

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }));
  } catch (err) {
    console.error("Failed to delete photo from R2:", err);
  }
}

function isAuthorized(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key");
  return !!ADMIN_KEY && key === ADMIN_KEY;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await getProfile(id);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(profile);
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if photo is being replaced
    const existingProfile = await getProfile(id);
    const oldPhoto = existingProfile?.photo;
    const newPhoto = body.photo;

    const profile = await updateProfile(id, {
      name: body.name,
      age: body.age != null ? Number(body.age) : undefined,
      location: body.location,
      latitude: body.latitude != null ? Number(body.latitude) : undefined,
      longitude: body.longitude != null ? Number(body.longitude) : undefined,
      photo: body.photo,
      description: body.description,
      instagram: body.instagram,
    });

    // Delete old photo if it was replaced or removed
    if (oldPhoto && oldPhoto !== newPhoto) {
      await deletePhotoFromR2(oldPhoto);
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error("Failed to update profile:", err);
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const photoUrl = await deleteProfile(id);

    if (photoUrl === null) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Clean up photo from R2
    if (photoUrl) {
      await deletePhotoFromR2(photoUrl);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete profile:", err);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
