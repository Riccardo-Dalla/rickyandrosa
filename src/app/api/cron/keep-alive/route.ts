import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sql`SELECT 1 as ping`;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: result.rows[0],
    });
  } catch (error) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json({ error: "Database ping failed" }, { status: 500 });
  }
}
