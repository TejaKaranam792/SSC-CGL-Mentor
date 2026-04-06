"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, PlusCircle } from "lucide-react";
import { logStudiedTopic } from "@/lib/storage";
import { cn } from "@/lib/utils";

const SUBJECTS = ["Quant", "Reasoning", "English", "GS"] as const;
type Subject = typeof SUBJECTS[number];

const TOPIC_BANK: Record<Subject, string[]> = {
  Quant:     ["Number System", "Algebra", "Geometry", "Trigonometry", "Mensuration", "Data Interpretation", "Time & Work", "Speed & Distance", "Profit & Loss", "Percentages", "Ratio & Proportion", "Simple/Compound Interest"],
  Reasoning: ["Analogies", "Coding-Decoding", "Blood Relations", "Direction Sense", "Syllogism", "Series Completion", "Matrix", "Non-Verbal Reasoning", "Statement & Conclusion", "Classification"],
  English:   ["Reading Comprehension", "Error Detection", "Cloze Test", "Fill in Blanks", "Para Jumbles", "Synonyms/Antonyms", "Narration/Voice", "Idioms & Phrases", "Sentence Improvement", "Spelling", "Tenses", "Articles", "Prepositions"],
  GS:        ["History", "Geography", "Polity", "Physics", "Chemistry", "Biology", "Economy", "Current Affairs", "Static GK", "Computer Awareness"],
};

const SUBJECT_STYLES: Record<Subject, string> = {
  Quant:     "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  Reasoning: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  English:   "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  GS:        "bg-amber-500/10  border-amber-500/30  text-amber-400",
};

interface TopicLoggerProps {
  onLogged: () => void;
}

export function TopicLogger({ onLogged }: TopicLoggerProps) {
  const [subject, setSubject] = useState<Subject>("Quant");
  const [topic, setTopic]     = useState("");
  const [custom, setCustom]   = useState("");
  const [flash, setFlash]     = useState(false);

  const handleLog = () => {
    const finalTopic = topic === "__custom__" ? custom.trim() : topic.trim();
    if (!finalTopic) return;
    logStudiedTopic(finalTopic, subject);
    setFlash(true);
    setTopic("");
    setCustom("");
    setTimeout(() => { setFlash(false); onLogged(); }, 700);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <BookOpen className="w-4 h-4 text-emerald-400" />
        </div>
        <h2 className="text-sm font-black text-foreground uppercase tracking-wide">Log Today's Study</h2>
      </div>

      {/* Subject selector */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {SUBJECTS.map(s => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSubject(s); setTopic(""); }}
            className={cn(
              "py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
              subject === s
                ? SUBJECT_STYLES[s]
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Topic dropdown */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
          {TOPIC_BANK[subject].map(t => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTopic(topic === t ? "" : t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                topic === t
                  ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTopic("__custom__")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
              topic === "__custom__"
                ? "bg-primary/20 border-primary/40 text-primary shadow-sm"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            )}
          >
            + Custom
          </motion.button>
        </div>

        {topic === "__custom__" && (
          <motion.input
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            type="text"
            placeholder="Type topic name…"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLog()}
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 transition-colors"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleLog}
          disabled={flash || (!topic || (topic === "__custom__" && !custom.trim()))}
          className={cn(
            "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wide transition-all duration-300",
            flash
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-primary hover:bg-blue-600 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <PlusCircle className="w-4 h-4" />
          {flash ? "✅ Logged! Revisions scheduled..." : "I studied this today"}
        </motion.button>
      </div>
    </div>
  );
}
