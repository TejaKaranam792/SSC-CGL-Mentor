import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { subject, microTopicLabel, count = 10, difficulty = 'medium', strictMode = false } = data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const toneNote = strictMode
      ? 'Include maximum PYQ traps, negative phrasing, lookalike options, and edge cases that trip even well-prepared students.'
      : 'Make questions challenging but fair, matching SSC CGL Tier-I exam standard.';

    const difficultyMap: Record<string, string> = {
      easy:   'straightforward SSC CGL basics — must know concepts',
      medium: 'PYQ-level — requires concept clarity and speed',
      hard:   'advanced — tricky wording, multi-step, trap-heavy',
    };

    const prompt = `You are an elite SSC CGL question setter with 20+ years of PYQ analysis.

Generate exactly ${count} MCQ questions on topic: "${microTopicLabel}" (Subject: ${subject})
Difficulty: ${difficultyMap[difficulty] ?? difficultyMap.medium}
${toneNote}

Strict requirements:
- Follow SSC CGL Previous Year Question (PYQ) patterns exactly
- Each question must test a distinct concept or variation — no repetition
- Include realistic distractors (trap options that appear correct)
- For Quant: use real numbers requiring actual calculation; avoid shortcuts in options
- For English: use grammatically meaningful, exam-realistic sentences
- For Reasoning: follow exact SSC coding/pattern conventions
- For GS: fact-based, no ambiguity
- options array must contain EXACTLY 4 strings (the option texts, not labelled A/B/C/D)
- correctIndex is 0-based integer (0 = first option)
- explanation must be clear, show the approach/shortcut, 2-4 sentences max`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question:     { type: Type.STRING },
                  options:      { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation:  { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? '{"questions":[]}');
    // Validate: ensure we have array of questions with proper shape
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return NextResponse.json({ error: 'AI returned no questions' }, { status: 502 });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[readiness/generate]', err);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
