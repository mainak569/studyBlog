import { NextResponse } from "next/server";

// override with GEMINI_MODEL when Google retires a model
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
    }

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8000 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Gemini error" },
        { status: response.status }
      );
    }

    let answer: string | null = null;

    if (data?.candidates?.[0]?.content?.parts) {
      answer = data.candidates[0].content.parts
        .map((p: any) => p.text || "")
        .join("\n")
        .trim();
    }

    return NextResponse.json({
      answer: answer || "I couldn't find an answer.",
    });
  } catch (err) {
    console.error("Gemini route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
