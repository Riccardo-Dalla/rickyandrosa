import { NextResponse } from "next/server";
import { getCommitments, addCommitment } from "@/lib/commitments";

export async function GET() {
  const commitments = await getCommitments();
  return NextResponse.json(commitments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, activityId, activityName, costRange } = body;

    if (!name || !email || !activityId || !activityName) {
      return NextResponse.json(
        { error: "Name, email, activityId, and activityName are required" },
        { status: 400 }
      );
    }

    const commitment = await addCommitment({
      name,
      email,
      activityId,
      activityName,
      costRange: costRange || "Varies",
    });

    return NextResponse.json(commitment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create commitment" },
      { status: 500 }
    );
  }
}
