"use client";

import { useState } from "react";
import { READINESS_TOPICS, SUBJECTS, DIFFICULTY_META, type Subject, type Difficulty } from "@/lib/readiness-topics";
import { type TestConfig } from "@/lib/readiness";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Zap, Clock, BookOpen, ChevronRight, Search } from "lucide-react";

interface TopicSelectorProps {
  onStart: (config: TestConfig) => void;
}

const Q_OPTIONS = [5, 10, 15] as const;

export function TopicSelector({ onStart }: TopicSelectorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [subject, setSubject]     = useState<Subject | null>(null);
  const [microTopic, setMicroTopic] = useState<string | null>(null);
  const [mode, setMode]           = useState<'practice' | 'exam'>('practice');
  const [qCount, setQCount]       = useState<5 | 10 | 15>(10);
  const [search, setSearch]       = useState('');

  const subjectConfig = subject ? READINESS_TOPICS[subject] : null;
  const selectedTopic = subjectConfig?.topics.find(t => t.id === microTopic);

  const filteredTopics = subjectConfig?.topics.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleStart = () => {
    if (!subject || !microTopic || !subjectConfig || !selectedTopic) return;
    onStart({
      subject,
      subjectLabel: subjectConfig.label,
      microTopic,
      microTopicLabel: selectedTopic.label,
      difficulty: selectedTopic.difficulty,
      mode,
      questionCount: qCount,
    });
  };

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
              step > s
                ? "bg-primary/20 border border-primary/40 text-primary"
                : step === s
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white/5 border border-border text-muted-foreground"
            )}>
              {step > s ? '✓' : s}
            </div>
            <span className={cn("text-xs font-bold hidden sm:block",
              step === s ? "text-foreground" : "text-muted-foreground")}>
              {s === 1 ? 'Subject' : s === 2 ? 'Micro-Topic' : 'Configure'}
            </span>
            {s < 3 && <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Subject ── */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-4">
          <div>
            <h2 className="text-xl font-black text-foreground">Choose a Subject</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Select the section you want to drill today.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBJECTS.map(sub => {
              const cfg = READINESS_TOPICS[sub];
              const isSelected = subject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => { setSubject(sub); setMicroTopic(null); setSearch(''); }}
                  className={cn(
                    "relative text-left p-5 rounded-2xl border transition-all duration-300 group overflow-hidden",
                    isSelected
                      ? `${cfg.bgClass} ${cfg.borderClass} shadow-sm`
                      : "bg-muted border-border hover:border-border"
                  )}
                >
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl transition-all duration-300"
                    style={{ backgroundColor: isSelected ? cfg.accentColor : 'transparent' }} />
                  <div className="text-2xl mb-2">{cfg.icon}</div>
                  <div className={cn("text-base font-black mb-0.5",
                    isSelected ? cfg.textClass : "text-foreground")}>
                    {cfg.shortLabel}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{cfg.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-2">{cfg.topics.length} topics</div>
                </button>
              );
            })}
          </div>
          <button
            disabled={!subject}
            onClick={() => setStep(2)}
            className={cn(
              "w-full py-3.5 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2",
              subject
                ? "bg-primary hover:bg-blue-600 text-white shadow-sm hover:-translate-y-0.5"
                : "bg-white/5 text-[#3A3A4A] cursor-not-allowed"
            )}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 2: Micro Topic ── */}
      {step === 2 && subjectConfig && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground">Choose a Topic</h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                <span className={cn("font-bold", subjectConfig.textClass)}>{subjectConfig.shortLabel}</span>
                {' '}— select the micro-topic to drill.
              </p>
            </div>
            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wide font-semibold">
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-[#3A3A4A] outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredTopics.map(topic => {
              const isSelected = microTopic === topic.id;
              const diff = DIFFICULTY_META[topic.difficulty as Difficulty];
              return (
                <button
                  key={topic.id}
                  onClick={() => setMicroTopic(topic.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200 text-left group",
                    isSelected
                      ? `${subjectConfig.bgClass} ${subjectConfig.borderClass} shadow-sm`
                      : "bg-muted border-border hover:border-border"
                  )}
                >
                  <span className={cn("text-sm font-bold", isSelected ? subjectConfig.textClass : "text-foreground")}>
                    {topic.label}
                  </span>
                  <span className={cn("text-[10px] font-black uppercase tracking-wider shrink-0", diff.color)}>
                    {diff.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            disabled={!microTopic}
            onClick={() => setStep(3)}
            className={cn(
              "w-full py-3.5 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2",
              microTopic
                ? "bg-primary hover:bg-blue-600 text-white shadow-sm hover:-translate-y-0.5"
                : "bg-white/5 text-[#3A3A4A] cursor-not-allowed"
            )}
          >
            Configure Test <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── STEP 3: Configure ── */}
      {step === 3 && selectedTopic && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground">Configure Test</h2>
              <p className="text-sm text-muted-foreground mt-1">
                <span className={cn("font-bold", subjectConfig?.textClass)}>{subjectConfig?.shortLabel}</span>
                {' → '}
                <span className="text-foreground font-bold">{selectedTopic.label}</span>
              </p>
            </div>
            <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wide font-semibold">
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">Number of Questions</label>
            <div className="flex gap-2">
              {Q_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setQCount(n)}
                  className={cn(
                    "flex-1 py-3.5 rounded-2xl border font-black text-sm transition-all",
                    qCount === n
                      ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {n}Q
                  <span className="block text-[11px] font-medium text-inherit opacity-60 mt-0.5">
                    {n} min
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">Test Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('practice')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all",
                  mode === 'practice'
                    ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                    : "bg-muted border-border hover:border-border"
                )}
              >
                <BookOpen className={cn("w-5 h-5 mb-2", mode === 'practice' ? "text-emerald-400" : "text-muted-foreground")} />
                <div className={cn("text-sm font-black", mode === 'practice' ? "text-emerald-400" : "text-foreground")}>
                  Practice
                </div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">No timer · Learn</div>
              </button>
              <button
                onClick={() => setMode('exam')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all",
                  mode === 'exam'
                    ? "bg-rose-500/10 border-rose-500/40 shadow-sm"
                    : "bg-muted border-border hover:border-border"
                )}
              >
                <Clock className={cn("w-5 h-5 mb-2", mode === 'exam' ? "text-rose-400" : "text-muted-foreground")} />
                <div className={cn("text-sm font-black", mode === 'exam' ? "text-rose-400" : "text-foreground")}>
                  Exam
                </div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{qCount} min timer · Pressure</div>
              </button>
            </div>
          </div>

          {/* Summary + Start */}
          <div className="bg-muted border border-border rounded-2xl p-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground font-medium">
              {qCount} questions · {mode === 'exam' ? `${qCount} min timer` : 'No timer'}
            </div>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm rounded-2xl transition-all shadow-sm hover:shadow-sm hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Start Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
