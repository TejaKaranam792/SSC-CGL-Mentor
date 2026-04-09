export type Category = "concept" | "calculation" | "silly";
export type Subject = "quant" | "reasoning" | "english" | "gk";

export interface Mistake {
  id: string;
  subject: Subject;
  topic?: string;
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  category: Category;
  explanation?: string;
  dateAdded: string; // ISO String
}

const STORAGE_KEY = "ssc_teacher_mistakes";

export function getMistakes(): Mistake[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse mistakes from localStorage", e);
    return [];
  }
}

export function saveMistake(mistakeData: Omit<Mistake, "id" | "dateAdded">) {
  if (typeof window === "undefined") return;
  const currentMistakes = getMistakes();
  const newMistake: Mistake = {
    ...mistakeData,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newMistake, ...currentMistakes]));
  return newMistake;
}

export function removeMistake(id: string) {
  if (typeof window === "undefined") return;
  const currentMistakes = getMistakes();
  const updatedMistakes = currentMistakes.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMistakes));
}
