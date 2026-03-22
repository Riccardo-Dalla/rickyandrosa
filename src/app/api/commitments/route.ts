import { NextResponse } from "next/server";
import { getCommitments, addCommitment } from "@/lib/commitments";

export async function GET() {
  const commitments = await getCommitments();
  const publicCommitments = commitments.filter((c) => !c.isPrivate);
  return NextResponse.json(publicCommitments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, activityId, activityName, costRange, isPrivate } = body;

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
      isPrivate: Boolean(isPrivate),
    });

    return NextResponse.json(commitment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create commitment" },
      { status: 500 }
    );
  }
}
