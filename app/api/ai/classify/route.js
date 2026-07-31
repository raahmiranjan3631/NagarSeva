import { classifyGrievance, classifyFromText } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, description } = body;

    let result;
    if (image) {
      // Remove data URL prefix if present
      const base64 = image.replace(/^data:image\/\w+;base64,/, "");
      result = await classifyGrievance(base64, description);
    } else if (description) {
      result = await classifyFromText(description);
    } else {
      return NextResponse.json({ error: "Provide image or description" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI classify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
