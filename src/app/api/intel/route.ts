import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const subject = data.subject || "General";
    const topic = data.topic;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `You are an expert SSC CGL mentor.
Explain the topic "${topic}" under the subject "${subject}" in a highly practical, shortcut-focused way.

Include:
- 2-3 line overview
- Core rules
- Tricks and specific shortcuts to solve questions faster
- Common traps examiners use
- Exam strategy and time-saving tips
- Memory techniques or mnemonics
- Exactly 2 quick, mini practice questions with answers and step-by-step explanations.

Avoid:
- Long theory
- Academic explanations

Focus on:
- Speed
- Accuracy
- Exam relevance for SSC CGL

Return the response strictly as JSON conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: "A quick 2-3 line overview explaining the core of the topic." },
            coreRules: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4-6 bullet points of the most essential rules to remember."
            },
            shortcuts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Fast solving techniques and pattern recognition tips."
            },
            traps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Common mistakes and examiner traps."
            },
            examStrategy: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "How to approach this specific topic in the exam, scanning tips, etc."
            },
            memoryHacks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Mnemonics or easy recall techniques."
            },
            miniPractice: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              },
              description: "2 mini practice questions to instantly test retention."
            }
          },
          required: ["overview", "coreRules", "shortcuts", "traps", "examStrategy", "memoryHacks", "miniPractice"]
        }
      }
    });

    if (response.text) {
      const resultData = JSON.parse(response.text);
      return NextResponse.json(resultData);
    }
    
    throw new Error("No response text");
  } catch (error: any) {
    console.error("Intel API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate intelligence data.", details: error.message },
      { status: 500 }
    );
  }
}
