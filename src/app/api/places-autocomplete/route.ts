import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");
  const placeId = searchParams.get("placeId");

  if (!API_KEY) {
    return NextResponse.json({ suggestions: [] });
  }

  if (placeId) {
    return getPlaceDetails(placeId);
  }

  if (!input || input.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
        },
        body: JSON.stringify({ input }),
      },
    );

    const data = await response.json();

    const suggestions = (data.suggestions || [])
      .filter(
        (s: { placePrediction?: { text?: { text?: string } } }) =>
          s.placePrediction?.text?.text,
      )
      .slice(0, 5)
      .map(
        (s: {
          placePrediction: {
            placeId: string;
            text: { text: string };
          };
        }) => ({
          text: s.placePrediction.text.text,
          placeId: s.placePrediction.placeId,
        }),
      );

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}

async function getPlaceDetails(placeId: string) {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY!,
          "X-Goog-FieldMask": "formattedAddress,addressComponents",
        },
      },
    );

    const data = await response.json();

    return NextResponse.json({
      formattedAddress: data.formattedAddress || null,
    });
  } catch {
    return NextResponse.json({ formattedAddress: null });
  }
}
