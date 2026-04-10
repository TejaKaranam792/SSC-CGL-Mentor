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

    const { subject, topic, difficulty } = data;

    if (!subject || !topic || !difficulty) {
       return NextResponse.json({ error: "Missing required fields: subject, topic, difficulty" }, { status: 400 });
    }

    let difficultyContext = "";
    if (difficulty === "easy") {
       difficultyContext = "Easy -> Focus on basic concept clarity, formula application, and straightforward problems.";
    } else if (difficulty === "medium") {
       difficultyContext = "Medium -> Focus on standard SSC CGL Tier 1/Tier 2 previous year questions. Moderate calculations, typical logic.";
    } else if (difficulty === "hard") {
       difficultyContext = "Hard -> Focus on tricky, confusing, high-level questions. Include common traps, lengthy calculations, or complex logic often asked in Tier 2 to eliminate candidates.";
    }

    const prompt = `You are an expert SSC CGL question setter. 
Generate exactly 5 multiple choice questions for the following test parameters:
- Subject: ${subject}
- Topic: ${topic}
- Difficulty Level: ${difficulty.toUpperCase()}

Requirements:
- Match SSC CGL PYQ (Previous Year Question) patterns.
- Avoid generic textbook questions; make them exam-relevant.
- ${difficultyContext}

Return the output as a JSON array containing exactly 5 questions.
Each question should have:
- The question text.
- 4 options (array of strings).
- The exact correct answer string matching one of the options.
- A short, clear explanation of the solution or trick to solve it.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
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
                  explanation: { type: Type.STRING }
                }
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    if (response.text) {
      const resultData = JSON.parse(response.text);
      return NextResponse.json(resultData);
    }
    
    throw new Error("No response text");
  } catch (error: any) {
    console.error("Test Generation API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate test.", details: error.message },
      { status: 500 }
    );
  }
}
