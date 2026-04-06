"use client";

import { ALL_BADGES, RARITY_STYLES, Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface BadgeDisplayProps {
  earnedIds: string[];
  compact?: boolean;
}

const RARITY_ORDER: Badge['rarity'][] = ['legendary', 'epic', 'rare', 'common'];

export function BadgeDisplay({ earnedIds, compact = false }: BadgeDisplayProps) {
  const sorted = [...ALL_BADGES].sort(
    (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
  );

  if (compact) {
    const earned = sorted.filter(b => earnedIds.includes(b.id)).slice(0, 5);
    return (
      <div className="flex items-center gap-2">
        {earned.map(badge => {
          const s = RARITY_STYLES[badge.rarity];
          return (
            <div
              key={badge.id}
              title={`${badge.name}: ${badge.desc}`}
              className={cn("w-8 h-8 rounded-full flex items-center justify-center text-base border", s.border, s.glow, "bg-[#1A1A26]")}
            >
              {badge.icon}
            </div>
          );
        })}
        {earnedIds.length > 5 && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-[#6A6A7A] bg-[#1A1A26] border border-white/10">
            +{earnedIds.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-[#12121A] border border-white/[0.06] rounded-2xl p-6 shadow-xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-black text-[#F0F0F8]">Achievement Vault</h3>
          <p className="text-xs text-[#6A6A7A] font-medium mt-0.5">
            {earnedIds.length}/{ALL_BADGES.length} badges earned
          </p>
        </div>
        <div className="text-2xl">{earnedIds.length >= ALL_BADGES.length ? '🏆' : '🔒'}</div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {sorted.map(badge => {
          const isEarned = earnedIds.includes(badge.id);
          const s = RARITY_STYLES[badge.rarity];
          return (
            <div
              key={badge.id}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                isEarned
                  ? cn("bg-[#1A1A26]", s.border, s.glow)
                  : "bg-[#0F0F17] border-white/[0.04] opacity-40 grayscale"
              )}
            >
              {!isEarned && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                  <Lock className="w-4 h-4 text-[#3A3A4A]" />
                </div>
              )}
              <span className={cn("text-2xl", !isEarned && "invisible")}>{badge.icon}</span>
              <div className="text-center">
                <div className="text-[11px] font-black text-[#F0F0F8] leading-tight">{badge.name}</div>
                {isEarned && (
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-wide font-semibold mt-0.5",
                    badge.rarity === 'legendary' ? 'text-[#3B82F6]' :
                    badge.rarity === 'epic' ? 'text-purple-400' :
                    badge.rarity === 'rare' ? 'text-indigo-400' : 'text-[#6A6A7A]'
                  )}>
                    {s.label}
                  </div>
                )}
              </div>
              {isEarned && (
                <div className="text-[10px] text-[#6A6A7A] text-center leading-tight hidden sm:block">{badge.desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
