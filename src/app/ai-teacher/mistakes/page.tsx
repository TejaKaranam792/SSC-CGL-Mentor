"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Trash2, BrainCircuit, AlertOctagon, HelpCircle } from "lucide-react";
import Link from "next/link";
import { getMistakes, removeMistake, Mistake } from "@/lib/teacherStore";
import { cn } from "@/lib/utils";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [filter, setFilter] = useState<"all" | "concept" | "calculation" | "silly">("all");

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const handleDelete = (id: string) => {
    removeMistake(id);
    setMistakes(getMistakes());
  };

  const filtered = filter === "all" ? mistakes : mistakes.filter((m) => m.category === filter);

  const getCategoryTheme = (cat: string) => {
    if (cat === "concept") return { icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10" };
    if (cat === "calculation") return { icon: AlertOctagon, color: "text-orange-500", bg: "bg-orange-500/10" };
    return { icon: HelpCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" };
  };

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8">
      <main className="relative z-10 flex flex-col max-w-4xl mx-auto w-full space-y-6 mt-2 pb-10">
        <Link href="/ai-teacher" className="inline-flex items-center text-sm font-medium text-muted-foreground w-fit hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mistake Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1 mb-4">Revise your weak areas. The AI categorized these based on your input.</p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "concept", "calculation", "silly"] as const).map((tgt) => (
              <button
                key={tgt}
                onClick={() => setFilter(tgt)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border",
                  filter === tgt 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {tgt === "all" ? "All Mistakes" : tgt.charAt(0).toUpperCase() + tgt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 mt-10 text-center border-2 border-dashed border-border rounded-2xl">
            <h3 className="text-lg font-bold text-muted-foreground mb-1">No mistakes found here!</h3>
            <p className="text-sm text-muted-foreground opacity-70">Log some wrong answers from the practice sessions.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {filtered.map((m) => {
              const theme = getCategoryTheme(m.category);
              const CatIcon = theme.icon;

              return (
                <div key={m.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm relative group">
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove mistake"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", theme.bg, theme.color)}>
                      <CatIcon className="w-3 h-3" />
                      {m.category} Error
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase">
                      {m.subject} {m.topic ? `• ${m.topic}` : ""}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap pr-10 mb-3 text-foreground">
                    {m.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-900 dark:text-red-300">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-red-500/70 mb-1">Your Answer</span>
                      {m.userAnswer}
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-1">Correct Answer</span>
                      {m.correctAnswer}
                    </div>
                  </div>

                  {m.explanation && (
                    <div className="pt-3 border-t border-border">
                      <span className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Concept / Explanation</span>
                      <p className="text-sm opacity-90 whitespace-pre-wrap">{m.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
