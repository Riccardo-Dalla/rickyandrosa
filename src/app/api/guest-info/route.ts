import { NextResponse } from "next/server";
import { findGuestByEmail, addGuest } from "@/lib/guests";
import { sendGuestNotificationEmail } from "@/lib/emails";

const GOOGLE_SHEET_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

async function syncToGoogleSheet(name: string, email: string, address: string) {
  if (!GOOGLE_SHEET_URL) return;
  
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, address }),
      redirect: "follow",
    });
  } catch (err) {
    console.error("Failed to sync to Google Sheet:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, address } = body;

    if (!name?.trim() || !email?.trim() || !address?.trim()) {
      return NextResponse.json(
        { status: "error", message: "All fields are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { status: "error", message: "Invalid email" },
        { status: 400 },
      );
    }

    const existing = await findGuestByEmail(email);
    if (existing) {
      return NextResponse.json({ status: "duplicate" });
    }

    const guest = await addGuest({
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
    });

    // Background tasks (non-blocking)
    sendGuestNotificationEmail(guest.name, guest.email, guest.address).catch(
      (err) => console.error("Failed to send guest notification:", err)
    );
    syncToGoogleSheet(guest.name, guest.email, guest.address);

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("Failed to save guest info:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to save guest info" },
      { status: 500 },
    );
  }
}
