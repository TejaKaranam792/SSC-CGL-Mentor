"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { getStrictMode } from "@/lib/storage";
import { saveMistake, Subject } from "@/lib/teacherStore";

export default function MockTestPage() {
  const [subject, setSubject] = useState<string>("mixed");
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Test State
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 mins for 20 q
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [savedMistakes, setSavedMistakes] = useState<Record<number, boolean>>({});
  const [mistakeCategory, setMistakeCategory] = useState<Record<number, "concept"| "calculation"| "silly">>({});

  // Start Test
  const startTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const strictMode = getStrictMode();
      const res = await fetch("/api/ai-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: subject === "mixed" ? "SSC CGL Full Syllabus" : subject, 
          topic: "Full Syllabus Random MCQ Pattern", 
          mode: "mock", 
          strictMode 
        }),
      });

      if (!res.ok) throw new Error("Failed to generate test.");
      const json = await res.json();
      if (!json.questions || json.questions.length === 0) throw new Error("No questions returned.");

      setQuestions(json.questions);
      setSessionActive(true);
      setTimeRemaining(20 * 60); // Reset timer
      setAnswers({});
      setSavedMistakes({});
      setMistakeCategory({});
      setIsSubmitted(false);
      setCurrentQ(0);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    let interval: any;
    if (sessionActive && !isSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, isSubmitted, timeRemaining]);

  const toggleAnswer = (qIndex: number, oIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const submitTest = () => {
    setIsSubmitted(true);
  };

  const handleSaveMistake = (qIndex: number, q: any) => {
    const category = mistakeCategory[qIndex] || "concept";
    const uAns = answers[qIndex];
    saveMistake({
      subject: (subject === "mixed" ? "quant" : subject) as Subject,
      topic: "Mock Test Log",
      question: q.question,
      userAnswer: uAns !== undefined ? q.options[uAns] : "Unanswered",
      correctAnswer: q.options[q.correctIndex],
      explanation: q.explanation,
      category,
    });
    setSavedMistakes((prev) => ({ ...prev, [qIndex]: true }));
  };

  // Pre-test config UI
  if (!sessionActive) {
    return (
      <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8">
        <main className="relative z-10 flex flex-col max-w-xl mx-auto w-full space-y-6 mt-2">
          <Link href="/ai-teacher" className="inline-flex items-center text-sm font-medium text-muted-foreground w-fit hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to AI Teacher
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mini Mock Test</h1>
            <p className="text-muted-foreground text-sm mt-1">Generate a 20-question rapid mock test. Time limit: 20 minutes.</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold ml-1 block">Select Subject</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="mixed">Mixed Subjects (Full Syllabus)</option>
              <option value="quant">Quantitative Aptitude</option>
              <option value="reasoning">Reasoning</option>
              <option value="english">English</option>
              <option value="gk">General Awareness</option>
            </select>
          </div>

          {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-sm">{error}</div>}

          <button 
            onClick={startTest}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
          >
            {loading ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Mock...</>
            ) : "Start Mock Test"}
          </button>
        </main>
      </div>
    );
  }

  // Submitted Analysis UI
  if (isSubmitted) {
    const attempted = Object.keys(answers).length;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(0) : "0";
    const minutesTaken = Math.floor((20 * 60 - timeRemaining) / 60);

    return (
      <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8 pb-20">
        <main className="relative z-10 flex flex-col max-w-3xl mx-auto w-full space-y-6 mt-2">
          <button onClick={() => setSessionActive(false)} className="inline-flex items-center text-sm font-medium text-muted-foreground w-fit hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Exit Test
          </button>

          <div className="text-center space-y-2 mb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Mock Test Result</h1>
            <p className="text-muted-foreground text-sm">Review your mistakes and log them for future revision.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border p-4 rounded-2xl text-center shadow-sm">
              <span className="block text-3xl font-black">{correct}/{questions.length}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Score</span>
            </div>
            <div className="bg-card border border-border p-4 rounded-2xl text-center shadow-sm">
              <span className="block text-3xl font-black text-emerald-500">{accuracy}%</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Accuracy</span>
            </div>
            <div className="bg-card border border-border p-4 rounded-2xl text-center shadow-sm">
              <span className="block text-3xl font-black text-blue-500">{minutesTaken}m</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time Taken</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Detailed Analysis</h3>
            {questions.map((q, idx) => {
              const uAns = answers[idx];
              const isCor = uAns === q.correctIndex;
              const notAtt = uAns === undefined;

              return (
                <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-semibold text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                      <span className="text-muted-foreground font-normal">Q{idx + 1}.</span> {q.question}
                    </h4>
                    {isCor ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> : notAtt ? <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                  </div>

                  <div className="space-y-2 mb-4">
                    {q.options.map((opt: string, oIdx: number) => {
                      let cnStr = "border-border opacity-50 bg-background";
                      if (oIdx === q.correctIndex) cnStr = "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500/50";
                      else if (oIdx === uAns) cnStr = "border-red-500 bg-red-500/10 text-red-900 dark:text-red-300 line-through ring-1 ring-red-500/50";
                      return (
                        <div key={oIdx} className={`w-full px-4 py-3 border rounded-xl text-sm ${cnStr}`}>
                           <span className="font-medium mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-border mt-3">
                    <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Explanation</span>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">{q.explanation}</p>
                  </div>

                  {!isCor && (
                    <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <select 
                        value={mistakeCategory[idx] || "concept"}
                        onChange={(e) => setMistakeCategory(prev => ({...prev, [idx]: e.target.value as any}))}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none"
                        disabled={savedMistakes[idx]}
                      >
                        <option value="concept">Concept Mistake</option>
                        <option value="calculation">Calculation Mistake</option>
                        <option value="silly">Silly Mistake</option>
                      </select>
                      <button
                        onClick={() => handleSaveMistake(idx, q)}
                        disabled={savedMistakes[idx]}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {savedMistakes[idx] ? "Saved" : "Log Mistake"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Active Test UI
  const qObj = questions[currentQ];
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground font-sans flex flex-col p-4 sm:p-6 pb-24">
      {/* Test Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-50 py-3 border-b border-border">
        <div className="font-extrabold text-lg flex items-center gap-2">
          <span>Q {currentQ + 1} / {questions.length}</span>
        </div>
        <div className={`flex items-center gap-2 font-mono font-bold text-lg px-3 py-1.5 rounded-lg border ${timeRemaining < 300 ? 'text-red-500 bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-muted/50 border-border'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full mt-6">
        <h2 className="text-[1.1rem] sm:text-xl font-semibold leading-relaxed mb-6">
          {qObj?.question}
        </h2>

        <div className="space-y-3 flex-1 mb-8">
          {qObj?.options.map((opt: string, oIdx: number) => {
            const isSelected = answers[currentQ] === oIdx;
            return (
              <button
                key={oIdx}
                onClick={() => toggleAnswer(currentQ, oIdx)}
                className={`w-full text-left px-5 py-4 rounded-xl border text-[0.95rem] transition-all focus:outline-none flex gap-3 items-start ${
                  isSelected 
                  ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                  : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className={`w-6 h-6 shrink-0 border-2 rounded-full flex items-center justify-center mt-0.5 ${isSelected ? "border-primary" : "border-border"}`}>
                  {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Nav */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background/95 backdrop-blur-xl flex justify-between gap-4 safe-area-inset-bottom">
          <div className="max-w-2xl mx-auto flex w-full gap-3">
            <button
              onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
              disabled={currentQ === 0}
              className="flex-1 py-3.5 rounded-xl font-bold bg-muted text-muted-foreground disabled:opacity-50"
            >
              Previous
            </button>
            {currentQ === questions.length - 1 ? (
              <button
                onClick={submitTest}
                className="flex-[2] py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(p => Math.min(questions.length - 1, p + 1))}
                className="flex-[2] py-3.5 rounded-xl font-bold bg-foreground text-background shadow-lg hover:bg-foreground/90"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
