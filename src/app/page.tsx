"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InputForm } from "@/components/InputForm";
import { TodaysFocus } from "@/components/TodaysFocus";
import { saveFeedback, savePerformance, SSCPerformance, getHistory, getFeedbackByPerformanceId, MentorFeedback, getStreak, getStrictMode } from "@/lib/storage";
import { checkAndSyncBadges } from "@/lib/badges";
import { Crown } from "lucide-react";

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function Home() {
  const [lastPerf, setLastPerf] = useState<SSCPerformance | null>(null);
  const [lastFeedback, setLastFeedback] = useState<MentorFeedback | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const history = getHistory();
    if (history.length) {
      const last = history[history.length - 1];
      setLastPerf(last);
      setLastFeedback(getFeedbackByPerformanceId(last.id));
    }
    setStreak(getStreak());
    checkAndSyncBadges();
  }, []);

  const handleSubmit = async (data: Omit<SSCPerformance, "id" | "date">): Promise<string | void> => {
    try {
      const strictMode = getStrictMode();
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, strictMode }),
      });

      if (!response.ok) throw new Error("Failed connecting to Mentor");

      const mentorResponse = await response.json();
      const saved = savePerformance(data);
      saveFeedback({ ...mentorResponse, performanceId: saved.id });
      checkAndSyncBadges();
      return saved.id;
    } catch (error) {
      console.error(error);
      // Error handled inline by InputForm
    }
  };

  return (
    <div className="relative min-h-full bg-background text-foreground overflow-hidden font-sans flex flex-col">
      {/* Ambient Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary/[0.04] hidden pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 hidden pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center flex-1 max-w-2xl mx-auto w-full px-5 py-14 md:py-20 space-y-8">

        {/* Page Header */}
        <motion.div variants={itemVars} initial="hidden" animate="show" className="text-center space-y-3 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary mb-2">
            <Crown className="w-4 h-4" />
            AI Coaching Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Log Your Performance
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto font-medium">
            Enter your test data with brutal honesty. The mentor will dissect every number.
          </p>
        </motion.div>

        {/* Dynamic Staggered Container */}
        <motion.div 
          variants={containerVars} 
          initial="hidden" 
          animate="show" 
          className="w-full space-y-8"
        >
          {/* Today's Focus Panel */}
          {lastPerf && (
            <motion.div variants={itemVars} className="w-full">
              <TodaysFocus lastPerformance={lastPerf} lastFeedback={lastFeedback} streak={streak} />
            </motion.div>
          )}

          {/* Input Form */}
          <motion.div variants={itemVars} className="w-full">
            <InputForm onSubmit={handleSubmit} />
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
}
