import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { subject, microTopicLabel, questions, answers, timeTaken, strictMode = false } = data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    // Build marked Q&A summary
    const correct = (answers as (number | null)[]).filter(
      (a, i) => a !== null && a === questions[i].correctIndex
    ).length;
    const accuracy = Math.round((correct / questions.length) * 100);

    const qaSummary = (questions as Array<{ question: string; options: string[]; correctIndex: number }>)
      .map((q, i) => {
        const userAnsIdx = (answers as (number | null)[])[i];
        const userAns = userAnsIdx !== null ? q.options[userAnsIdx] : '[Skipped]';
        const rightAns = q.options[q.correctIndex];
        const isRight  = userAnsIdx === q.correctIndex;
        return `Q${i + 1}: ${q.question}\nUser: "${userAns}" → ${isRight ? '✓ CORRECT' : '✗ WRONG (Correct: "' + rightAns + '")'} `;
      })
      .join('\n\n');

    const toneInstruction = strictMode
      ? 'STRICT MODE ON. Be brutally honest — call out every pattern, no softening. Use urgent, direct language. Make the student feel the gap.'
      : 'Be firm, direct, and constructive. Surgical feedback only — no fluff, no generic motivational text.';

    const prompt = `You are an elite SSC CGL mentor analyzing a micro-topic performance drill.
${toneInstruction}

Topic: "${microTopicLabel}" | Subject: ${subject}
Score: ${correct}/${questions.length} (${accuracy}%) | Time: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s

Detailed Q&A Log:
${qaSummary}

Analyze deeply. Rules:
- readinessLevel: "not_ready" if accuracy < 50%, "needs_improvement" if 50-79%, "exam_ready" if ≥ 80%
- strengths: specific concepts the student clearly understands (leave empty if < 50%)  
- weaknesses: specific concepts that failed — be exact, not generic
- mistakePatterns: recurring error types (e.g., "confuses active/passive voice markers")
- conceptGaps: specific knowledge gaps causing failures
- trapAwareness: which distractors fooled the student and why
- improvementPlan.whatToStudy: 3–5 laser-focused study targets
- improvementPlan.practiceCount: daily question target (realistic integer)
- improvementPlan.revisionStrategy: 1 focused paragraph, topic-specific
- additionalQuestions: exactly 5 fresh PYQ-pattern MCQs on this topic for further practice
- verdict: 1 sharp sentence — assessment of where the student stands`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracy:        { type: Type.INTEGER },
            verdict:         { type: Type.STRING },
            readinessLevel:  { type: Type.STRING },
            strengths:       { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses:      { type: Type.ARRAY, items: { type: Type.STRING } },
            mistakePatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            conceptGaps:     { type: Type.ARRAY, items: { type: Type.STRING } },
            trapAwareness:   { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementPlan: {
              type: Type.OBJECT,
              properties: {
                whatToStudy:      { type: Type.ARRAY, items: { type: Type.STRING } },
                practiceCount:    { type: Type.INTEGER },
                revisionStrategy: { type: Type.STRING },
              },
              required: ['whatToStudy', 'practiceCount', 'revisionStrategy'],
            },
            additionalQuestions: {
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
          required: ['accuracy', 'verdict', 'readinessLevel', 'strengths', 'weaknesses', 'mistakePatterns', 'conceptGaps', 'trapAwareness', 'improvementPlan', 'additionalQuestions'],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? '{}');
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[readiness/analyze]', err);
    return NextResponse.json({ error: 'Failed to analyze performance' }, { status: 500 });
  }
}
