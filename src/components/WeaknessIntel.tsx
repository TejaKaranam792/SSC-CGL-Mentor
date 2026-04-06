"use client";

import { getWeakTopicFrequency } from "@/lib/storage";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface WeaknessIntelProps {
  history: { weakTopics: string }[];
}

function getPriority(count: number, max: number): { label: string; color: string; bg: string; border: string } {
  const ratio = count / max;
  if (ratio >= 0.6 || count >= 3) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  if (ratio >= 0.35 || count >= 2) return { label: 'High', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
  return { label: 'Medium', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' };
}

export function WeaknessIntel({ history }: WeaknessIntelProps) {
  const freq = useMemo(() => {
    const f: Record<string, number> = {};
    history.forEach(h => {
      (h.weakTopics || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        f[t] = (f[t] || 0) + 1;
      });
    });
    return f;
  }, [history]);

  const sorted = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  if (!sorted.length) return null;

  const maxCount = sorted[0][1];
  const critical = sorted.filter(([, c]) => c >= 3 || c / maxCount >= 0.6);

  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 hidden rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-400" />
            Weakness Intelligence
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Topics that keep appearing in your tests</p>
        </div>
        {critical.length > 0 && (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-black text-red-400">{critical.length} Critical</span>
          </div>
        )}
      </div>

      {/* Topic Heatmap */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {sorted.map(([topic, count]) => {
          const priority = getPriority(count, maxCount);
          const intensity = count / maxCount;
          return (
            <div
              key={topic}
              className={cn("flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200", priority.bg, priority.border)}
              style={{ opacity: 0.5 + intensity * 0.5 }}
            >
              <div className={cn("text-xs font-black", priority.color)}>{topic}</div>
              <div className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                priority.bg, priority.color, "border", priority.border
              )}>
                ×{count}
              </div>
              {count >= 3 && <AlertTriangle className="w-2.5 h-2.5 text-red-400" />}
            </div>
          );
        })}
      </div>

      {/* Priority Legend */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border relative z-10">
        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide font-semibold">Priority:</span>
        {[
          { label: 'Critical', color: 'text-red-400',     bg: 'bg-red-500/10',    border: 'border-red-500/30'   },
          { label: 'High',     color: 'text-primary',   bg: 'bg-primary', border: 'border-primary/50' },
          { label: 'Medium',   color: 'text-indigo-400',  bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
        ].map(p => (
          <div key={p.label} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold", p.bg, p.border, p.color)}>
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
