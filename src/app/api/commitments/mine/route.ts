import { NextRequest, NextResponse } from "next/server";
import { searchCommitments } from "@/lib/commitments";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json(
      { error: "Name or email is required" },
      { status: 400 }
    );
  }

  try {
    const commitments = await searchCommitments(q);
    return NextResponse.json(commitments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commitments" },
      { status: 500 }
    );
  }
}
