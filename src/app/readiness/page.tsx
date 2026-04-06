"use client";

import { TopicSelector } from "@/components/readiness/TopicSelector";
import { ReadinessStats } from "@/components/readiness/ReadinessStats";
import { TestConfig, saveTestConfig } from "@/lib/readiness";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";
import { Suspense } from "react";

function ReadinessHub() {
  const router = useRouter();
  const params = useSearchParams();

  const handleStart = (config: TestConfig) => {
    saveTestConfig(config);
    router.push('/readiness/test');
  };

  // Support ?subject=&topic= quick-start from ReadinessStats links
  const preSubject = params.get('subject') ?? undefined;
  const preTopic   = params.get('topic')   ?? undefined;
  void preSubject; void preTopic; // will be used by TopicSelector via URL in future

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans overflow-x-hidden">
      {/* Ambient */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/[0.04] hidden pointer-events-none" />

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-5 py-8 sm:py-14 md:py-18 space-y-8 sm:space-y-10">

        {/* Page Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary">
            <Zap className="w-3.5 h-3.5" />
            Section Readiness Engine
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            Know Where You Stand
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl font-medium">
            Pick any micro-topic, take a PYQ-style drill, and get a deep readiness verdict — including exact concept gaps and a laser-targeted improvement plan.
          </p>
        </header>

        {/* Topic Selector Card */}
        <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent" />
          <TopicSelector onStart={handleStart} />
        </div>

        {/* Topic Intelligence */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-4 tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Your Topic Intelligence
          </h2>
          <ReadinessStats />
        </section>
      </main>
    </div>
  );
}

export default function ReadinessPage() {
  return (
    <Suspense>
      <ReadinessHub />
    </Suspense>
  );
}
