"use client";

import { getSubjectsData, Subject } from "@/lib/syllabus-data";
import { useState, useEffect } from "react";
import { ChevronDown, Zap, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TopicIntelligencePanel } from "./TopicIntelligencePanel";
import { getIntelCache, TopicIntelData } from "@/lib/storage";

const SUBJECT_STYLES: Record<Subject, { color: string, bg: string }> = {
  Quant:     { color: "text-indigo-400", bg: "bg-indigo-500/10" },
  Reasoning: { color: "text-purple-400", bg: "bg-purple-500/10" },
  English:   { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  GS:        { color: "text-amber-400",  bg: "bg-amber-500/10" }
};

export function SyllabusAccordion() {
  const [openSubject, setOpenSubject] = useState<Subject | null>('Quant');
  const [filterMode, setFilterMode] = useState<'all' | 'high_roi' | 'easy' | 'no_traps'>('all');
  const [activeIntel, setActiveIntel] = useState<{subject: string, topic: string} | null>(null);
  const [intelCache, setIntelCache] = useState<Record<string, TopicIntelData>>({});

  useEffect(() => {
    setIntelCache(getIntelCache());
  }, [activeIntel]); // Refresh cache when modal closes

  const data = getSubjectsData();

  const getFilteredTopics = (topics: any[]) => {
    switch (filterMode) {
      case 'high_roi': return topics.filter(t => t.roiLevel === 'High');
      case 'easy':     return topics.filter(t => t.scoringEase >= 7);
      case 'no_traps': return topics.filter(t => !t.isTrap);
      default:         return topics;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mr-2">Filters:</span>
        {(['all', 'high_roi', 'easy', 'no_traps'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              filterMode === mode
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-transparent border-border text-muted-foreground hover:bg-white/[0.05]"
            )}
          >
            {mode === 'all' ? 'All Topics' : 
             mode === 'high_roi' ? '🔥 High ROI Only' : 
             mode === 'easy' ? '🎯 High Scoring Ease' : '✅ Hide Traps'}
          </button>
        ))}
      </div>

      {/* ── Accordion ── */}
      <div className="space-y-3">
        {data.map(({ name, topics }) => {
          const isOpen = openSubject === name;
          const styles = SUBJECT_STYLES[name as Subject];
          const filtered = getFilteredTopics(topics);

          if (filtered.length === 0) return null;

          return (
            <div key={name} className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenSubject(isOpen ? null : name)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("px-2 py-1 rounded text-xs font-black", styles.bg, styles.color)}>
                    {name}
                  </span>
                  <span className="text-sm font-bold text-foreground">{filtered.length} Topics</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border mt-2">
                  {filtered.map(t => {
                    const roiTheme = t.roiLevel === 'High' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                     t.roiLevel === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                     'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    const diffColors = t.timeRequired <= 4 ? 'text-emerald-400' : t.timeRequired <= 7 ? 'text-amber-400' : 'text-rose-400';

                    return (
                      <div key={t.id} className="p-4 rounded-xl border border-border bg-background">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-black text-foreground">{t.topicLabel}</h4>
                              {intelCache[t.topicLabel]?.status === 'understood' && (
                                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </div>
                            <span className={cn("inline-flex px-2 py-0.5 rounded text-[10px] font-black tracking-wide font-semibold border", roiTheme)}>
                              {t.roiLevel} ROI
                            </span>
                          </div>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); setActiveIntel({ subject: name, topic: t.topicLabel }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-wide transition-colors shadow-sm"
                          >
                            <Zap className="w-3 h-3 fill-primary text-primary" /> Learn Fast
                          </motion.button>
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 h-10 line-clamp-2">
                          {t.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <div className="text-[10px] uppercase tracking-wide font-semibold font-bold text-muted-foreground mb-0.5">Weightage</div>
                            <div className="text-xs font-black text-foreground">{t.avgQuestions} Qs</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wide font-semibold font-bold text-muted-foreground mb-0.5">Scoring Ease</div>
                            <div className="text-xs font-black text-foreground">{t.scoringEase}/10</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wide font-semibold font-bold text-muted-foreground mb-0.5">Time to Learn</div>
                            <div className={cn("text-xs font-black", diffColors)}>{t.timeRequired}/10</div>
                          </div>
                        </div>
                        
                        {t.isTrap && (
                          <div className="mt-3 px-2 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-[11px] text-rose-300 font-bold">
                            ⚠️ Time Trap: Low output for high effort
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeIntel && (
        <TopicIntelligencePanel
          subject={activeIntel.subject}
          topic={activeIntel.topic}
          onClose={() => setActiveIntel(null)}
        />
      )}
    </div>
  );
}
