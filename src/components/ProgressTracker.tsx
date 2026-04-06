"use client";

import { SSCPerformance } from "@/lib/storage";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, LineChart, Line } from 'recharts';
import { Target, TrendingUp, TrendingDown, Minus, BarChart2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  history: SSCPerformance[];
  goal: number | null;
}

type Tab = 'score' | 'accuracy';

export function ProgressTracker({ history, goal }: ProgressTrackerProps) {
  const [filter, setFilter] = useState<'full' | 'sectional'>('full');
  const [tab, setTab] = useState<Tab>('score');

  if (!history?.length) return null;

  const filtered = history.filter(h => h.testType === filter);
  const maxScore = filter === 'full' ? 200 : 50;
  const data = filtered.slice(-15).map(h => ({
    name: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.totalScore,
    accuracy: Math.round((h.totalScore / maxScore) * 100),
  }));

  const latest = filtered.at(-1)?.totalScore ?? 0;
  const prev   = filtered.at(-2)?.totalScore ?? null;
  const avg    = filtered.length ? Math.round(filtered.reduce((s, h) => s + h.totalScore, 0) / filtered.length) : 0;
  const best   = filtered.length ? Math.max(...filtered.map(h => h.totalScore)) : 0;
  const delta  = prev !== null ? latest - prev : null;
  const goalLine = goal !== null && filter === 'full' ? goal : null;

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#12121A', borderColor: 'rgba(59,130,246,0.2)', borderRadius: '14px', color: '#F0F0F8', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', padding: '10px 14px' },
    itemStyle: { color: '#3B82F6', fontWeight: '900', fontSize: '15px' },
    labelStyle: { color: '#6A6A7A', fontSize: '11px', marginBottom: '4px' },
  };

  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-60 h-60 bg-primary/[0.03] hidden rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-5 relative z-10">
        <div>
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 mb-3">
            <BarChart2 className="w-5 h-5 text-primary" />
            Performance Trajectory
          </h2>
          {/* Filter + Tab pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5 bg-muted border border-border p-1 rounded-xl">
              {(['full', 'sectional'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                  filter === f ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>
                  {f === 'full' ? 'Full Mocks' : 'Sectional'}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 bg-muted border border-border p-1 rounded-xl">
              {[{ id: 'score', label: 'Score' }, { id: 'accuracy', label: 'Accuracy %' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as Tab)} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                  tab === t.id ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/30" : "text-muted-foreground hover:text-foreground"
                )}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {/* Latest + delta */}
            <div className="bg-background border border-border rounded-2xl p-4 min-w-[90px] shadow-inner">
              <span className="block text-[10px] text-muted-foreground font-black uppercase tracking-wide font-semibold mb-1">Latest</span>
              <div className="flex items-end gap-1.5">
                <span className="text-2xl font-black text-foreground">{latest}</span>
                {delta !== null && (
                  <span className={cn("text-xs font-black pb-0.5 flex items-center gap-0.5",
                    delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-muted-foreground')}>
                    {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-4 min-w-[90px] shadow-inner">
              <span className="block text-[10px] text-muted-foreground font-black uppercase tracking-wide font-semibold mb-1">Average</span>
              <span className="text-2xl font-black text-muted-foreground">{avg}</span>
            </div>
            <div className="bg-background border border-border rounded-2xl p-4 min-w-[90px] shadow-inner">
              <span className="block text-[10px] text-primary font-black uppercase tracking-wide font-semibold mb-1">Best</span>
              <span className="text-2xl font-black text-primary">{best}</span>
            </div>
            {goalLine && (
              <div className="bg-background border border-border rounded-2xl p-4 min-w-[90px] shadow-inner">
                <span className="block text-[10px] text-primary font-black uppercase tracking-wide font-semibold mb-1">Goal</span>
                <span className="text-2xl font-black text-primary">{goalLine}</span>
                <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                  <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${Math.min((latest / goalLine) * 100, 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {tab === 'score' ? (
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.04} />
                <XAxis dataKey="name" stroke="#6A6A7A" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis stroke="#6A6A7A" fontSize={10} tickLine={false} axisLine={false} domain={[0, maxScore]} />
                <Tooltip {...tooltipStyle} />
                {filter === 'full' && <ReferenceLine y={130} stroke="#EF4444" strokeDasharray="5 4" strokeOpacity={0.4} label={{ value: 'Cutoff', position: 'insideTopRight', fill: '#EF4444', fontSize: 9, fontWeight: 700 }} />}
                {goalLine && <ReferenceLine y={goalLine} stroke="#3B82F6" strokeDasharray="4 3" strokeOpacity={0.6} label={{ value: `Goal`, position: 'insideTopRight', fill: '#3B82F6', fontSize: 9, fontWeight: 700, dy: -14 }} />}
                <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#goldGrad)"
                  activeDot={{ r: 6, fill: '#3B82F6', stroke: '#12121A', strokeWidth: 3, filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.8))' }} />
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.04} />
                <XAxis dataKey="name" stroke="#6A6A7A" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis stroke="#6A6A7A" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
                <ReferenceLine y={75} stroke="#10B981" strokeDasharray="4 3" strokeOpacity={0.5} label={{ value: 'Good ≥75%', position: 'insideTopRight', fill: '#10B981', fontSize: 9, fontWeight: 700 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#818cf8" strokeWidth={3} dot={false}
                  activeDot={{ r: 6, fill: '#818cf8', stroke: '#12121A', strokeWidth: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm italic">
          No {filter} mocks logged yet.
        </div>
      )}
    </div>
  );
}
