"use client";

import { useEffect, useState } from "react";
import { getTopicStats, TopicStats } from "@/lib/readiness";
import { READINESS_TOPICS } from "@/lib/readiness-topics";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Zap, Trophy } from "lucide-react";
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStats(getTopicStats());
    setLoaded(true);
  }, []);

  if (!loaded || stats.length === 0) return null;

  const sorted = [...stats].sort((a, b) => b.attempts - a.attempts);
  const critical = sorted.filter(s => s.lastAccuracy < 50).slice(0, 3);
  const strong   = sorted.filter(s => s.lastAccuracy >= 80).slice(0, 3);

  return (
    <div className="space-y-5">
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
    </div>
  );
}
