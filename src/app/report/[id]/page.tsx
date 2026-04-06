"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MentorFeedback, SSCPerformance, getFeedbackByPerformanceId, getHistory } from "@/lib/storage";
import { MentorResponseCards } from "@/components/MentorResponseCards";
import { StudyModePanel } from "@/components/StudyModePanel";
import { ArrowLeft, BookOpen, Crown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState<MentorFeedback | null>(null);
  const [perf, setPerf]         = useState<SSCPerformance | null>(null);
  const [loading, setLoading]   = useState(true);
  const [studyOpen, setStudyOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      const id = params.id as string;
      const f = getFeedbackByPerformanceId(id);
      const p = getHistory().find(h => h.id === id) || null;
      setFeedback(f);
      setPerf(p);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary/50 border-t-[#3B82F6] animate-spin" />
    </div>
  );

  if (!feedback) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-6 text-center space-y-5">
      <Crown className="w-14 h-14 text-primary opacity-40" />
      <h1 className="text-2xl font-bold text-slate-400">Report Not Found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">We couldn&apos;t find this assessment in your local storage.</p>
      <button onClick={() => router.push('/')} className="px-6 py-3 bg-primary hover:bg-blue-600 rounded-2xl font-bold text-white shadow-sm text-sm transition-all">
        Return to Dashboard
      </button>
    </div>
  );

  const maxScore = perf?.testType === 'full' ? 200 : 50;
  const accuracy = perf ? Math.round((perf.totalScore / maxScore) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* Ambient */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/[0.03] hidden pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />

      {/* Study Mode Modal */}
      {studyOpen && <StudyModePanel feedback={feedback} onClose={() => setStudyOpen(false)} />}

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-5 pt-6 sm:pt-10">

        {/* Back + Actions Row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-bold text-sm tracking-wide group shrink-0">
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:block">Dashboard</span>
            <span className="xs:hidden">Back</span>
          </Link>
          <button
            onClick={() => setStudyOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-primary border border-transparent hover:bg-blue-600 rounded-2xl text-white font-bold text-sm transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Mode</span>
          </button>
        </div>

        {/* Report Header */}
        <header className="mb-10 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-border mb-4 uppercase">
            <Crown className="w-3 h-3" />
            AI Mentor Report
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">Post-Assessment Briefing</h1>

          {/* Test Context Banner */}
          {perf && (
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className={cn(
                "px-4 py-2 rounded-2xl border text-sm font-black",
                perf.testType === 'full'
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                  : "bg-primary/20 border-primary/40 text-primary"
              )}>
                {perf.testType === 'full' ? 'Full Mock' : `Sectional · ${perf.sectionalSubject?.toUpperCase()}`}
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-border rounded-2xl px-4 py-2">
                <span className="text-xl font-black text-foreground">{perf.totalScore}</span>
                <span className="text-muted-foreground text-sm font-bold">/ {maxScore}</span>
                <span className={cn(
                  "ml-2 text-sm font-black",
                  accuracy >= 75 ? "text-emerald-400" : accuracy >= 55 ? "text-primary" : "text-rose-400"
                )}>({accuracy}%)</span>
              </div>
              <div className="text-muted-foreground text-xs font-medium">
                {new Date(perf.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          )}
        </header>

        <MentorResponseCards feedback={feedback} />
      </main>
    </div>
  );
}
