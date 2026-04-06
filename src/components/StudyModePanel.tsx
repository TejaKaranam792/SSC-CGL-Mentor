"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCheckedPlans, toggleCheckedPlan, MentorFeedback } from "@/lib/storage";
import { CheckCircle2, Circle } from "lucide-react";

interface StudyModePanelProps {
  feedback: MentorFeedback | null;
  onClose: () => void;
}

const WORK_MINS = 25;
const BREAK_MINS = 5;
const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45

export function StudyModePanel({ feedback, onClose }: StudyModePanelProps) {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [seconds, setSeconds] = useState(WORK_MINS * 60);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === 'work' ? WORK_MINS * 60 : BREAK_MINS * 60;
  const progress = 1 - seconds / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Load checked plans
  useEffect(() => {
    if (feedback) setCheckedItems(getCheckedPlans(feedback.id));
  }, [feedback]);

  const tick = useCallback(() => {
    setSeconds(s => {
      if (s <= 1) {
        setRunning(false);
        if (mode === 'work') {
          setSession(prev => prev + 1);
          setMode('break');
          return BREAK_MINS * 60;
        } else {
          setMode('work');
          return WORK_MINS * 60;
        }
      }
      return s - 1;
    });
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  const reset = () => {
    setRunning(false);
    setSeconds(mode === 'work' ? WORK_MINS * 60 : BREAK_MINS * 60);
  };

  const switchMode = (m: 'work' | 'break') => {
    setMode(m);
    setRunning(false);
    setSeconds(m === 'work' ? WORK_MINS * 60 : BREAK_MINS * 60);
  };

  const handleToggle = (index: number) => {
    if (!feedback) return;
    const updated = toggleCheckedPlan(feedback.id, index);
    setCheckedItems(updated);
  };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const completed = checkedItems.length;
  const total = feedback?.todaysPlan.length ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-card border border-border rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-lg shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-black text-foreground">Study Mode</h2>
            <p className="text-xs text-muted-foreground font-medium">Pomodoro · Session #{session + 1}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-border text-muted-foreground hover:text-foreground transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 80px)' }}>
          {/* Mode Toggle */}
          <div className="flex gap-2 bg-muted p-1 rounded-2xl border border-border">
            {(['work', 'break'] as const).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide font-semibold transition-all",
                  mode === m
                    ? m === 'work'
                      ? "bg-primary text-white shadow-sm"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === 'work' ? <Brain className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                {m === 'work' ? `Work (${WORK_MINS}m)` : `Break (${BREAK_MINS}m)`}
              </button>
            ))}
          </div>

          {/* SVG Timer Ring */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={mode === 'work' ? '#3B82F6' : '#10B981'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${mode === 'work' ? 'rgba(59,130,246,0.6)' : 'rgba(16,185,129,0.6)'})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-foreground tabular-nums">{mins}:{secs}</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide font-semibold mt-1">
                  {mode === 'work' ? 'Focus' : 'Rest'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="p-3 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRunning(r => !r)}
                className={cn(
                  "px-8 py-3 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all flex items-center gap-2",
                  mode === 'work'
                    ? "bg-primary hover:bg-blue-600 text-white shadow-sm hover:shadow-sm"
                    : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                )}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          {/* Task Checklist */}
          {feedback && feedback.todaysPlan.length > 0 && (
            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground">Today&apos;s Protocol</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-white/5 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-primary">{pct}%</span>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {feedback.todaysPlan.map((plan, i) => {
                  const done = checkedItems.includes(i);
                  return (
                    <div
                      key={i}
                      onClick={() => handleToggle(i)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted border-border hover:border-border"
                      )}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-primary block">{plan.hour}</span>
                        <p className={cn("text-xs font-medium leading-snug", done ? "text-muted-foreground line-through" : "text-foreground")}>{plan.task}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {pct === 100 && (
                <div className="mt-3 text-center text-emerald-400 text-xs font-black uppercase tracking-wide font-semibold">
                  🎯 Full Protocol Complete
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
