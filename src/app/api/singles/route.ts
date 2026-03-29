import { NextRequest, NextResponse } from "next/server";
import { getProfiles, addProfile } from "@/lib/singles";

const ADMIN_KEY = process.env.SINGLES_ADMIN_KEY;

function isAuthorized(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key");
  return !!ADMIN_KEY && key === ADMIN_KEY;
}

export async function GET() {
  try {
    const profiles = await getProfiles();
    return NextResponse.json(profiles);
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, age, location, latitude, longitude, photo, description, instagram } = body;

    if (!name?.trim() || !location?.trim() || latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const profile = await addProfile({
      name,
      age: age ? Number(age) : undefined,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      photo: photo || "",
      description: description || undefined,
      instagram: instagram || undefined,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (err) {
    console.error("Failed to create profile:", err);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
