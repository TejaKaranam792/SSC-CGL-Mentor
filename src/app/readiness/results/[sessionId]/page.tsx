"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReadinessSession, ReadinessSession } from "@/lib/readiness";
import { ResultAnalysis } from "@/components/readiness/ResultAnalysis";
import { READINESS_TOPICS } from "@/lib/readiness-topics";
import { ArrowLeft, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<ReadinessSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getReadinessSession(sessionId);
    setSession(s);
    setLoading(false);
    if (!s) setTimeout(() => router.replace('/readiness'), 4000);
  }, [sessionId, router]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary/50 border-t-[#3B82F6] animate-spin" />
    </div>
  );

  if (!session || !session.analysis) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 space-y-4">
      <Crown className="w-12 h-12 text-primary" />
      <p className="text-[#5A5A7A] text-lg font-bold">Report not found. Redirecting…</p>
      <Link href="/readiness" className="text-primary text-sm font-bold hover:underline">Go to Readiness Hub</Link>
    </div>
  );

  const subjectCfg = READINESS_TOPICS[session.subject as keyof typeof READINESS_TOPICS];
  const accuracy   = session.analysis.accuracy;

  return (
    <div className="min-h-full bg-background text-foreground font-sans pb-24">
      {/* Ambient */}
      <div className="fixed top-[-15%] right-[-8%] w-[45%] h-[45%] rounded-full bg-primary/[0.03] hidden pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%]  w-[40%] h-[40%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-5 pt-8 space-y-6">

        {/* Back */}
        <Link href="/readiness" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold uppercase tracking-wide font-semibold group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          New Test
        </Link>

        {/* Report header */}
        <header className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary mb-3">
            <Zap className="w-3 h-3" />
            Readiness Report
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {session.microTopicLabel}
          </h1>

          {/* Context chips */}
          <div className="flex flex-wrap items-center gap-2">
            {subjectCfg && (
              <div className={cn("px-3 py-1.5 rounded-xl border text-xs font-black", subjectCfg.bgClass, subjectCfg.borderClass, subjectCfg.textClass)}>
                {subjectCfg.icon} {subjectCfg.shortLabel}
              </div>
            )}
            <div className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-black",
              session.mode === 'exam'
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            )}>
              {session.mode === 'exam' ? '⏱ Exam Mode' : '📖 Practice Mode'}
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-black",
              accuracy >= 80
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : accuracy >= 50
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            )}>
              {accuracy}% accuracy
            </div>
            <div className="text-muted-foreground text-xs font-medium ml-1">
              {new Date(session.completedAt ?? session.startedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
          </div>
        </header>

        <ResultAnalysis session={session} />
      </main>
    </div>
  );
}
