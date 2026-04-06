import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { SYLLABUS } from '@/lib/syllabus-data';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { level, targetScore } = data; // level: '0-20' | '20-50' | '50+'

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    
    // Provide AI with the high-ROI syllabus data so it grounds its answer in our engine
    const highRoiTopics = SYLLABUS.filter(t => t.roiLevel === 'High').map(t => `${t.subject}: ${t.topicLabel} (ROI: High)`).join(', ');
    const traps = SYLLABUS.filter(t => t.isTrap).map(t => `${t.subject}: ${t.topicLabel}`).join(', ');

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a strict, pragmatic SSC CGL tier-1 mentor.
The student is an absolute beginner asking for a clarity roadmap.

Current Status: Scoring ${level} marks out of 200.
Target Score: ${targetScore} marks.

High ROI Topics available (Easy to score, less time to learn):
${highRoiTopics}

Major Syllabus Traps (Takes months to learn for 1 mark, AVOID initially):
${traps}

Task: Generate a practical, step-by-step 30-day starter roadmap.
Rule 1: Focus ONLY on maximizing marks quickly based on High ROI topics.
Rule 2: Don't tell them to study everything. Tell them exactly what 5 topics to start with tomorrow.
Rule 3: Give 1 specific reason why hitting this target is realistic if they follow the ROI method.

Return strict JSON format with exactly these fields.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            pepTalk: { type: Type.STRING, description: "A highly motivating, logical 2 sentence opening." },
            startWithThese: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 5 topic names they should start tomorrow."
            },
            weeklyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING, description: "e.g. Week 1" },
                  focus: { type: Type.STRING }
                }
              }
            },
            trapsToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 strict warnings about what not to do."
            }
          },
          required: ["title", "pepTalk", "startWithThese", "weeklyPlan", "trapsToAvoid"]
        }
      }
    });

    if (!response.text) throw new Error("No response generated.");
    const parsed = JSON.parse(response.text);
    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error('[clarity/roadmap]', err);
    return NextResponse.json({ error: err.message || 'Failed to generate roadmap' }, { status: 500 });
  }
}
