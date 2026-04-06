"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ReadinessQuestion } from "@/lib/readiness";
import { TimerRing } from "./TimerRing";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send, Circle, CheckCircle2 } from "lucide-react";

interface TestEngineProps {
  questions: ReadinessQuestion[];
  mode: 'practice' | 'exam';
  totalSeconds: number;     // 0 for practice
  onComplete: (answers: (number | null)[], timeTaken: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function TestEngine({ questions, mode, totalSeconds, onComplete }: TestEngineProps) {
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [current, setCurrent]   = useState(0);
  const [secsLeft, setSecsLeft] = useState(totalSeconds);
  const [elapsed, setElapsed]   = useState(0);
  const [slideDir, setSlideDir] = useState<'right' | 'left'>('right');
  const [animKey, setAnimKey]   = useState(0);
  const startRef = useRef(Date.now());

  // ── Timer ──
  useEffect(() => {
    const interval = setInterval(() => {
      const e = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(e);
      if (mode === 'exam' && totalSeconds > 0) {
        const left = Math.max(0, totalSeconds - e);
        setSecsLeft(left);
        if (left === 0) {
          clearInterval(interval);
          onComplete(answers, e);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, totalSeconds, answers, onComplete]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1;
        if (idx < questions[current].options.length) handleSelect(idx);
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions]);

  const handleSelect = useCallback((optIdx: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[current] = optIdx;
      return next;
    });
  }, [current]);

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    setSlideDir(idx > current ? 'right' : 'left');
    setAnimKey(k => k + 1);
    setCurrent(idx);
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startRef.current) / 1000);
    onComplete(answers, timeTaken);
  };

  const answered  = answers.filter(a => a !== null).length;
  const progress  = (answered / questions.length) * 100;
  const q         = questions[current];
  const allDone   = answered === questions.length;

  const animClass = slideDir === 'right'
    ? 'animate-in fade-in slide-in-from-right-6 duration-200'
    : 'animate-in fade-in slide-in-from-left-6 duration-200';

  return (
    <div className="flex flex-col gap-5 h-full">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Progress */}
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
            <span>Q{current + 1} / {questions.length}</span>
            <span>{answered} answered</span>
          </div>
          <div className="w-full bg-white/[0.05] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* Timer (exam mode) */}
        {mode === 'exam' && totalSeconds > 0 && (
          <TimerRing totalSeconds={totalSeconds} secondsLeft={secsLeft} size={72} />
        )}
      </div>

      {/* ── Question Card ── */}
      <div key={animKey} className={cn("flex-1 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden relative", animClass)}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />

        {/* Q number badge */}
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs tracking-wide font-semibold rounded-full">
            Question {current + 1}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide font-semibold">
            {mode === 'practice' ? 'Practice' : 'Exam Mode'}
          </span>
        </div>

        {/* Question text */}
        <p className="text-foreground text-lg font-bold leading-relaxed mb-6">{q.question}</p>

        {/* Options */}
        <div className="grid gap-3">
          {q.options.map((opt, idx) => {
            const isSelected = answers[current] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "group text-left flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200",
                  isSelected
                    ? "bg-primary border-primary/50 shadow-sm"
                    : "bg-muted border-border hover:border-primary/50 hover:bg-primary/[0.03]"
                )}
              >
                {/* Label bubble */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all duration-200",
                  isSelected
                    ? "bg-primary/10 text-primary-foreground border-primary/50 shadow-sm"
                    : "bg-white/5 text-muted-foreground border-border group-hover:border-primary/50 group-hover:text-primary"
                )}>
                  {OPTION_LABELS[idx]}
                </div>
                <span className={cn("text-sm font-medium leading-relaxed mt-0.5",
                  isSelected ? "text-foreground" : "text-slate-400")}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Previous */}
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] border border-border rounded-2xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Dot map */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                i === current
                  ? "bg-primary w-4 shadow-sm"
                  : answers[i] !== null
                    ? "bg-emerald-400/70"
                    : "bg-white/15 hover:bg-white/30"
              )}
              aria-label={`Go to Q${i + 1}`}
            />
          ))}
        </div>

        {/* Next or Submit */}
        {current < questions.length - 1 ? (
          <button
            onClick={() => goTo(current + 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-600 rounded-2xl text-sm font-bold text-white shadow-sm transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wide font-semibold transition-all",
              allDone
                ? "bg-primary text-white shadow-sm hover:shadow-sm hover:-translate-y-0.5"
                : "bg-primary/20 text-primary border-primary/40 hover:bg-primary"
            )}
          >
            <Send className="w-4 h-4" />
            {allDone ? 'Submit' : `Submit (${questions.length - answered} left)`}
          </button>
        )}
      </div>

      {/* ── Answered count footer ── */}
      <div className="flex items-center justify-center gap-2 py-1">
        {answers.map((a, i) => a !== null
          ? <CheckCircle2 key={i} className="w-3 h-3 text-emerald-400" />
          : <Circle key={i} className="w-3 h-3 text-white/10" />
        )}
      </div>
    </div>
  );
}
