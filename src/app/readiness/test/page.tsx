"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  loadTestConfig, clearTestConfig, saveReadinessSession,
  ReadinessQuestion, ReadinessSession, ReadinessAnalysis
} from "@/lib/readiness";
import { getStrictMode } from "@/lib/storage";
import { TestEngine } from "@/components/readiness/TestEngine";
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Phase = 'loading' | 'testing' | 'submitting' | 'error';

export default function ReadinessTestPage() {
  const router = useRouter();
  const [phase, setPhase]       = useState<Phase>('loading');
  const [questions, setQuestions] = useState<ReadinessQuestion[]>([]);
  const [loadErr, setLoadErr]   = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [config, setConfig]     = useState<ReturnType<typeof loadTestConfig>>(null);

  useEffect(() => {
    const cfg = loadTestConfig();
    if (!cfg) { router.replace('/readiness'); return; }
    setConfig(cfg);

    // Generate questions
    const strictMode = getStrictMode();
    fetch('/api/readiness/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: cfg.subject,
        microTopicLabel: cfg.microTopicLabel,
        count: cfg.questionCount,
        difficulty: cfg.difficulty,
        strictMode,
      }),
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data.error || 'Failed to generate questions. Please try again.');
        }
        if (!data.questions?.length) {
          throw new Error('AI returned no questions');
        }
        setQuestions(data.questions);
        setPhase('testing');
      })
      .catch(e => {
        console.error(e);
        setLoadErr(e.message || 'AI couldn\'t generate questions. Check your API key and try again.');
        setPhase('error');
      });
  }, [router]);

  const handleComplete = useCallback(async (answers: (number | null)[], timeTaken: number) => {
    if (!config) return;
    setPhase('submitting');
    setSubmitErr(null);

    try {
      const strictMode = getStrictMode();
      const res = await fetch('/api/readiness/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: config.subject,
          microTopicLabel: config.microTopicLabel,
          questions,
          answers,
          timeTaken,
          strictMode,
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const analysis: ReadinessAnalysis = await res.json();

      const sessionId = Date.now().toString();
      const totalTime = config.mode === 'exam' ? config.questionCount * 60 : 0;
      const session: ReadinessSession = {
        id: sessionId,
        subject: config.subject,
        subjectLabel: config.subjectLabel,
        microTopic: config.microTopic,
        microTopicLabel: config.microTopicLabel,
        difficulty: config.difficulty,
        mode: config.mode,
        questionCount: config.questionCount,
        questions,
        answers,
        timeTaken,
        totalTime,
        startedAt: new Date(Date.now() - timeTaken * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        analysis,
      };

      saveReadinessSession(session);
      clearTestConfig();
      router.push(`/readiness/results/${sessionId}`);
    } catch (e) {
      console.error(e);
      setSubmitErr('Analysis failed. Your answers are saved — please try again.');
      setPhase('testing'); // let them retry
    }
  }, [config, questions, router]);

  const totalSeconds = config?.mode === 'exam' ? (config?.questionCount ?? 10) * 60 : 0;

  return (
    <div className="min-h-full bg-background text-foreground font-sans">
      {/* Ambient */}
      <div className="fixed top-[-10%] right-[-8%] w-[40%] h-[40%] rounded-full bg-primary/[0.03] hidden pointer-events-none" />

      <main className="relative z-10 max-w-2xl mx-auto px-5 py-8 flex flex-col min-h-[calc(100vh-4rem)] gap-5">

        {/* Top nav */}
        <div className="flex items-center justify-between">
          <Link href="/readiness" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wide font-semibold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Topics
          </Link>
          {config && (
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span className="px-2.5 py-1 bg-white/[0.04] border border-border rounded-full capitalize">{config.subject}</span>
              <span className="text-primary">→</span>
              <span className="px-2.5 py-1 bg-white/[0.04] border border-border rounded-full">{config.microTopicLabel}</span>
            </div>
          )}
        </div>

        {/* ── Loading: generating questions ── */}
        {phase === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-primary/50 border-t-[#3B82F6] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-black text-foreground text-lg">Generating PYQ Questions</p>
              <p className="text-muted-foreground text-sm">AI is crafting {config?.questionCount} trap-level questions for {config?.microTopicLabel}…</p>
            </div>
          </div>
        )}

        {/* ── Submitting: analyzing ── */}
        {phase === 'submitting' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center space-y-1">
              <p className="font-black text-foreground text-lg">Analyzing Your Performance</p>
              <p className="text-muted-foreground text-sm">AI Mentor is building your readiness report…</p>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-400" />
            <div>
              <p className="font-black text-foreground text-xl mb-1">Failed to Load</p>
              <p className="text-muted-foreground text-sm max-w-sm">{loadErr}</p>
            </div>
            <Link href="/readiness" className="px-6 py-3 bg-primary rounded-2xl text-white font-bold text-sm transition-all hover:bg-blue-600 tracking-wide shadow-sm">
              Back to Topics
            </Link>
          </div>
        )}

        {/* ── Testing ── */}
        {phase === 'testing' && questions.length > 0 && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-400">
            {submitErr && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3 text-sm">
                <span className="text-rose-400 font-black block mb-0.5">⚠ Submission Error</span>
                <span className="text-rose-300/80">{submitErr}</span>
              </div>
            )}
            <TestEngine
              questions={questions}
              mode={config?.mode ?? 'practice'}
              totalSeconds={totalSeconds}
              onComplete={handleComplete}
            />
          </div>
        )}

        {/* Loading hint */}
        {phase === 'loading' && config && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className={cn("w-2 h-2 rounded-full bg-primary animate-bounce")} style={{ animationDelay: '0ms' }} />
            <div className={cn("w-2 h-2 rounded-full bg-primary animate-bounce")} style={{ animationDelay: '150ms' }} />
            <div className={cn("w-2 h-2 rounded-full bg-primary animate-bounce")} style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </main>
    </div>
  );
}
