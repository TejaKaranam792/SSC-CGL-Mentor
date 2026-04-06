// ─── Types ───────────────────────────────────────────────────────────────────

export type ReadinessLevel = 'not_ready' | 'needs_improvement' | 'exam_ready';

export interface ReadinessQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface ReadinessAnalysis {
  accuracy: number;
  verdict: string;
  readinessLevel: ReadinessLevel;
  strengths: string[];
  weaknesses: string[];
  mistakePatterns: string[];
  conceptGaps: string[];
  trapAwareness: string[];
  improvementPlan: {
    whatToStudy: string[];
    practiceCount: number;
    revisionStrategy: string;
  };
  additionalQuestions: ReadinessQuestion[];
}

export interface ReadinessSession {
  id: string;
  subject: string;
  subjectLabel: string;
  microTopic: string;
  microTopicLabel: string;
  difficulty: string;
  mode: 'practice' | 'exam';
  questionCount: number;
  questions: ReadinessQuestion[];
  answers: (number | null)[];
  timeTaken: number;       // seconds elapsed
  totalTime: number;       // seconds allowed (exam mode) or 0 (practice)
  startedAt: string;
  completedAt?: string;
  analysis?: ReadinessAnalysis;
}

export interface TopicStats {
  key: string;            // `${subject}::${microTopic}`
  subject: string;
  subjectLabel: string;
  microTopic: string;
  microTopicLabel: string;
  attempts: number;
  lastAccuracy: number;
  bestAccuracy: number;
  lastAttempt: string;
  mastered: boolean;
}

// ─── Keys ────────────────────────────────────────────────────────────────────
const SESSION_KEY  = 'ssc_readiness_sessions';
const MASTERED_KEY = 'ssc_readiness_mastered';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function safeWrite(key: string, value: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const getReadinessSessions = (): ReadinessSession[] =>
  safeRead<ReadinessSession[]>(SESSION_KEY, []);

export const getReadinessSession = (id: string): ReadinessSession | null =>
  getReadinessSessions().find(s => s.id === id) ?? null;

export const saveReadinessSession = (session: ReadinessSession): void => {
  const all = getReadinessSessions();
  const idx = all.findIndex(s => s.id === session.id);
  if (idx >= 0) all[idx] = session; else all.push(session);
  safeWrite(SESSION_KEY, all);
};

// ─── Mastered Topics ──────────────────────────────────────────────────────────
export const getMasteredTopics = (): string[] => safeRead<string[]>(MASTERED_KEY, []);

export const toggleMastered = (key: string): boolean => {
  const all = getMasteredTopics();
  const isMastered = all.includes(key);
  safeWrite(MASTERED_KEY, isMastered ? all.filter(k => k !== key) : [...all, key]);
  return !isMastered;
};

// ─── Topic Stats (derived from sessions) ──────────────────────────────────────
export const getTopicStats = (): TopicStats[] => {
  const sessions = getReadinessSessions().filter(s => s.analysis);
  const mastered = getMasteredTopics();
  const map = new Map<string, TopicStats>();

  sessions
    .sort((a, b) => new Date(a.completedAt ?? a.startedAt).getTime() - new Date(b.completedAt ?? b.startedAt).getTime())
    .forEach(s => {
      if (!s.analysis) return;
      const key = `${s.subject}::${s.microTopic}`;
      const acc  = s.analysis.accuracy;
      const existing = map.get(key);
      if (existing) {
        existing.attempts++;
        existing.lastAccuracy = acc;
        existing.bestAccuracy = Math.max(existing.bestAccuracy, acc);
        existing.lastAttempt  = s.completedAt ?? s.startedAt;
      } else {
        map.set(key, {
          key,
          subject: s.subject, subjectLabel: s.subjectLabel,
          microTopic: s.microTopic, microTopicLabel: s.microTopicLabel,
          attempts: 1, lastAccuracy: acc, bestAccuracy: acc,
          lastAttempt: s.completedAt ?? s.startedAt,
          mastered: mastered.includes(key),
        });
      }
    });

  return Array.from(map.values());
};

// ─── Config storage (sessionStorage, not localStorage) ────────────────────────
export interface TestConfig {
  subject: string;
  subjectLabel: string;
  microTopic: string;
  microTopicLabel: string;
  difficulty: string;
  mode: 'practice' | 'exam';
  questionCount: number;
}

export const saveTestConfig = (cfg: TestConfig) => {
  if (typeof window !== 'undefined')
    sessionStorage.setItem('ssc_readiness_config', JSON.stringify(cfg));
};

export const loadTestConfig = (): TestConfig | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('ssc_readiness_config');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const clearTestConfig = () => {
  if (typeof window !== 'undefined') sessionStorage.removeItem('ssc_readiness_config');
};
