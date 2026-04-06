"use client";

import { MentorFeedback, getCheckedPlans, toggleCheckedPlan } from "@/lib/storage";
import { AlertOctagon, BrainCircuit, Activity, Crosshair, Target, LineChart, CheckCircle2, Circle, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function MentorResponseCards({ feedback }: { feedback: MentorFeedback | null }) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  useEffect(() => {
    if (feedback) setCheckedItems(getCheckedPlans(feedback.id));
  }, [feedback]);

  if (!feedback) return null;

  const handleToggle = (index: number) => {
    const updated = toggleCheckedPlan(feedback.id, index);
    setCheckedItems(updated);
  };

  const completed  = checkedItems.length;
  const totalTasks = feedback.todaysPlan.length;
  const pct = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">

      {/* ── Mentor Verdict (centered quote) ─────────────────────────────── */}
      <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden text-center shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] text-primary uppercase">Mentor Verdict</span>
          </div>
          <p className="text-foreground text-xl sm:text-2xl md:text-3xl font-black leading-tight max-w-2xl mx-auto">
            &ldquo;{feedback.mentorMessage}&rdquo;
          </p>
        </div>
      </div>

      {/* ── Analysis + Root Cause Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Performance Analysis */}
        <div className="bg-card border border-border rounded-2xl p-6 hover:border-indigo-500/20 transition-colors duration-300 shadow-lg group">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <LineChart className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-xs font-black tracking-[0.15em] text-indigo-400 uppercase">Performance Analysis</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">{feedback.analysis}</p>
        </div>

        {/* Root Cause */}
        <div className="bg-card border border-rose-500/10 rounded-2xl p-6 hover:border-rose-500/20 transition-colors duration-300 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <BrainCircuit className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-xs font-black tracking-[0.15em] text-rose-400 uppercase">Root Cause</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-medium mb-4">{feedback.rootCauses}</p>
          <div className="flex flex-wrap gap-2">
            {feedback.weakAreas.map((area, i) => (
              <span key={i} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold rounded-lg">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 1-Day Fix Protocol with Checkboxes ─────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />

        {/* Header + Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-7">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl border border-border shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-foreground">1-Day Fix Protocol</h3>
              <p className="text-xs text-muted-foreground font-medium">Click tasks to mark complete</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 bg-white/5 rounded-full h-2">
              <div
                className={cn("h-2 rounded-full transition-all duration-500", pct === 100 ? "bg-emerald-400" : "bg-primary")}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-black text-primary tabular-nums">{completed}/{totalTasks}</span>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {feedback.todaysPlan.map((plan, i) => {
            const done = checkedItems.includes(i);
            return (
              <div
                key={i}
                onClick={() => handleToggle(i)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200",
                  done
                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-70"
                    : "bg-muted border-border hover:border-primary/50 hover:bg-primary/[0.03]"
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <Circle className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <span className={cn("text-[11px] font-black uppercase tracking-wide font-semibold block mb-1", done ? "text-emerald-500/50" : "text-primary")}>
                    {plan.hour}
                  </span>
                  <p className={cn("text-sm leading-snug font-medium", done ? "text-muted-foreground line-through" : "text-foreground")}>
                    {plan.task}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {pct === 100 && (
          <div className="mt-5 py-3 text-center text-sm font-black text-emerald-400 uppercase tracking-wide font-semibold animate-in fade-in duration-500 border border-emerald-500/20 rounded-2xl bg-emerald-500/5">
            🎯 Full Protocol Complete — Log tomorrow&apos;s test
          </div>
        )}
      </div>

      {/* ── Practice Drills + Rules ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-8">

        {/* Practice Questions */}
        <div className="bg-card border border-emerald-500/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Crosshair className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-black tracking-[0.15em] text-emerald-400 uppercase">Targeted Drills</h3>
          </div>
          <ul className="space-y-3">
            {feedback.practiceQuestions.map((q, i) => {
              const isOpen = expandedQ === i;
              return (
                <li key={i} className="bg-background rounded-2xl border border-border overflow-hidden">
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wide font-semibold rounded mb-2">
                      {q.topic}
                    </span>
                    <p className="text-[#C0C0D0] text-sm font-medium leading-relaxed">{q.question}</p>
                  </div>
                  {(q.answer || q.explanation) && (
                    <button
                      onClick={() => setExpandedQ(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border text-[11px] font-bold uppercase tracking-wide font-semibold text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/[0.03] transition-all"
                    >
                      <span>{isOpen ? 'Hide Answer' : 'Reveal Answer'}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      {q.answer && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wide font-semibold block mb-1">Answer</span>
                          <p className="text-emerald-300 font-bold text-sm">{q.answer}</p>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="bg-white/[0.02] border border-border rounded-xl px-3 py-2.5">
                          <span className="text-xs font-semibold text-muted-foreground block mb-1">Explanation</span>
                          <p className="text-slate-400 text-sm leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Ironclad Rules */}
        <div className="bg-[#150A0A] border border-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary hidden rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-5 relative z-10">
            <div className="p-1.5 bg-primary rounded-lg border border-border">
              <AlertOctagon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xs font-black tracking-[0.15em] text-primary uppercase">Ironclad Rules</h3>
          </div>
          <ul className="space-y-4 relative z-10">
            {feedback.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-sm">
                  <Zap className="w-3 h-3" />
                </div>
                <span className="text-[#E0D5B0] text-sm font-bold leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
