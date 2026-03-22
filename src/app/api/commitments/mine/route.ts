import { NextRequest, NextResponse } from "next/server";
import { getCommitmentsByEmail } from "@/lib/commitments";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const commitments = await getCommitmentsByEmail(email);
    return NextResponse.json(commitments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commitments" },
      { status: 500 }
    );
  }
}
