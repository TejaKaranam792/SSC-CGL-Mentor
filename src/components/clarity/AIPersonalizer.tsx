"use client";

import { useState } from "react";
import { Loader2, ShieldAlert, Zap, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type RoadmapData = {
  title: string;
  pepTalk: string;
  startWithThese: string[];
  weeklyPlan: { week: string, focus: string }[];
  trapsToAvoid: string[];
};

export function AIPersonalizer() {
  const [level, setLevel] = useState('0-20');
  const [target, setTarget] = useState('130+');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/clarity/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, targetScore: target })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate your personalized roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary hidden pointer-events-none rounded-full" />
      
      <div className="p-6 md:p-8 relative z-10 space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary fill-[#3B82F6]" />
          <h2 className="text-xl font-black text-foreground">AI Expert Path Finder</h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          Tell us where you stand. The AI Mentor will analyze the syllabus mapping and generate a realistic, 30-day action plan focusing purely on maximizing marks and avoiding traps.
        </p>

        {/* Input Phase */}
        {!roadmap && (
          <div className="space-y-5 bg-muted border border-border p-5 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Current Mock Score</label>
                <select 
                  value={level} 
                  onChange={e => setLevel(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  <option value="0-20">0 - 20 (Absolute Beginner)</option>
                  <option value="20-50">20 - 50 (Basics Clear)</option>
                  <option value="50-80">50 - 80 (Intermediate)</option>
                  <option value="80+">80+ (Advanced)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Target Score</label>
                <select 
                  value={target} 
                  onChange={e => setTarget(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  <option value="120+">120+ (Cutoff Clearance)</option>
                  <option value="140+">140+ (Safe Zone)</option>
                  <option value="160+">160+ (Topper Zone)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold uppercase tracking-wide text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Explain My Path'}
            </button>
            
            {error && <p className="text-rose-400 text-xs font-bold text-center mt-3">{error}</p>}
          </div>
        )}

        {/* Results Phase */}
        {roadmap && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="border-l-2 border-primary/50 pl-4">
              <h3 className="text-lg font-black text-foreground mb-2">{roadmap.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">"{roadmap.pepTalk}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Day 1 Focus */}
              <div className="bg-muted border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wide font-semibold">Start Tomorrow With:</h4>
                </div>
                <ul className="space-y-2.5">
                  {roadmap.startWithThese.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                      <span className="text-emerald-400 font-black mt-0.5">{i+1}.</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traps */}
              <div className="bg-muted border border-rose-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wide font-semibold">Strictly Avoid:</h4>
                </div>
                <ul className="space-y-2.5">
                  {roadmap.trapsToAvoid.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                      <span className="text-rose-400 font-black mt-0.5">⊗</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Weekly Plan */}
            <div className="bg-muted border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-black text-primary uppercase tracking-wide font-semibold">30-Day Blueprint</h4>
              </div>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {roadmap.weeklyPlan.map((plan, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border border-border bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-background p-4 rounded-xl border border-border">
                      <span className="text-xs font-bold text-primary block mb-1">{plan.week}</span>
                      <p className="text-sm text-slate-400">{plan.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setRoadmap(null)} className="text-xs text-muted-foreground hover:text-foreground font-bold underline underline-offset-4 transition-colors">
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
