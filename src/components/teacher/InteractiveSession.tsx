"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Save, CheckCircle2, XCircle, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { saveMistake, Subject } from "@/lib/teacherStore";
import { getStrictMode } from "@/lib/storage";

interface Props {
  subjectKey: string;
  subjectTitle: string;
  modeLabel: string;
  aiMode: "concept" | "practice";
  topic: string;
  onBack: () => void;
}

export function InteractiveSession({ subjectKey, subjectTitle, modeLabel, aiMode, topic, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // State for interactive questions
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [savedMistakes, setSavedMistakes] = useState<Record<number, boolean>>({});
  const [mistakeCategory, setMistakeCategory] = useState<Record<number, "concept"| "calculation"| "silly">>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const strictMode = getStrictMode();
        const res = await fetch("/api/ai-teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: subjectTitle, topic, mode: aiMode, strictMode }),
        });

        if (!res.ok) throw new Error("Failed to fetch AI content.");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [subjectTitle, topic, aiMode]);

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (userAnswers[qIndex] !== undefined) return; // Prevent changing answer
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSaveMistake = (qIndex: number, questionObj: any) => {
    const category = mistakeCategory[qIndex] || "concept";
    saveMistake({
      subject: subjectKey as Subject,
      topic,
      question: questionObj.question,
      userAnswer: questionObj.options[userAnswers[qIndex] ?? -1] || "Unanswered",
      correctAnswer: questionObj.options[questionObj.correctIndex],
      explanation: questionObj.explanation,
      category,
    });
    setSavedMistakes((prev) => ({ ...prev, [qIndex]: true }));
  };

  const renderQuestions = (questions: any[]) => {
    return questions.map((q, idx) => {
      const answered = userAnswers[idx] !== undefined;
      const isCorrect = userAnswers[idx] === q.correctIndex;

      return (
        <div key={idx} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm mb-4">
          <h4 className="font-semibold text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">{idx + 1}. {q.question}</h4>
          
          <div className="space-y-2">
            {q.options.map((opt: string, oIdx: number) => {
              let btnClass = "border-border hover:bg-muted/50 bg-background";
              if (answered) {
                if (oIdx === q.correctIndex) {
                  btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                } else if (oIdx === userAnswers[idx]) {
                  btnClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                } else {
                  btnClass = "opacity-50 border-border bg-background";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleOptionSelect(idx, oIdx)}
                  disabled={answered}
                  className={`w-full text-left px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none ${btnClass}`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
              <div className={`p-4 rounded-xl border text-sm ${isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200" : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200"}`}>
                <div className="flex items-start gap-2 mb-2 font-bold">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
                  <span>{isCorrect ? "Correct! Well done." : "Incorrect."}</span>
                </div>
                <div className="pl-7">
                  <p className="font-semibold mb-1">Explanation & Shortcut:</p>
                  <p className="whitespace-pre-wrap opacity-90">{q.explanation}</p>
                </div>
              </div>

              {!isCorrect && (
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
            </motion.div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8">
      <main className="relative z-10 flex flex-col max-w-3xl mx-auto w-full space-y-6 mt-2">
        <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-muted-foreground w-fit hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          End Session
        </button>

        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{subjectTitle}</h1>
            <p className="text-xs sm:text-sm text-primary font-bold mt-1 uppercase tracking-wide">{modeLabel} • {topic}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-medium animate-pulse">Generating your session...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        ) : aiMode === "concept" && data ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-3">Core Concept</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.theory}</p>
            </div>
            
            {(data.formulas?.length > 0 || data.shortcuts?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.formulas?.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Formulas</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                      {data.formulas.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
                {data.shortcuts?.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-4 h-4"/> Shortcuts</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                      {data.shortcuts.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="pt-6">
              <h3 className="text-lg font-bold mb-4">Practice & Examples</h3>
              {renderQuestions(data.examples || [])}
            </div>
          </motion.div>
        ) : (data?.questions || data?.examples) ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
            {renderQuestions(data.questions || data.examples)}
          </motion.div>
        ) : (
          <div className="p-4 text-center text-muted-foreground border border-border border-dashed rounded-xl">No content generated. Please try again.</div>
        )}
      </main>
    </div>
  );
}
