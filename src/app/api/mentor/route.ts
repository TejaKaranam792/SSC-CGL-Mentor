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

    const isSectional = data.testType === 'sectional';
    const isStrict = data.strictMode === true;
    
    let scoresContext = '';
    if (isSectional) {
      const subject = data.sectionalSubject ?? 'unknown';
      scoresContext = `- Assessment Type: Sectional Mock (${subject.toUpperCase()})
- Total Score: ${data.totalScore}/50`;
    } else {
      scoresContext = `- Assessment Type: Full Mock
- Total Score: ${data.totalScore}/200
- Quant: ${data.quantScore}/50
- Reasoning: ${data.reasoningScore}/50
- English: ${data.englishScore}/50
- General Studies (GS): ${data.gsScore}/50`;
    }

    const toneInstruction = isStrict
      ? `You are in STRICT MODE. Be brutally blunt. Zero sugarcoating. Shame mediocrity. Use forceful, urgent language. Make the student feel the weight of every mistake. Phrases like "This is unacceptable", "You are wasting potential", and "No excuses" are encouraged.`
      : `You are strict, direct, and performance-focused. No generic advice. Give sharp, actionable feedback with professional firmness.`;

    const prompt = `You are an elite SSC CGL mentor with 20+ years of experience and a track record of producing Rank 1 aspirants.
${toneInstruction}

Student Performance Data:
${scoresContext}
- Weak Topics Identified: ${data.weakTopics}
- Primary Mistake Type: ${data.mistakeTypes}
- Time Management Issues: ${data.timeManagementIssue ? 'Yes' : 'No'} (${data.timeManagementIssue ? data.timeManagementDesc : 'N/A'})

For this student:
1. Analyze performance deeply based on the Assessment Type. Handle ${isSectional ? '50 max marks' : '200 max marks'} appropriately.
2. Identify weak areas and mistake patterns.
3. Explain root causes clearly.
4. Generate a 1-day actionable plan (hour-wise, realistic).
5. Give exactly 2 SSC-level practice questions from their weak areas${isSectional ? ` strictly from the ${data.sectionalSubject} subject area` : ''}. Include the correct answer and step-by-step explanation.
6. Provide 2–3 strict mistake correction rules.
7. End with a sharp, performance-driven mentor message.

Focus only on marks improvement. Respond strictly as JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "A strict, brutal analysis of their score." },
            weakAreas: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of specific weak topics identified from the data."
            },
            rootCauses: { type: Type.STRING, description: "Direct explanation of why they are making the 'Primary Mistake Type'." },
            todaysPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hour: { type: Type.STRING },
                  task: { type: Type.STRING }
                }
              }
            },
            practiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING, description: "The correct answer to the practice question." },
                  explanation: { type: Type.STRING, description: "Step-by-step explanation of how to arrive at the answer." }
                }
              }
            },
            rules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 strict rules to fix their specific errors."
            },
            mentorMessage: { type: Type.STRING, description: "A very sharp, performance-driven final push." }
          },
          required: ["analysis", "weakAreas", "rootCauses", "todaysPlan", "practiceQuestions", "rules", "mentorMessage"]
        }
      }
    });

    if (response.text) {
      const resultData = JSON.parse(response.text);
      return NextResponse.json(resultData);
    }
    
    throw new Error("No response text");
  } catch (error: any) {
    console.error("Mentor API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate mentor feedback.", details: error.message },
      { status: 500 }
    );
  }
}
