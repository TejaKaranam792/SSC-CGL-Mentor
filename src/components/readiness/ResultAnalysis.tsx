"use client";

import { ReadinessSession, ReadinessAnalysis, ReadinessLevel, toggleMastered, getMasteredTopics } from "@/lib/readiness";
import { ReadinessQuestion } from "@/lib/readiness";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, XCircle, AlertTriangle, TrendingUp, BookOpen,
  ChevronDown, ChevronUp, Target, Zap, Star, RotateCcw, Shield
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const READINESS_CONFIG: Record<ReadinessLevel, {
  label: string; badge: string; color: string;
  bg: string; border: string; glow: string;
}> = {
  not_ready:         { label: 'Not Ready',         badge: '🔴', color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/40',    glow: 'shadow-sm'         },
  needs_improvement: { label: 'Needs Work',        badge: '🟡', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20',   glow: 'shadow-sm'        },
  exam_ready:        { label: 'Exam Ready',         badge: '🟢', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', glow: 'shadow-sm'        },
};

function AccuracyRing({ accuracy }: { accuracy: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - accuracy / 100);
  const color = accuracy >= 80 ? '#10b981' : accuracy >= 50 ? '#3B82F6' : '#ef4444';
  const glow  = accuracy >= 80 ? 'rgba(16,185,129,0.6)' : accuracy >= 50 ? 'rgba(59,130,246,0.6)' : 'rgba(239,68,68,0.6)';

  return (
    <div className="relative" style={{ width: 128, height: 128 }}>
      <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={64} cy={64} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle
          cx={64} cy={64} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-foreground">{accuracy}%</span>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide font-semibold">accuracy</span>
      </div>
    </div>
  );
}

function QuestionReview({ q, idx, userAnswer }: {
  q: ReadinessQuestion; idx: number; userAnswer: number | null;
}) {
  const isCorrect = userAnswer === q.correctIndex;
  const isSkipped = userAnswer === null;
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all",
      isCorrect  ? "border-emerald-500/20 bg-emerald-500/5" :
      isSkipped  ? "border-border bg-muted" :
                   "border-rose-500/20 bg-rose-500/5"
    )}>
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
           isSkipped  ? <AlertTriangle className="w-5 h-5 text-muted-foreground" /> :
                        <XCircle className="w-5 h-5 text-rose-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wide font-semibold">Q{idx + 1}</span>
          <p className="text-foreground text-sm font-medium leading-snug mt-0.5">{q.question}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {!isSkipped && (
              <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded border",
                isCorrect ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-300 border-rose-500/20"
              )}>
                Your: {q.options[userAnswer!]}
              </span>
            )}
            {!isCorrect && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Correct: {q.options[q.correctIndex]}
              </span>
            )}
          </div>
        </div>
        {q.explanation && (
          <button onClick={() => setOpen(o => !o)} className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors p-1">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      {open && q.explanation && (
        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-150">
          <div className="bg-black/20 rounded-xl p-3 border border-border">
            <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtraQuestion({ q, idx }: { q: ReadinessQuestion; idx: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-muted rounded-2xl border border-border overflow-hidden">
      <div className="p-4">
        <span className="text-[10px] font-black text-primary border border-border bg-primary px-2 py-0.5 rounded uppercase tracking-wide font-semibold">
          Bonus Q{idx + 1}
        </span>
        <p className="text-foreground text-sm font-medium leading-relaxed mt-2">{q.question}</p>
        <div className="grid gap-2 mt-3">
          {q.options.map((opt, i) => {
            const showResult = revealed;
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => { setSelected(i); setRevealed(true); }}
                className={cn(
                  "text-left px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  showResult && i === q.correctIndex ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" :
                  showResult && selected === i && i !== q.correctIndex ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                  !showResult && "bg-background border-border text-slate-400 hover:border-primary/50 hover:text-foreground"
                )}>
                {opt}
              </button>
            );
          })}
        </div>
        {revealed && q.explanation && (
          <div className="mt-3 p-3 bg-black/20 rounded-xl border border-border animate-in fade-in duration-300">
            <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResultAnalysis({ session }: { session: ReadinessSession }) {
  const analysis = session.analysis as ReadinessAnalysis;
  const topicKey = `${session.subject}::${session.microTopic}`;
  const [mastered, setMastered] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    setMastered(getMasteredTopics().includes(topicKey));
  }, [topicKey]);

  const handleMastered = () => {
    const next = toggleMastered(topicKey);
    setMastered(next);
  };

  const cfg = READINESS_CONFIG[analysis.readinessLevel as ReadinessLevel] ?? READINESS_CONFIG.needs_improvement;
  const correct = session.answers.filter((a, i) => a === session.questions[i].correctIndex).length;
  const skipped = session.answers.filter(a => a === null).length;
  const mins = String(Math.floor(session.timeTaken / 60)).padStart(2, '0');
  const secs = String(session.timeTaken % 60).padStart(2, '0');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">

      {/* ── Hero: Score + Readiness ── */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary hidden rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <AccuracyRing accuracy={analysis.accuracy} />
          <div className="flex-1 text-center sm:text-left">
            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border font-black text-sm mb-3", cfg.bg, cfg.border, cfg.color, cfg.glow)}>
              <span className="text-base">{cfg.badge}</span>
              {cfg.label}
            </div>
            <p className="text-foreground font-bold text-lg leading-snug mb-3 italic">&ldquo;{analysis.verdict}&rdquo;</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground font-medium">
              <span>✅ {correct}/{session.questionCount} correct</span>
              {skipped > 0 && <span>⏭ {skipped} skipped</span>}
              <span>⏱ {mins}:{secs}</span>
              <span className="capitalize">{session.mode} mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Strengths + Weaknesses ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.strengths.length > 0 && (
          <div className="bg-card border border-emerald-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wide font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />{s}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="bg-card border border-rose-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-wide font-semibold">Weaknesses</h3>
          </div>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />{w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Concept Gaps + Trap Awareness ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.conceptGaps.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black text-primary uppercase tracking-wide font-semibold">Concept Gaps</h3>
            </div>
            <ul className="space-y-2">
              {analysis.conceptGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />{g}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.trapAwareness.length > 0 && (
          <div className="bg-card border border-orange-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-black text-orange-400 uppercase tracking-wide font-semibold">Trap Awareness</h3>
            </div>
            <ul className="space-y-2">
              {analysis.trapAwareness.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />{t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Improvement Plan ── */}
      <div className="bg-card border border-indigo-500/15 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/40 rounded-l-2xl" />
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold">Improvement Plan</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{analysis.improvementPlan.revisionStrategy}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-3 border border-border">
            <div className="text-[11px] font-black text-indigo-400 uppercase tracking-wide font-semibold mb-2">
              <BookOpen className="w-3 h-3 inline mr-1.5" />Study Targets
            </div>
            <ul className="space-y-1.5">
              {analysis.improvementPlan.whatToStudy.map((s, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                  <span className="text-indigo-400 font-black">{i + 1}.</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted rounded-xl p-3 border border-border flex flex-col justify-center items-center text-center">
            <Target className="w-5 h-5 text-primary mb-1" />
            <div className="text-3xl font-black text-primary">{analysis.improvementPlan.practiceCount}</div>
            <div className="text-[11px] font-black text-muted-foreground uppercase tracking-wide font-semibold">questions / day</div>
          </div>
        </div>
      </div>

      {/* ── Question Review ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold mb-4">Question Review</h3>
        <div className="space-y-3">
          {session.questions.map((q, i) => (
            <QuestionReview key={i} q={q} idx={i} userAnswer={session.answers[i]} />
          ))}
        </div>
      </div>

      {/* ── Extra Practice Questions ── */}
      {analysis.additionalQuestions?.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          <button
            onClick={() => setShowExtra(e => !e)}
            className="w-full flex items-center justify-between text-left mb-1"
          >
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              5 Extra Practice Questions
            </h3>
            {showExtra ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <p className="text-xs text-muted-foreground mb-4">Click options to test yourself. Answer reveals automatically.</p>
          {showExtra && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {analysis.additionalQuestions.map((q, i) => (
                <ExtraQuestion key={i} q={q as ReadinessQuestion} idx={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex flex-wrap gap-3 pb-8">
        <Link
          href="/readiness"
          className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm rounded-2xl transition-all shadow-sm hover:-translate-y-0.5"
        >
          <RotateCcw className="w-4 h-4" />
          New Test
        </Link>
        <button
          onClick={handleMastered}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold uppercase tracking-wide text-sm border transition-all",
            mastered
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
              : "bg-white/[0.04] border-border text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          <Star className={cn("w-4 h-4", mastered ? "text-emerald-400 fill-emerald-400" : "")} />
          {mastered ? 'Mastered ✓' : 'Mark Mastered'}
        </button>
      </div>
    </div>
  );
}
