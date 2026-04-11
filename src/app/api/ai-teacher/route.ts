import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let { subject, topic, mode = "practice", strictMode = false } = data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    // Ensure model selection is fallback-safe (switched to 3.1-flash-lite-preview as requested)
    const model = "gemini-3.1-flash-lite-preview";
    
    let prompt = "";
    let responseSchema: any = {};

    if (mode === "concept") {
      prompt = `You are a top SSC CGL ${subject} mentor.
For topic: ${topic}
Give:
- Basic concept (very short)
- Important formulas / rules
- Shortcut tricks used in SSC
- 3 PYQ-type questions with clear step-by-step solutions focusing on shortcuts.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          theory: { type: Type.STRING },
          formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
          shortcuts: { type: Type.ARRAY, items: { type: Type.STRING } },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
        required: ["theory", "formulas", "shortcuts", "examples"],
      };
    } else if (mode === "practice" || mode === "mock") {
      const qCount = mode === "mock" ? 20 : 10;
      prompt = `You are an elite SSC CGL question setter.
Generate exactly ${qCount} SSC CGL level MCQs.
Subject: ${subject}
${topic ? `Topic: ${topic}` : "Mix all important topics from the syllabus."}
Focus on PYQ patterns, mix easy and medium level. Provide sharp explanations highlighting time-saving tricks.
${strictMode ? "Include tricky standard distractors and trap wording." : ""}

Requirements:
- options array must contain EXACTLY 4 strings.
- correctIndex is 0-based integer.
- explanation must be short but emphasize the shortcut.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
        required: ["questions"],
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsed = JSON.parse(response.text ?? "{}");
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[ai-teacher/route]", err);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
