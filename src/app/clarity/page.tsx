"use client";

import { WeightageChart } from "@/components/clarity/WeightageChart";
import { TrapAlerts } from "@/components/clarity/TrapAlerts";
import { SyllabusAccordion } from "@/components/clarity/SyllabusAccordion";
import { AIPersonalizer } from "@/components/clarity/AIPersonalizer";
import { Compass, BookOpen } from "lucide-react";

export default function ClarityHub() {
  return (
    <div className="relative min-h-full bg-background text-foreground font-sans pb-24 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/[0.03] hidden pointer-events-none" />

      <main className="relative z-10 max-w-5xl mx-auto px-5 py-10 md:py-14 space-y-12">
        
        {/* Page Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black tracking-[0.18em] text-emerald-400 uppercase">
            <Compass className="w-3.5 h-3.5" />
            Beginner Clarity Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Study Smart, Not Hard.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Don't study the entire syllabus blind. Use the <strong className="text-primary">ROI Engine</strong> below to know exactly which topics yield the highest marks for the least effort, and build your personalized 30-day starter roadmap.
          </p>
        </header>

        {/* Top Section: AI Path Finder */}
        <section>
          <AIPersonalizer />
        </section>

        {/* Warning: Traps */}
        <section>
          <TrapAlerts />
        </section>

        {/* Chart Visualization */}
        <section className="pt-6">
          <WeightageChart />
        </section>

        {/* Full Syllabus Interaction */}
        <section className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 border border-border bg-white/[0.03] rounded-xl text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">The Master Syllabus</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Explore subject-wise topics ranked by their core utility.</p>
            </div>
          </div>
          <SyllabusAccordion />
        </section>
      </main>
    </div>
  );
}
