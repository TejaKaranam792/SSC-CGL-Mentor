"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Trash2 } from "lucide-react";
import { RevisionEntry, RevisionTask, completeRevision, deleteRevisionEntry } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DAY_LABEL: Record<number, string> = { 1: "Day 1", 3: "Day 3", 7: "Day 7" };

const SUBJECT_DOT: Record<string, string> = {
  Quant:     "bg-indigo-400",
  Reasoning: "bg-purple-400",
  English:   "bg-emerald-400",
  GS:        "bg-amber-400",
};

interface RevisionCardProps {
  entry: RevisionEntry;
  task: RevisionTask;
  context: "pending" | "upcoming" | "done";
  onUpdate: (updated: ReturnType<typeof completeRevision>) => void;
  onDelete: () => void;
}

function RevisionCard({ entry, task, context, onUpdate, onDelete }: RevisionCardProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = !task.completed && task.dueDate < today;

  const borderClass =
    task.completed     ? "border-emerald-500/20 bg-emerald-500/5"
    : isOverdue        ? "border-rose-500/30    bg-rose-500/5"
    : task.dueDate === today ? "border-amber-500/30 bg-amber-500/5"
    : "border-border bg-card";

  const daysUntil = Math.ceil((new Date(task.dueDate).getTime() - new Date(today).getTime()) / 86400000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn("rounded-xl border p-4 flex items-center gap-4 transition-all", borderClass)}
    >
      {/* Subject dot */}
      <div className={cn("w-2 h-2 rounded-full shrink-0", SUBJECT_DOT[entry.subject] || "bg-primary")} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-black text-foreground truncate">{entry.topic}</span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground shrink-0">
            {DAY_LABEL[task.day]}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
          <span className={cn("font-bold", SUBJECT_DOT[entry.subject]?.replace("bg-", "text-") || "text-primary")}>{entry.subject}</span>
          <span>·</span>
          {task.completed ? (
            <span className="text-emerald-400">Completed {task.completedDate}</span>
          ) : isOverdue ? (
            <span className="text-rose-400 font-black">Overdue — {Math.abs(daysUntil)}d late</span>
          ) : task.dueDate === today ? (
            <span className="text-amber-400 font-black flex items-center gap-1"><Clock className="w-3 h-3" /> Due Today</span>
          ) : (
            <span>Due in {daysUntil} day{daysUntil !== 1 ? "s" : ""} · {task.dueDate}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!task.completed && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate(completeRevision(entry.id, task.day))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-black transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </motion.button>
        )}
        {task.completed && (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

interface RevisionListProps {
  entries: RevisionEntry[];
  onUpdate: (updated: RevisionEntry[]) => void;
}

export function RevisionList({ entries, onUpdate }: RevisionListProps) {
  const today = new Date().toISOString().slice(0, 10);

  // Flatten all revision tasks into a unified list
  const allTasks = entries.flatMap(e =>
    e.revisions.map(r => ({ entry: e, task: r }))
  );

  const pending  = allTasks.filter(({ task }) => !task.completed && task.dueDate <= today);
  const upcoming = allTasks.filter(({ task }) => !task.completed && task.dueDate >  today);
  const done     = allTasks.filter(({ task }) => task.completed);

  const handleUpdate = (updated: RevisionEntry[]) => onUpdate(updated);
  const handleDelete = (id: string) => {
    deleteRevisionEntry(id);
    onUpdate(entries.filter(e => e.id !== id));
  };

  const todayDueCount = pending.filter(({ task }) => task.dueDate === today).length;
  const overdueCount  = pending.filter(({ task }) => task.dueDate < today).length;

  const Section = ({
    title, emoji, items, context, emptyMsg
  }: {
    title: string; emoji: string;
    items: typeof allTasks;
    context: "pending" | "upcoming" | "done";
    emptyMsg: string;
  }) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{emoji}</span>
        <h3 className="text-sm font-black text-foreground uppercase tracking-wide">{title}</h3>
        {items.length > 0 && (
          <span className="ml-auto text-xs font-black text-muted-foreground">{items.length}</span>
        )}
      </div>
      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground font-medium px-1"
          >
            {emptyMsg}
          </motion.p>
        ) : (
          <div className="space-y-2.5">
            {items.map(({ entry, task }) => (
              <RevisionCard
                key={`${entry.id}-${task.day}`}
                entry={entry}
                task={task}
                context={context}
                onUpdate={handleUpdate}
                onDelete={() => handleDelete(entry.id)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Notification banner */}
      {(todayDueCount > 0 || overdueCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "px-5 py-3 rounded-xl border flex items-center gap-3 text-sm font-bold",
            overdueCount > 0
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          )}
        >
          <span className="text-xl">{overdueCount > 0 ? "⚠️" : "🔔"}</span>
          <span>
            {overdueCount > 0
              ? `You have ${overdueCount} overdue revision${overdueCount !== 1 ? "s" : ""} — you are breaking the retention cycle!`
              : `${todayDueCount} revision${todayDueCount !== 1 ? "s" : ""} due today. Complete them now!`}
          </span>
        </motion.div>
      )}

      {/* Daily progress bar */}
      {(pending.length > 0 || done.length > 0) && (() => {
        const todayTotal = allTasks.filter(({ task }) => task.dueDate === today).length;
        const todayDone  = done.filter(({ task }) => task.dueDate === today || task.completedDate === today).length;
        const pct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;
        return todayTotal > 0 ? (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-foreground uppercase tracking-wide">Today's Progress</span>
              <span className="text-xs font-black text-primary">{todayDone}/{todayTotal} done</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
              />
            </div>
          </div>
        ) : null;
      })()}

      <Section title="Pending Revisions" emoji="🔴" items={pending}  context="pending"  emptyMsg="No pending revisions. You're ahead of schedule 🎉" />
      <Section title="Upcoming"           emoji="🟡" items={upcoming} context="upcoming" emptyMsg="No upcoming revisions scheduled yet." />
      <Section title="Completed"          emoji="🟢" items={done}     context="done"     emptyMsg="Complete a revision to see it here." />
    </div>
  );
}
