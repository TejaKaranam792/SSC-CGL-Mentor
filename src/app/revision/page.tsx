"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Flame, Trophy, Zap, CheckCircle2, X } from "lucide-react";
import { TopicLogger } from "@/components/revision/TopicLogger";
import { RevisionList } from "@/components/revision/RevisionList";
import Link from "next/link";
import {
  getRevisions,
  getRevisionStreak,
  getBestRevisionStreak,
  updateBestRevisionStreak,
  completeRevision,
  RevisionEntry,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

/* ─── helpers ─────────────────────────────────────────────── */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* ─── Bulk-complete modal ─────────────────────────────────── */
interface BulkModalProps {
  pending: { entry: RevisionEntry; taskDay: 1 | 3 | 7 }[];
  onClose: () => void;
  onComplete: (entryId: string, day: 1 | 3 | 7) => void;
}

function BulkModal({ pending, onClose, onComplete }: BulkModalProps) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const key = (id: string, day: number) => `${id}-${day}`;

  const toggle = (entryId: string, day: 1 | 3 | 7) => {
    const k = key(entryId, day);
    if (done.has(k)) return; // can't un-complete
    onComplete(entryId, day);
    setDone((prev) => new Set([...prev, k]));
  };

  const SUBJECT_COLOR: Record<string, string> = {
    Quant: "text-indigo-400",
    Reasoning: "text-purple-400",
    English: "text-emerald-400",
    GS: "text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">Revise All Due Topics</p>
              <p className="text-[11px] text-muted-foreground">{pending.length} revision{pending.length !== 1 ? "s" : ""} pending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {pending.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              🎉 All revisions complete! Nothing pending.
            </p>
          ) : (
            pending.map(({ entry, taskDay }) => {
              const k = key(entry.id, taskDay);
              const isDone = done.has(k);
              return (
                <motion.div
                  key={k}
                  layout
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-all",
                    isDone
                      ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground truncate">{entry.topic}</p>
                    <p className={cn("text-xs font-bold", SUBJECT_COLOR[entry.subject] || "text-primary")}>
                      {entry.subject} · Day {taskDay}
                    </p>
                  </div>
                  <motion.button
                    whileHover={!isDone ? { scale: 1.05 } : {}}
                    whileTap={!isDone ? { scale: 0.95 } : {}}
                    onClick={() => !isDone && toggle(entry.id, taskDay)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all border shrink-0",
                      isDone
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isDone ? "Done" : "Mark Done"}
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {done.size}/{pending.length} completed
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-black hover:bg-blue-600 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function RevisionPage() {
  const [entries, setEntries]       = useState<RevisionEntry[]>([]);
  const [streak, setStreak]         = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showBulk, setShowBulk]     = useState(false);
  const [mounted, setMounted]       = useState(false);

  const refresh = useCallback(() => {
    const all = getRevisions();
    setEntries(all);
    const s = getRevisionStreak();
    setStreak(s);
    const b = updateBestRevisionStreak();
    setBestStreak(b);
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  /* derived stats */
  const today = todayStr();
  const allTasks = entries.flatMap((e) => e.revisions.map((r) => ({ entry: e, task: r })));
  const pendingToday = allTasks.filter(({ task }) => !task.completed && task.dueDate <= today);
  const totalRevisions = allTasks.filter(({ task }) => task.completed).length;

  /* retained topics: all 3 revisions done */
  const retainedCount = entries.filter((e) => e.revisions.every((r) => r.completed)).length;

  /* for the bulk modal */
  const bulkPending = pendingToday.map(({ entry, task }) => ({
    entry,
    taskDay: task.day as 1 | 3 | 7,
  }));

  const handleBulkComplete = (entryId: string, day: 1 | 3 | 7) => {
    const updated = completeRevision(entryId, day);
    setEntries(updated);
    refresh();
  };

  if (!mounted) return null;

  const itemVars = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/[0.04] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] rounded-full bg-emerald-900/10 pointer-events-none" />

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-5 py-8 sm:py-14 md:py-20 space-y-6 sm:space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <motion.div variants={itemVars} initial="hidden" animate="show" className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary">
            <Brain className="w-3.5 h-3.5" />
            Smart Revision Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            1 → 3 → 7 Retention System
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md font-medium">
            Log what you study. The system schedules Day&nbsp;1, Day&nbsp;3 and Day&nbsp;7 revisions
            automatically — so nothing slips through.
          </p>
        </motion.div>

        {/* ── Stat Cards ───────────────────────────────────── */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              icon: <Flame className="w-4 h-4 text-orange-400" />,
              label: "Current Streak",
              value: `🔥 ${streak}d`,
              color: "bg-orange-500/5 border-orange-500/15",
            },
            {
              icon: <Trophy className="w-4 h-4 text-yellow-400" />,
              label: "Best Streak",
              value: `🏆 ${bestStreak}d`,
              color: "bg-yellow-500/5 border-yellow-500/15",
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
              label: "Total Done",
              value: totalRevisions,
              color: "bg-emerald-500/5 border-emerald-500/15",
            },
            {
              icon: <Brain className="w-4 h-4 text-primary" />,
              label: "Retained",
              value: `🏆 ${retainedCount}`,
              color: "bg-primary/5 border-primary/15",
            },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={itemVars}
              className={cn("rounded-xl border p-4 flex flex-col gap-1.5", s.color)}
            >
              <div className="flex items-center gap-1.5">{s.icon}<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{s.label}</span></div>
              <span className="text-xl font-black text-foreground">{s.value}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Error Eliminator Promo ── */}
        <motion.div variants={itemVars}>
          <Link href="/eliminator" className="group block relative bg-[#150A0A] border border-rose-500/20 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl hover:border-rose-500/40 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/60 rounded-l-2xl group-hover:bg-rose-500 transition-colors" />
            <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10 pl-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 px-2 border border-rose-500/30 bg-rose-500/10 rounded-md text-[10px] font-black uppercase text-rose-400 tracking-[0.2em]">New Tool</div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground mb-1 group-hover:text-rose-400 transition-colors">AI Error Eliminator</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
                  Paste your downloaded test reports. AI will instantly explain your concept gaps and generate a brutal 10-question drill.
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-rose-500/30 bg-background text-rose-400 group-hover:bg-rose-500/10 group-hover:translate-x-1 transition-all">
                <Zap className="w-5 h-5 fill-rose-400" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Pending banner + Bulk Button ─────────────────── */}
        <AnimatePresence>
          {pendingToday.length > 0 && (
            <motion.div
              key="pending-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-5 py-3"
            >
              <span className="text-xl shrink-0">⚠️</span>
              <p className="flex-1 text-sm font-bold text-amber-300">
                You have <span className="text-amber-200">{pendingToday.length}</span> revision{pendingToday.length !== 1 ? "s" : ""} pending today.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowBulk(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black transition-all hover:bg-amber-500/30 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                Revise All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Topic Logger ─────────────────────────────────── */}
        <motion.div variants={itemVars} initial="hidden" animate="show">
          <TopicLogger onLogged={refresh} />
        </motion.div>

        {/* ── Revision Dashboard ───────────────────────────── */}
        <motion.div variants={itemVars} initial="hidden" animate="show">
          <RevisionList entries={entries} onUpdate={setEntries} />
        </motion.div>

      </main>

      {/* ── Bulk Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showBulk && (
          <BulkModal
            pending={bulkPending}
            onClose={() => { setShowBulk(false); refresh(); }}
            onComplete={handleBulkComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
