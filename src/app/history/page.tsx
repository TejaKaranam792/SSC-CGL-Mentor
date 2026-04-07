"use client";

import { useEffect, useState } from "react";
import {
  getHistory, SSCPerformance, getStreak, getBestStreak, getGoal, saveGoal,
  exportToCSV, getMistakeDistribution, updateBestStreak
} from "@/lib/storage";
import { checkAndSyncBadges } from "@/lib/badges";
import { ProgressTracker } from "@/components/ProgressTracker";
import { WeaknessIntel } from "@/components/WeaknessIntel";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight, BarChart2, Clock, Flame, Trophy, Download,
  PenLine, Check, PieChartIcon, Zap
} from "lucide-react";
import Link from "next/link";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { motion } from "framer-motion";

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function HistoryPage() {
  const [history, setHistory]         = useState<SSCPerformance[]>([]);
  const [isLoaded, setIsLoaded]       = useState(false);
  const [streak, setStreak]           = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);
  const [goal, setGoal]               = useState<number | null>(null);
  const [goalInput, setGoalInput]     = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [mistakeDist, setMistakeDist] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const hist = getHistory();
    updateBestStreak();
    setHistory(hist);
    setStreak(getStreak());
    setBestStreak(getBestStreak());
    setGoal(getGoal());
    setMistakeDist(getMistakeDistribution());
    setEarnedBadges(checkAndSyncBadges());
    setIsLoaded(true);
  }, []);

  const reversed = [...history].reverse();

  const handleSaveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0 && val <= 200) {
      saveGoal(val);
      setGoal(val);
      setEditingGoal(false);
      setGoalInput("");
    }
  };

  // Loading skeleton
  if (!isLoaded) return (
    <div className="relative min-h-full bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-5 py-12 space-y-6">
        <div className="h-10 w-64 bg-white/[0.04] rounded-2xl animate-pulse" />
        <div className="h-72 bg-white/[0.04] rounded-[2rem] animate-pulse" />
        <div className="h-48 bg-white/[0.04] rounded-[2rem] animate-pulse" />
      </div>
    </div>
  );

  const fullMocks = history.filter(h => h.testType === 'full');
  const sectionMocks = history.filter(h => h.testType === 'sectional');
  const bestScore = fullMocks.length ? Math.max(...fullMocks.map(h => h.totalScore)) : 0;
  const gapToGoal = goal && fullMocks.length ? Math.max(0, goal - (fullMocks.at(-1)?.totalScore ?? 0)) : null;

  return (
    <div className="relative min-h-full bg-background text-foreground overflow-x-hidden font-sans">
      {/* Orbs */}
      <div className="absolute top-[-8%] right-[-8%] w-[40%] h-[40%] rounded-full bg-primary/[0.03] hidden pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-8 md:py-16 space-y-6 md:space-y-8">

        {/* ── Page Header ───────────────────────────── */}
        <header className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <BarChart2 className="w-5 h-5 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">Analytics &amp; History</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium pl-7">Your performance trajectory and coaching intelligence.</p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Export */}
              <button onClick={exportToCSV} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/[0.04] border border-border rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all text-sm font-bold">
                <Download className="w-4 h-4" />
                <span className="hidden xs:block">Export CSV</span>
                <span className="xs:hidden">Export</span>
              </button>

              {/* Goal Setter */}
              {editingGoal ? (
                <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2 flex-1 min-w-0">
                  <PenLine className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="number" autoFocus value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveGoal()}
                    placeholder="Target score (max 200)"
                    className="bg-transparent text-sm font-bold text-foreground w-full min-w-0 outline-none placeholder:text-[#3A3A4A]"
                  />
                  <button onClick={handleSaveGoal} className="text-primary hover:text-blue-600 shrink-0">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setEditingGoal(true); setGoalInput(goal?.toString() || ''); }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary rounded-2xl text-white hover:bg-blue-600 transition-all text-sm font-bold shadow-sm">
                  <PenLine className="w-4 h-4" />
                  {goal ? `Goal: ${goal}` : 'Set Goal'}
                </button>
              )}
            </div>
          )}
        </header>

        {history.length > 0 ? (
          <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
            {/* ── Stat Strip ─────────────────────────── */}
            <motion.div variants={itemVars} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {[
                {
                  title: 'Streak', value: streak, unit: 'days',
                  icon: <Flame className={cn("w-4 h-4", streak > 0 ? "text-amber-400" : "text-muted-foreground")} />,
                  highlight: streak > 0,
                  extra: <span className="text-[10px] text-amber-400/60 font-bold">active</span>
                },
                {
                  title: 'Best Streak', value: bestStreak, unit: 'days',
                  icon: <Trophy className="w-4 h-4 text-primary" />,
                  highlight: false,
                  extra: null
                },
                { title: 'Total Tests', value: history.length, unit: '', icon: <BarChart2 className="w-4 h-4 text-indigo-400" />, highlight: false, extra: null },
                { title: 'Full Mocks', value: fullMocks.length, unit: '', icon: <BarChart2 className="w-4 h-4 text-primary" />, highlight: false, extra: null },
                { title: 'Best Score', value: bestScore, unit: '/200', icon: <Trophy className="w-4 h-4 text-emerald-400" />, highlight: false, extra: null },
                {
                  title: 'Gap to Goal', value: gapToGoal !== null ? gapToGoal : '—', unit: gapToGoal !== null ? 'pts' : '',
                  icon: <PenLine className="w-4 h-4 text-primary" />, highlight: false,
                  extra: <span className="text-[10px] text-muted-foreground">to reach {goal ?? '—'}</span>
                },
              ].map((s, i) => (
                <motion.div variants={itemVars} key={i} className={cn(
                  "bg-card border rounded-2xl p-4 flex flex-col gap-1",
                  s.highlight ? "border-amber-500/25 bg-amber-500/[0.03]" : "border-border"
                )}>
                  <div className="flex items-center gap-1.5">{s.icon}<span className="text-xs font-semibold text-muted-foreground">{s.title}</span></div>
                  <div className="flex items-end gap-1">
                    <span className={cn("text-2xl font-black", s.highlight ? "text-amber-400" : "text-foreground")}>{s.value}</span>
                    {s.unit && <span className="text-xs text-muted-foreground font-bold pb-0.5">{s.unit}</span>}
                  </div>
                  {s.extra}
                </motion.div>
              ))}
            </motion.div>

            {/* ── Progress Graph ─────────────────────── */}
            <motion.div variants={itemVars}>
              <ProgressTracker history={history} goal={goal} />
            </motion.div>

            {/* ── Weakness Intel ─────────────────────── */}
            <motion.div variants={itemVars}>
              <WeaknessIntel history={history} />
            </motion.div>

            {/* ── Error Eliminator Promo ── */}
            <motion.div variants={itemVars}>
              <Link href="/eliminator" className="group block relative bg-[#150A0A] border border-rose-500/20 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl hover:border-rose-500/40 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/60 rounded-l-2xl group-hover:bg-rose-500 transition-colors" />
                <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-rose-500/5 to-transparent pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10 pl-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 px-2 border border-rose-500/30 bg-rose-500/10 rounded-md text-[10px] font-black uppercase text-rose-400 tracking-[0.2em]">Eliminate Mistakes</div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground mb-1 group-hover:text-rose-400 transition-colors">AI Error Eliminator</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
                      Transform these weaknesses into strengths. Paste your test reports into the AI Eliminator to get immediate concept fixes and custom drills.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-rose-500/30 bg-background text-rose-400 group-hover:bg-rose-500/10 group-hover:translate-x-1 transition-all">
                    <Zap className="w-5 h-5 fill-rose-400" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ── Charts Row ─────────────────────────── */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Mistake Distribution Pie */}
              {mistakeDist.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-5">
                    <PieChartIcon className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold">Mistake Distribution</h3>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={mistakeDist} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={4} strokeWidth={0}>
                          {mistakeDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} opacity={0.85} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#12121A', borderColor: 'rgba(59,130,246,0.2)', borderRadius: '12px', color: '#F0F0F8', padding: '8px 12px' }}
                          formatter={(v, n) => [v, n]}
                        />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6A6A7A', paddingTop: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Badges compact */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold">Achievement Vault</h3>
                  <span className="ml-auto text-[11px] text-muted-foreground">{earnedBadges.length}/9 earned</span>
                </div>
                <div className="flex-1">
                  <BadgeDisplay earnedIds={earnedBadges} />
                </div>
              </div>
            </motion.div>

            {/* ── Assessment Log ─────────────────────── */}
            <motion.div variants={itemVars} className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-2xl">
              <h3 className="text-sm font-black text-foreground mb-5 flex items-center gap-2.5 uppercase tracking-wide font-semibold">
                <Clock className="w-4 h-4 text-primary" />
                Assessment Log
              </h3>
              <div className="space-y-2.5">
                {reversed.map(perf => (
                  <Link href={`/report/${perf.id}`} key={perf.id} className="block group">
                    <div className="bg-background border border-border rounded-2xl p-3 sm:p-4 flex items-center justify-between group-hover:border-primary/50 group-hover:bg-card transition-all duration-200 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-xl bg-white/[0.04] border border-border items-center justify-center text-xs font-black text-muted-foreground">
                          {perf.testType === "full" ? "FM" : "S"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className={cn("text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-lg whitespace-nowrap",
                              perf.testType === "full" ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20" : "bg-primary/20 text-primary border-primary/40")}>
                              {perf.testType === "full" ? "Full Mock" : `Sect · ${perf.sectionalSubject?.toUpperCase()}`}
                            </span>
                            <span className="text-muted-foreground text-[11px] whitespace-nowrap">
                              {new Date(perf.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            <span className="text-[#A0A0B0] font-medium">{perf.weakTopics || "—"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-black text-foreground">{perf.totalScore}</div>
                          <div className="text-[10px] text-muted-foreground font-bold">/ {perf.testType === "full" ? 200 : 50}</div>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="show" variants={containerVars} className="flex flex-col items-center justify-center min-h-[55vh] text-center space-y-5">
            <motion.div variants={itemVars}><BarChart2 className="w-16 h-16 text-[#2A2A3A]" /></motion.div>
            <motion.h2 variants={itemVars} className="text-2xl font-bold text-[#5A5A7A]">No Assessments Yet</motion.h2>
            <motion.p variants={itemVars} className="text-[#3A3A5A] max-w-sm text-sm">Log your first mock test to start building your performance data.</motion.p>
            <motion.div variants={itemVars}>
              <Link href="/" className="mt-4 px-6 py-3 bg-primary hover:bg-blue-600 rounded-2xl text-primary-foreground font-black text-sm uppercase tracking-wide font-semibold transition-all shadow-sm block w-max mx-auto">
                Log First Assessment
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
