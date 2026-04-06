"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SSCPerformance } from "@/lib/storage";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Zap, Brain, Clock, Crosshair } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── SSC CGL Topic Bank ───────────────────────────────────────────────────────
const TOPIC_BANK: Record<string, string[]> = {
  quant:     ['Number System', 'Algebra', 'Geometry', 'Trigonometry', 'Mensuration', 'Data Interpretation', 'Time & Work', 'Speed & Distance', 'Profit & Loss', 'Percentages', 'Ratio & Proportion', 'Simple/Compound Interest'],
  reasoning: ['Analogies', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Series Completion', 'Matrix', 'Non-Verbal Reasoning', 'Statement & Conclusion', 'Classification'],
  english:   ['Reading Comprehension', 'Error Detection', 'Cloze Test', 'Fill in Blanks', 'Para Jumbles', 'Synonyms/Antonyms', 'Narration/Voice', 'Idioms & Phrases', 'Sentence Improvement', 'Spelling'],
  gs:        ['History', 'Geography', 'Polity', 'Physics', 'Chemistry', 'Biology', 'Economy', 'Current Affairs', 'Static GK', 'Computer Awareness'],
};
const ALL_TOPICS = [...new Set(Object.values(TOPIC_BANK).flat())];

const MISTAKE_OPTIONS = [
  { value: 'concept',     label: 'Concept Gap',      sub: "Didn't know the trick/formula", icon: Brain,     color: 'indigo' },
  { value: 'calculation', label: 'Calculation Error', sub: 'Silly mistakes in execution',   icon: Zap,       color: 'amber'  },
  { value: 'time',        label: 'Time Pressure',     sub: 'Rushed and choked under clock', icon: Clock,     color: 'orange' },
  { value: 'guess',       label: 'Wild Guessing',     sub: 'Negative marking impact',       icon: Crosshair, color: 'rose'   },
];

const colorMap: Record<string, string> = {
  indigo: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 shadow-sm',
  amber: 'border-primary/40 bg-primary/20 text-primary shadow-sm',
  orange: 'border-orange-500/50 bg-orange-500/10 text-orange-300  shadow-sm',
  rose:   'border-rose-500/50   bg-rose-500/10   text-rose-300    shadow-sm',
};

type FormData = Omit<SSCPerformance, 'id' | 'date'>;

function SliderInput({
  label, name, value, max, onChange,
}: { label: string; name: string; value: number; max: number; onChange: (name: string, val: number) => void }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide font-semibold">{label}</label>
        <span className="text-xl font-black text-foreground">{value}<span className="text-sm text-muted-foreground font-bold">/{max}</span></span>
      </div>
      <input
        type="range" min={0} max={max} step={0.5} value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        style={{ background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${pct}%, rgba(255,255,255,0.07) ${pct}%, rgba(255,255,255,0.07) 100%)` }}
        className="w-full h-[5px] rounded-full outline-none"
      />
    </div>
  );
}

export function InputForm({
  onSubmit,
}: { onSubmit: (data: FormData) => Promise<string | void> }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<FormData>({
    testType: 'full',
    totalScore: 0,
    quantScore: 0,
    reasoningScore: 0,
    englishScore: 0,
    gsScore: 0,
    weakTopics: '',
    mistakeTypes: 'concept',
    timeManagementIssue: false,
    timeManagementDesc: '',
  });

  const updateField = useCallback((name: string, val: unknown) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  }, []);

  const handleSlider = useCallback((name: string, val: number) => updateField(name, val), [updateField]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      next.has(topic) ? next.delete(topic) : next.add(topic);
      updateField('weakTopics', Array.from(next).join(', '));
      return next;
    });
  };

  const visibleTopics = formData.testType === 'full'
    ? ALL_TOPICS
    : TOPIC_BANK[formData.sectionalSubject || 'quant'] || ALL_TOPICS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);
    const id = await onSubmit({ ...formData, weakTopics: Array.from(selectedTopics).join(', ') || formData.weakTopics });
    if (id) {
      router.push(`/report/${id}`);
    } else {
      setIsLoading(false);
      setSubmitError("AI Mentor couldn't be reached. Check your API key and try again.");
    }
  };

  const maxTotal = formData.testType === 'full' ? 200 : 50;

  return (
    <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />

      {/* Step Indicator */}
      <div className="px-6 sm:px-8 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                step === s
                  ? "bg-primary text-white shadow-sm"
                  : step > s
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-white/5 text-muted-foreground border border-border"
              )}>
                {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
              </div>
              <span className={cn("text-xs font-bold hidden sm:block", step === s ? "text-foreground" : "text-muted-foreground")}>
                {s === 1 ? 'Assessment Type' : 'Performance Data'}
              </span>
              {s === 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
            </div>
          ))}
          {step === 2 && (
            <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 uppercase tracking-wide font-semibold">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}
        </div>
      </div>

      {/* ── STEP 1: ASSESSMENT TYPE ────────────────────────────────── */}
      {step === 1 && (
        <div className="px-6 sm:px-8 pb-8 space-y-6 animate-in slide-in-from-left-4 duration-300">
          <div>
            <h2 className="text-xl font-black text-foreground mb-1">Select Assessment</h2>
            <p className="text-sm text-muted-foreground font-medium">What kind of test did you take today?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'full', title: 'Full Length Mock', sub: 'All 4 sections · 100 Qs · 200 marks', badge: 'Standard' },
              { type: 'sectional', title: 'Sectional Mock', sub: 'Single subject · 25 Qs · 50 marks', badge: 'Focus' },
            ].map(({ type, title, sub, badge }) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('testType', type)}
                className={cn(
                  "relative text-left p-6 rounded-2xl border transition-all duration-300 group",
                  formData.testType === type
                    ? "bg-primary/10 border-primary/30 shadow-sm relative overflow-hidden"
                    : "bg-muted border-border hover:border-border"
                )}
              >
                {formData.testType === type && (
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                )}
                
                <span className={cn(
                  "absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border z-10",
                  formData.testType === type ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/5 border-border text-muted-foreground"
                )}>{badge}</span>
                <h3 className={cn("text-base font-bold mb-1.5 relative z-10", formData.testType === type ? "text-primary" : "text-foreground")}>
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium relative z-10">{sub}</p>
              </button>
            ))}
          </div>

          {formData.testType === 'sectional' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-semibold text-muted-foreground mb-3">Select Subject</label>
              <div className="grid grid-cols-4 gap-2">
                {(['quant', 'reasoning', 'english', 'gs'] as const).map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => updateField('sectionalSubject', sub)}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border",
                      formData.sectionalSubject === sub
                        ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground hover:border-border"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full mt-4 py-4 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-sm hover:-translate-y-0.5 group"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ── STEP 2: PERFORMANCE DATA ───────────────────────────────── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 space-y-7 animate-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-xl font-black text-foreground mb-1">Performance Data</h2>
            <p className="text-sm text-muted-foreground font-medium">Be honest. The mentor sees everything.</p>
          </div>

          {/* Total Score Slider */}
          <div className="bg-muted rounded-2xl p-5 border border-border">
            <SliderInput label="Total Score" name="totalScore" value={formData.totalScore} max={maxTotal} onChange={handleSlider} />
          </div>

          {/* Section Scores (Full Mock only) */}
          {formData.testType === 'full' && (
            <div className="bg-muted rounded-2xl p-5 border border-border space-y-5">
              <p className="text-sm font-semibold text-muted-foreground">Section Breakdown</p>
              {[
                { label: 'Quant',          name: 'quantScore'      as const },
                { label: 'Reasoning',      name: 'reasoningScore'  as const },
                { label: 'English',        name: 'englishScore'    as const },
                { label: 'General Studies',name: 'gsScore'         as const },
              ].map(f => (
                <SliderInput key={f.name} label={f.label} name={f.name} value={(formData[f.name] as number) ?? 0} max={50} onChange={handleSlider} />
              ))}
            </div>
          )}

          {/* Weak Topic Chips */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              Weak Topics <span className="normal-case text-primary font-bold ml-1">({selectedTopics.size} selected)</span>
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {visibleTopics.map(topic => {
                const sel = selectedTopics.has(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200",
                      sel
                        ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                        : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            {selectedTopics.size === 0 && (
              <input
                type="text"
                placeholder="Or type topics manually: e.g. Algebra, Polity..."
                value={formData.weakTopics}
                onChange={e => updateField('weakTopics', e.target.value)}
                className="mt-3 w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-[#3A3A4A] focus:border-primary/50 transition-colors"
              />
            )}
          </div>

          {/* Mistake Type Cards */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Primary Mistake Category</p>
            <div className="grid grid-cols-2 gap-2">
              {MISTAKE_OPTIONS.map(({ value, label, sub, icon: Icon, color }) => {
                const active = formData.mistakeTypes === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField('mistakeTypes', value)}
                    className={cn(
                      "text-left p-3.5 rounded-xl border transition-all duration-200",
                      active ? colorMap[color] : "bg-muted border-border hover:border-border"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mb-1.5", active ? "" : "text-muted-foreground")} />
                    <div className={cn("text-xs font-black leading-tight", active ? "" : "text-foreground")}>{label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-tight">{sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Management */}
          <div className="bg-muted rounded-2xl p-5 border border-border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "relative w-10 h-6 rounded-full border transition-all duration-300",
                formData.timeManagementIssue
                  ? "bg-primary border-primary/50"
                  : "bg-white/5 border-border"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow",
                  formData.timeManagementIssue
                    ? "left-[18px] bg-primary shadow-sm"
                    : "left-0.5 bg-[#6A6A7A]"
                )} />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.timeManagementIssue}
                  onChange={e => updateField('timeManagementIssue', e.target.checked)}
                />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Time Management Issue?</div>
                <div className="text-xs text-muted-foreground">I ran out of time or rushed sections</div>
              </div>
            </label>
            {formData.timeManagementIssue && (
              <textarea
                className="mt-4 w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-[#3A3A4A] resize-none h-20 focus:border-primary/50 transition-colors animate-in fade-in duration-200"
                placeholder="Detail the issue (e.g. Spent 40 min on Quant, couldn't finish GS)"
                value={formData.timeManagementDesc}
                onChange={e => updateField('timeManagementDesc', e.target.value)}
              />
            )}
          </div>

          {/* Error Banner */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-sm">
              <span className="text-red-400 font-black block mb-0.5">⚠ Connection Failed</span>
              <span className="text-red-300/80">{submitError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 rounded-2xl font-black tracking-widest text-sm uppercase transition-all duration-200 flex items-center justify-center gap-3",
              isLoading
                ? "bg-primary/50 text-white/50 cursor-not-allowed"
                : "bg-primary hover:bg-blue-600 text-white shadow-sm hover:shadow-sm hover:-translate-y-0.5"
            )}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'AI is analyzing…' : submitError ? 'Retry Mentor Review' : 'Submit for Mentor Review'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
