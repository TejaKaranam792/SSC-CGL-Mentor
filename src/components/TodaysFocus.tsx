"use client";

import { SSCPerformance, MentorFeedback } from "@/lib/storage";
import { Crown, Target, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TodaysFocusProps {
  lastPerformance: SSCPerformance | null;
  lastFeedback: MentorFeedback | null;
  streak: number;
}

export function TodaysFocus({ lastPerformance, lastFeedback, streak }: TodaysFocusProps) {
  if (!lastPerformance) return null;

  const topics = lastPerformance.weakTopics
    ? lastPerformance.weakTopics.split(',').map(t => t.trim()).filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
      {/* Gold ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary hidden rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <Crown className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground tracking-wide">Today&apos;s Intelligence Brief</h3>
            <p className="text-[11px] text-muted-foreground font-medium">Based on your last assessment</p>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-400">{streak}d</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        {/* Score Snapshot */}
        <div className="bg-muted rounded-2xl p-4 border border-border flex-shrink-0">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Last Score</div>
          <div className="text-3xl font-black text-primary leading-none">
            {lastPerformance.totalScore}
            <span className="text-base text-muted-foreground font-bold ml-1">
              /{lastPerformance.testType === 'full' ? '200' : '50'}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1.5 font-medium capitalize">
            {lastPerformance.testType === 'full' ? 'Full Mock' : `Sectional · ${lastPerformance.sectionalSubject}`}
          </div>
        </div>

        {/* Focus Area */}
        <div className="flex-1 space-y-3">
          {topics.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-rose-400" />
                Weak spots requiring attention
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topics.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-bold rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastFeedback?.mentorMessage && (
            <div className="bg-muted rounded-xl p-3 border border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-1.5">Mentor&apos;s last word</div>
              <p className="text-xs text-primary font-bold leading-relaxed line-clamp-2 italic">
                &quot;{lastFeedback.mentorMessage}&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border relative z-10">
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium flex-1">
          Log today&apos;s test to build your trajectory.
        </span>
        <Link href="/history" className="text-xs font-black text-primary hover:text-blue-600 transition-colors tracking-wide">
          View Analytics →
        </Link>
      </div>
    </div>
  );
}
