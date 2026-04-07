"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Loader2, CheckCircle2, XCircle, AlertTriangle, ChevronRight, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveDifficultyPerformance } from "@/lib/storage";

interface TopicTestModalProps {
  topic: string;
  subject: string;
  onClose: () => void;
}

type Difficulty = "easy" | "medium" | "hard";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function TopicTestModal({ topic, subject, onClose }: TopicTestModalProps) {
  const [step, setStep] = useState<"select_difficulty" | "loading" | "test" | "results">("select_difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const [score, setScore] = useState(0);

  const startTest = async (level: Difficulty) => {
    setDifficulty(level);
    setStep("loading");
    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty: level })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setStep("test");
      } else {
        throw new Error("Failed to load questions");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating test. Please try again.");
      setStep("select_difficulty");
    }
  };

  const handleSelectOption = (opt: string) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) finalScore++;
    });
    setScore(finalScore);
    setStep("results");
    
    // Save performance
    if (difficulty) {
      saveDifficultyPerformance({
        topic,
        subject,
        difficulty,
        score: finalScore,
        total: questions.length
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-background/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-background/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">
                  {subject}
                </span>
                <span className="text-xs font-bold text-muted-foreground">PYQ Test Engine</span>
              </div>
              <h2 className="text-xl font-black text-foreground">{topic} Test</h2>
            </div>
            {step !== "test" && (
                <button onClick={onClose} className="p-2 rounded-full text-muted-foreground hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
                </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {step === "select_difficulty" && (
              <div className="space-y-6">
                <div className="text-center mb-8 mt-4">
                  <h3 className="text-2xl font-black text-foreground mb-2">Select Your Challenge Level</h3>
                  <p className="text-sm text-muted-foreground font-medium">Test your readiness with AI-generated PYQ-style questions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Easy */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startTest("easy")}
                    className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-left hover:bg-emerald-500/10 transition-colors group relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-black text-emerald-400 mb-1">Easy</h4>
                    <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">Foundation check. Basic concept clarity and formula application.</p>
                  </motion.button>

                  {/* Medium */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startTest("medium")}
                    className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-left hover:bg-amber-500/20 transition-colors group relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  >
                    <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-black px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-black text-amber-400 mb-1">Medium</h4>
                    <p className="text-xs text-amber-100/70 font-medium leading-relaxed">Exact Exam Standard. Standard PYQ level with moderate logic.</p>
                  </motion.button>

                  {/* Hard */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startTest("hard")}
                    className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-left hover:bg-rose-500/10 transition-colors group relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-black text-rose-400 mb-1">Hard</h4>
                    <p className="text-xs text-rose-100/70 font-medium leading-relaxed">High-level trap questions. Push your accuracy to the limits.</p>
                  </motion.button>
                </div>
              </div>
            )}

            {step === "loading" && (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-bold animate-pulse">Generating exact {difficulty?.toUpperCase()} level exact-pattern MCQs...</p>
              </div>
            )}

            {step === "test" && questions[currentIdx] && (
              <motion.div
                key={currentIdx}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center text-sm font-bold text-muted-foreground mb-4">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs uppercase",
                    difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-400" :
                    difficulty === 'medium' ? "bg-amber-500/10 text-amber-400" :
                    "bg-rose-500/10 text-rose-400"
                  )}>{difficulty} Level</span>
                </div>

                <div className="bg-muted p-5 rounded-xl border border-border">
                  <p className="text-base text-foreground font-semibold leading-relaxed">{questions[currentIdx].question}</p>
                </div>

                <div className="space-y-3">
                  {questions[currentIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all text-sm font-medium",
                        answers[currentIdx] === opt 
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-border hover:border-white/20 text-foreground"
                      )}
                    >
                      <span className="inline-block w-6 h-6 rounded bg-black/20 text-center leading-6 mr-3 text-xs">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!answers[currentIdx]}
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2"
                  >
                    {currentIdx === questions.length - 1 ? "Submit Test" : "Next Question"}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <div className="space-y-8 pb-8">
                <div className="text-center p-8 bg-muted rounded-3xl border border-border">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-black text-foreground mb-1">Test Completed</h3>
                  <div className="text-5xl font-black text-primary mb-2">{score} / {questions.length}</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {score === questions.length ? "Perfect score! You truly master this level." :
                     score >= questions.length / 2 ? "Good attempt. Review your mistakes to improve." :
                     "You scored low. We highly recommend watching the learning video again before answering."}
                  </p>
                </div>

                <div className="space-y-6 mt-8">
                  <h4 className="text-lg font-black text-foreground border-b border-border pb-2">Analysis & Solutions</h4>
                  {questions.map((q, idx) => {
                    const isCorrect = answers[idx] === q.correctAnswer;
                    return (
                      <div key={idx} className={cn(
                         "p-5 rounded-2xl border",
                         isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                      )}>
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />}
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">{q.question}</p>
                            <div className="text-xs font-bold space-y-1 mb-4">
                              <div className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                                Your Answer: {answers[idx] || "Unanswered"}
                              </div>
                              {!isCorrect && <div className="text-emerald-400">Correct Answer: {q.correctAnswer}</div>}
                            </div>
                            <div className="bg-black/20 p-3 rounded-lg text-xs text-muted-foreground font-medium leading-relaxed">
                              <span className="font-bold text-white/70 block mb-1">Explanation:</span>
                              {q.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
