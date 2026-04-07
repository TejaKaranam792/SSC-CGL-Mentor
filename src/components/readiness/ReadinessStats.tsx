"use client";

import { useEffect, useState } from "react";
import { getTopicStats, TopicStats, getReadinessSessions, ReadinessSession, getMasteredTopics } from "@/lib/readiness";
import { READINESS_TOPICS } from "@/lib/readiness-topics";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Zap, Trophy, History, ArrowRight, BarChart3, Activity } from "lucide-react";
import Link from "next/link";

function AccuracyBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-emerald-400' : value >= 50 ? 'bg-primary' : 'bg-rose-400';
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 bg-white/[0.05] rounded-full h-1.5">
        <div className={cn("h-1.5 rounded-full transition-all duration-700", color)} style={{ width: `${value}%` }} />
      </div>
      <span className={cn("text-xs font-black tabular-nums shrink-0",
        value >= 80 ? 'text-emerald-400' : value >= 50 ? 'text-primary' : 'text-rose-400')}>
        {value}%
      </span>
    </div>
  );
}

export function ReadinessStats() {
  const [stats, setStats] = useState<TopicStats[]>([]);
  const [sessions, setSessions] = useState<ReadinessSession[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStats(getTopicStats());
    setSessions(getReadinessSessions().filter(s => s.analysis).sort((a,b) => new Date(b.completedAt ?? b.startedAt).getTime() - new Date(a.completedAt ?? a.startedAt).getTime()));
    setMasteredCount(getMasteredTopics().length);
    setLoaded(true);
  }, []);

  if (!loaded || stats.length === 0) return null;

  const sorted = [...stats].sort((a, b) => b.attempts - a.attempts);
  const critical = sorted.filter(s => s.lastAccuracy < 50).slice(0, 3);
  const strong   = sorted.filter(s => s.lastAccuracy >= 80).slice(0, 3);

  const totalTests = sessions.length;
  const averageAccuracy = totalTests > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.analysis!.accuracy, 0) / totalTests)
    : 0;

  return (
    <div className="space-y-5">
      {/* ── Lifetime Aggregate Header ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-2">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-12 h-12 text-primary" /></div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wide mb-1">Overall Accuracy</p>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-2xl sm:text-3xl font-black", averageAccuracy >= 80 ? 'text-emerald-400' : averageAccuracy >= 50 ? 'text-primary' : 'text-rose-400')}>{averageAccuracy}%</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 className="w-12 h-12 text-indigo-400" /></div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wide mb-1">Tests Taken</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{totalTests}</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col justify-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-12 h-12 text-amber-400" /></div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wide mb-1">Mastered</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{masteredCount}</span>
          </div>
        </div>
      </div>
      {/* ── Critical topics ── */}
      {critical.length > 0 && (
        <div className="bg-card border border-rose-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-wide font-semibold">Critical Topics</h3>
            <span className="ml-auto text-[11px] text-muted-foreground">needs urgent work</span>
          </div>
          <div className="space-y-3">
            {critical.map(s => {
              const cfg = READINESS_TOPICS[s.subject as keyof typeof READINESS_TOPICS];
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-base shrink-0">{cfg?.icon ?? '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-xs font-bold text-foreground truncate">{s.microTopicLabel}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{s.attempts} attempt{s.attempts > 1 ? 's' : ''}</span>
                    </div>
                    <AccuracyBar value={s.lastAccuracy} />
                  </div>
                  <Link
                    href={`/readiness?subject=${s.subject}&topic=${s.microTopic}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] font-black text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
                  >
                    <Zap className="w-3 h-3" /> Drill
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Strong topics ── */}
      {strong.length > 0 && (
        <div className="bg-card border border-emerald-500/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wide font-semibold">Strong Topics</h3>
          </div>
          <div className="space-y-3">
            {strong.map(s => {
              const cfg = READINESS_TOPICS[s.subject as keyof typeof READINESS_TOPICS];
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-base shrink-0">{cfg?.icon ?? '📚'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-xs font-bold text-foreground truncate">{s.microTopicLabel}</span>
                      {s.mastered && <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">Mastered</span>}
                    </div>
                    <AccuracyBar value={s.bestAccuracy} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Full topic table ── */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">All Topic History</h3>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {sorted.map(s => {
            const cfg = READINESS_TOPICS[s.subject as keyof typeof READINESS_TOPICS];
            const trend = s.lastAccuracy > s.bestAccuracy * 0.9 ? 'up' : s.lastAccuracy < 50 ? 'down' : 'flat';
            return (
              <div key={s.key} className="flex items-center gap-3 p-2.5 bg-muted rounded-xl border border-border hover:border-border transition-all">
                <span className="shrink-0 text-sm">{cfg?.icon ?? '📚'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-foreground truncate">{s.microTopicLabel}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {trend === 'up'   && <TrendingUp  className="w-3 h-3 text-emerald-400" />}
                      {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400"    />}
                      {trend === 'flat' && <Minus        className="w-3 h-3 text-muted-foreground"   />}
                      <span className="text-[10px] text-muted-foreground">×{s.attempts}</span>
                    </div>
                  </div>
                  <AccuracyBar value={s.lastAccuracy} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Past Tests Log ── */}
      {sessions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 mt-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide font-black">Recent Past Tests</h3>
          </div>
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sessions.map(s => {
              const cfg = READINESS_TOPICS[s.subject as keyof typeof READINESS_TOPICS];
              return (
                <Link
                  href={`/readiness/results/${s.id}`}
                  key={s.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 text-lg">{cfg?.icon ?? '📝'}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{s.microTopicLabel}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-border font-bold uppercase tracking-wide text-muted-foreground">{s.mode}</span>
                      </div>
                      <span className="text-xs text-muted-foreground block">
                        {new Date(s.completedAt ?? s.startedAt).toLocaleDateString()} • {s.questionCount} Questions
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                     <span className={cn("text-lg font-black shrink-0", 
                        s.analysis!.accuracy >= 80 ? 'text-emerald-400' : s.analysis!.accuracy >= 50 ? 'text-primary' : 'text-rose-400'
                     )}>
                        {s.analysis!.accuracy}%
                     </span>
                     <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
