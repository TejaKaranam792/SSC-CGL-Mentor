"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Brain, AlertTriangle, Target, Lightbulb, CheckCircle2, Bookmark, BookmarkCheck, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { TopicIntelData, getIntelForTopic, saveIntelToCache, updateIntelStatus } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface TopicIntelligencePanelProps {
  topic: string;
  subject: string;
  onClose: () => void;
}

export function TopicIntelligencePanel({ topic, subject, onClose }: TopicIntelligencePanelProps) {
  const [data, setData] = useState<TopicIntelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPractice, setOpenPractice] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // 1. Check local cache
      const cached = getIntelForTopic(topic);
      if (cached) {
        setData(cached);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from AI
      try {
        const res = await fetch("/api/intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, subject }),
        });

        if (!res.ok) throw new Error("Failed to fetch topic intelligence.");
        
        const intelResult = await res.json();
        
        const fullData: TopicIntelData = {
          topic,
          subject,
          ...intelResult,
          status: 'none'
        };

        saveIntelToCache(topic, fullData);
        setData(fullData);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [topic, subject]);

  const handleStatusUpdate = (status: 'understood' | 'revise_later' | 'none') => {
    if (!data) return;
    const newData = { ...data, status };
    setData(newData);
    updateIntelStatus(topic, status);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl h-full bg-card border-l border-border shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/5 bg-background/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">
                  {subject}
                </span>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Topic Intelligence
                </span>
              </div>
              <h2 className="text-2xl font-black text-foreground">{topic}</h2>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-bold animate-pulse">Extracting shortcuts from AI Mentor...</p>
              </div>
            ) : error || !data ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold">
                {error}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-6"
              >
                {/* Overview */}
                <div className="bg-muted p-4 rounded-2xl border border-border">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wide mb-2">Quick Overview</h3>
                  <p className="text-sm text-foreground leading-relaxed font-medium">{data.overview}</p>
                </div>

                {/* Grid Layout for compact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Core Rules */}
                  <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                    <h3 className="flex items-center gap-2 text-sm font-black text-primary mb-3">
                      <Brain className="w-4 h-4" /> Core Rules
                    </h3>
                    <ul className="space-y-2">
                      {data.coreRules.map((rule, idx) => (
                        <li key={idx} className="text-xs text-foreground font-medium flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shortcuts */}
                  <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl">
                    <h3 className="flex items-center gap-2 text-sm font-black text-amber-500 mb-3">
                      <Zap className="w-4 h-4" /> Shortcuts & Tricks
                    </h3>
                    <ul className="space-y-2">
                      {data.shortcuts.map((shortcut, idx) => (
                        <li key={idx} className="text-xs text-amber-100 font-medium flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">⚡</span>
                          {shortcut}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Traps */}
                <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl">
                  <h3 className="flex items-center gap-2 text-sm font-black text-rose-500 mb-3">
                    <AlertTriangle className="w-4 h-4" /> Common Traps
                  </h3>
                  <ul className="space-y-2">
                    {data.traps.map((trap, idx) => (
                      <li key={idx} className="text-xs text-rose-100 font-medium flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">⚠️</span>
                        {trap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strategy */}
                  <div className="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl">
                    <h3 className="flex items-center gap-2 text-sm font-black text-indigo-400 mb-3">
                      <Target className="w-4 h-4" /> Exam Strategy
                    </h3>
                    <ul className="space-y-2">
                      {data.examStrategy.map((strat, idx) => (
                        <li key={idx} className="text-xs text-indigo-100 font-medium flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">»</span>
                          {strat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hacks */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl">
                    <h3 className="flex items-center gap-2 text-sm font-black text-emerald-400 mb-3">
                      <Lightbulb className="w-4 h-4" /> Memory Hacks
                    </h3>
                    <ul className="space-y-2">
                      {data.memoryHacks.map((hack, idx) => (
                        <li key={idx} className="text-xs text-emerald-100 font-medium flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">💡</span>
                          {hack}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mini Practice */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Mini Practice Focus
                  </h3>
                  <div className="space-y-3">
                    {data.miniPractice.map((q, idx) => {
                      const isOpen = openPractice === idx;
                      return (
                        <div key={idx} className="bg-muted border border-border rounded-xl overflow-hidden">
                          <button 
                            onClick={() => setOpenPractice(isOpen ? null : idx)}
                            className="w-full text-left p-4 flex items-start justify-between hover:bg-white/[0.02] transition-colors"
                          >
                            <span className="text-sm font-semibold text-foreground flex-1 pr-4">{q.question}</span>
                            {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 border-t border-border mt-2 bg-primary/5">
                                  <div className="text-xs font-black text-primary mb-1 mt-3">Answer: {q.answer}</div>
                                  <div className="text-xs text-muted-foreground font-medium leading-relaxed">{q.explanation}</div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </div>
          
          {/* Footer Actions */}
          {!isLoading && data && (
            <div className="p-4 border-t border-border bg-background grid grid-cols-2 gap-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('revise_later')}
                className={cn(
                  "py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all border",
                  data.status === 'revise_later'
                    ? "bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-sm"
                    : "bg-muted text-muted-foreground border-border hover:bg-white/5"
                )}
              >
                <Bookmark className="w-4 h-4" /> Revise Later
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('understood')}
                className={cn(
                  "py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all border",
                  data.status === 'understood'
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm"
                    : "bg-primary text-white border-primary hover:bg-blue-600 shadow-sm"
                )}
              >
                <BookmarkCheck className="w-4 h-4" /> {data.status === 'understood' ? 'Understood' : 'Mark Understood'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
