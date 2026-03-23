import { NextRequest, NextResponse } from "next/server";
import {
  getUnremindedCommitments,
  updateLastReminded,
} from "@/lib/commitments";
import { sendReminderEmail } from "@/lib/emails";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const commitments = await getUnremindedCommitments();

    if (commitments.length === 0) {
      return NextResponse.json({ sent: 0, message: "No reminders due" });
    }

    const results = await Promise.allSettled(
      commitments.map((c) => sendReminderEmail(c.name, c.email, c.activityName))
    );

    const succeeded = results
      .map((r, i) => (r.status === "fulfilled" ? commitments[i].id : null))
      .filter(Boolean) as string[];

    const failed = results.filter((r) => r.status === "rejected").length;

    if (succeeded.length > 0) {
      await updateLastReminded(succeeded);
    }

    return NextResponse.json({
      sent: succeeded.length,
      failed,
      total: commitments.length,
    });
  } catch (err) {
    console.error("Reminder cron failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
