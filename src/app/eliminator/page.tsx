"use client";

import { useState } from "react";
import { Crosshair, Zap, ArrowLeft, Send, CheckCircle2, XCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReadinessQuestion } from "@/lib/readiness";

type EliminatorResult = {
  explanation: string;
  questions: (ReadinessQuestion & { difficulty: string, correctAnswer?: string })[];
};

function EliminatorQuestion({ q, idx }: { q: ReadinessQuestion & { difficulty: string, correctAnswer?: string }; idx: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Difficulty styling mapping
  const difficultyMap: Record<string, { label: string, color: string }> = {
    easy: { label: 'Easy', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    medium: { label: 'Medium', color: 'text-primary bg-primary/10 border-primary/20' },
    hard: { label: 'Hard', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  };
  const diff = difficultyMap[q.difficulty?.toLowerCase()] || difficultyMap.medium;
  const options = q.options || [];

  const correctMatchIndex = options.findIndex(opt => opt === q.correctAnswer) !== -1 
    ? options.findIndex(opt => opt === q.correctAnswer)
    : (q.correctIndex ?? 0); // Fallback if schema provides numeric index instead of string
  
  // Try matching exact string first, if not use the correctIndex returned by AI
  const actualCorrectIndex = q.correctAnswer 
     ? options.findIndex(o => o.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) 
     : (q.correctIndex ?? 0);
     
  const finalCorrectIndex = actualCorrectIndex >= 0 ? actualCorrectIndex : correctMatchIndex;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-black text-white bg-white/10 px-2.5 py-1 rounded-md uppercase tracking-wide">
          Q{idx + 1}
        </span>
        <span className={cn("text-[10px] font-black uppercase tracking-wide border px-2 py-0.5 rounded", diff.color)}>
          {diff.label}
        </span>
      </div>
      <p className="text-foreground text-sm sm:text-base font-bold leading-relaxed mb-5">{q.question}</p>
      
      <div className="grid gap-2">
        {options.map((opt, i) => {
          const showResult = revealed;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => { setSelected(i); setRevealed(true); }}
              className={cn(
                "text-left flex items-start gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all duration-200",
                showResult && i === finalCorrectIndex ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" :
                showResult && selected === i && i !== finalCorrectIndex ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                !showResult && "bg-transparent border-border text-slate-400 hover:border-primary/50 hover:bg-white/[0.02] hover:text-foreground"
              )}>
              <div className="shrink-0 mt-0.5">
                {showResult && i === finalCorrectIndex ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                 showResult && selected === i && i !== finalCorrectIndex ? <XCircle className="w-4 h-4 text-rose-400" /> :
                 <div className="w-4 h-4 rounded-full border border-slate-600" />}
              </div>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
      
      {revealed && q.explanation && (
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-in fade-in duration-300">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wide block mb-1">Concept Trigger</span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function EliminatorPage() {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EliminatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/eliminator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate assignment");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans pb-24 overflow-x-hidden">
      {/* Ambient */}
      <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/[0.03] pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-14 space-y-8">
        
        {/* Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] sm:text-xs font-black tracking-[0.15em] text-rose-400 uppercase">
            <Crosshair className="w-3.5 h-3.5" />
            AI Error Eliminator
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Fix Concept Gaps <br className="hidden sm:block" />
            <span className="text-muted-foreground">Instantly.</span>
          </h1>
        </header>

        {!result && !loading ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-[#150A0A] border border-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-rose-500/40 rounded-l-2xl" />
              <label className="block text-sm font-black uppercase tracking-wide text-rose-400 mb-3">Paste Test Report Here</label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste the exact text from the downloaded AI Mentor report or Test results here..."
                className="w-full h-64 bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-rose-500/50 resize-none font-mono"
              />
              {error && <p className="text-rose-400 text-xs font-bold mt-3 border border-rose-500/20 bg-rose-500/10 p-2 rounded">{error}</p>}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!reportText.trim()}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary text-white font-black uppercase tracking-wide text-sm rounded-2xl transition-all shadow-sm"
            >
              <Zap className="w-4 h-4" /> Analyze & Generate Assignment
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-2xl border-4 border-primary/20 border-t-primary animate-spin relative z-10" />
            </div>
            <p className="text-muted-foreground font-black tracking-[0.1em] text-sm uppercase animate-pulse">Running Diagnostic Protocol</p>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 px-4 py-2 border border-border hover:border-primary/50 rounded-xl text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
            </button>

            <div className="space-y-8">
              {/* Concept Masterclass */}
              <div className="bg-card border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-foreground">The Fix</h3>
                </div>
                <div className="text-slate-300 font-medium text-sm leading-8 whitespace-pre-wrap">
                  {result.explanation}
                </div>
              </div>

              {/* Generated Assignment */}
              <div>
                <div className="flex items-center gap-3 mb-6 px-1">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                  <h3 className="text-xl font-black text-foreground">Assignment Protocol</h3>
                  <span className="ml-auto text-xs font-black px-2 py-1 bg-white/5 border border-white/10 rounded text-muted-foreground">10 Questions</span>
                </div>
                
                <div>
                  {result.questions.map((q, i) => (
                    <EliminatorQuestion key={i} q={q} idx={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

      </main>
    </div>
  );
}
