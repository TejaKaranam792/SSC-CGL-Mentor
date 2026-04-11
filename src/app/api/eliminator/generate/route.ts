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

    const { reportText } = data;

    if (!reportText) {
       return NextResponse.json({ error: "Missing required field: reportText" }, { status: 400 });
    }

    const prompt = `You are the ultimate SSC CGL Elite Mentor. The user has pasted their recent test analysis report below.
    
REPORT:
"""
${reportText}
"""

Your task is to help the user completely eliminate the errors found in this report.
1. Identify the exact weak areas and concept gaps.
2. Provide a "conceptExplanation": A brutal, crystal-clear, and highly informative tutorial explaining those exact concepts. Do not use Markdown tables or complex formatting. Just use plain text paragraphs with simple bullet points (using - or *) where necessary. Keep it under 250 words but extremely high yield.
3. Provide a "questions" array containing exactly 10 multiple choice questions to test these weak concepts exclusively.
    - Questions 1 and 2 MUST be easy (foundation level).
    - Questions 3 to 6 MUST be medium (SSC PYQ level).
    - Questions 7 to 10 MUST be hard (Advanced/Trap level).

Return a JSON object containing 'explanation' and 'questions'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                     type: Type.ARRAY, 
                     items: { type: Type.STRING } 
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING }
                }
              }
            }
          },
          required: ["explanation", "questions"]
        }
      }
    });

    if (response.text) {
      const resultData = JSON.parse(response.text);
      return NextResponse.json(resultData);
    }
    
    throw new Error("No response text");
  } catch (error: any) {
    console.error("Eliminator API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate eliminator assigned.", details: error.message },
      { status: 500 }
    );
  }
}
