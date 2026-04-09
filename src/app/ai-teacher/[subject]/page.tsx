"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Zap, BookOpen, PenTool } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InteractiveSession } from "@/components/teacher/InteractiveSession";

const subjectData: Record<string, { title: string; modes: { id: string; label: string; aiMode: "concept" | "practice"; icon: any; placeholder?: string }[] }> = {
  quant: {
    title: "Quantitative Aptitude",
    modes: [
      { id: "concept", label: "Concept + Shortcut", aiMode: "concept", icon: BookOpen, placeholder: "e.g. Percentages, Time & Work" },
      { id: "practice", label: "Speed Practice", aiMode: "practice", icon: Zap, placeholder: "e.g. Geometry, Number System" },
    ]
  },
  reasoning: {
    title: "Reasoning",
    modes: [
      { id: "concept", label: "Pattern Recognition", aiMode: "concept", icon: BookOpen, placeholder: "e.g. Number Series, Analogy" },
      { id: "practice", label: "Speed Practice", aiMode: "practice", icon: Zap, placeholder: "e.g. Syllogism, Blood Relations" },
    ]
  },
  english: {
    title: "English Comprehension",
    modes: [
      { id: "concept", label: "Grammar & Root Words", aiMode: "concept", icon: BookOpen, placeholder: "e.g. Tenses, Root 'chron'" },
      { id: "practice", label: "Error Detection Practice", aiMode: "practice", icon: PenTool, placeholder: "e.g. Prepositions, Subject-Verb Agreement" },
    ]
  },
  gk: {
    title: "General Awareness",
    modes: [
      { id: "concept", label: "Static GK / CA Insights", aiMode: "concept", icon: BookOpen, placeholder: "e.g. Mughal Empire, Latest Index Rankings" },
      { id: "practice", label: "MCQ Practice", aiMode: "practice", icon: Zap, placeholder: "e.g. Polity Articles, Biology" },
    ]
  }
};

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const resolvedParams = use(params);
  const subjectKey = resolvedParams.subject;
  const data = subjectData[subjectKey];
  
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  if (!data) return <div className="p-8 text-center">Subject not found.</div>;

  const activeModeData = data.modes.find((m) => m.id === selectedMode);

  const startSession = () => {
    if (!topic.trim()) return;
    setSessionActive(true);
  };

  if (sessionActive && activeModeData) {
    return (
      <InteractiveSession 
        subjectKey={subjectKey}
        subjectTitle={data.title}
        modeLabel={activeModeData.label}
        aiMode={activeModeData.aiMode}
        topic={topic.trim()}
        onBack={() => setSessionActive(false)}
      />
    );
  }

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8">
      <main className="relative z-10 flex flex-col max-w-2xl mx-auto w-full space-y-6 mt-2">
        <Link href="/ai-teacher" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to AI Teacher
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{data.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">Select a learning mode and topic to generate customized AI content.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {data.modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <div 
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={cn(
                  "p-5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3",
                  isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/30"
                )}
              >
                <div className={cn("p-2 rounded-lg w-fit", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{mode.label}</h3>
              </div>
            );
          })}
        </div>

        {selectedMode && activeModeData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Enter Topic</label>
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={activeModeData.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
            
            <button 
              onClick={startSession}
              disabled={!topic.trim()}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm"
            >
              Start {activeModeData.label} Session
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
