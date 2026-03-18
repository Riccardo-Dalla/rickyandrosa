import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function POST(request: Request) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(
      { status: "error", message: "Server not configured" },
      { status: 500 },
    );
  }

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

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
      }),
      redirect: "follow",
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid response from server" },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to save guest info" },
      { status: 500 },
    );
  }
}
