export interface SSCPerformance {
  id: string;
  date: string;
  testType: 'full' | 'sectional';
  sectionalSubject?: 'quant' | 'reasoning' | 'english' | 'gs';
  totalScore: number;
  quantScore?: number;
  reasoningScore?: number;
  englishScore?: number;
  gsScore?: number;
  weakTopics: string;
  mistakeTypes: string;
  timeManagementIssue: boolean;
  timeManagementDesc: string;
}

export interface MentorFeedback {
  id: string;
  performanceId: string;
  analysis: string;
  weakAreas: string[];
  rootCauses: string;
  todaysPlan: { hour: string; task: string }[];
  practiceQuestions: { topic: string; question: string; answer?: string; explanation?: string }[];
  rules: string[];
  mentorMessage: string;
}

// ─── Topic Intelligence ───────────────────────────────────────────────────────
export interface TopicIntelData {
  topic: string;
  subject: string;
  overview: string;
  coreRules: string[];
  shortcuts: string[];
  traps: string[];
  examStrategy: string[];
  memoryHacks: string[];
  miniPractice: { question: string; answer: string; explanation: string }[];
  status?: 'understood' | 'revise_later' | 'none';
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const HISTORY_KEY     = 'ssc_performance_history';
const FEEDBACK_KEY    = 'ssc_mentor_feedback';
const GOAL_KEY        = 'ssc_target_score';
const CHECKED_KEY     = 'ssc_checked_plans';
const BEST_STREAK_KEY = 'ssc_best_streak';
const BADGES_KEY      = 'ssc_badges';
const STRICT_MODE_KEY = 'ssc_strict_mode';
const INTEL_CACHE_KEY     = 'ssc_intel_cache';
const REVISION_KEY        = 'ssc_revision_log';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Performance ─────────────────────────────────────────────────────────────
export const getHistory = (): SSCPerformance[] => read<SSCPerformance[]>(HISTORY_KEY, []);

export const savePerformance = (perf: Omit<SSCPerformance, 'id' | 'date'>): SSCPerformance => {
  const entry: SSCPerformance = { ...perf, id: Date.now().toString(), date: new Date().toISOString() };
  const history = getHistory();
  history.push(entry);
  write(HISTORY_KEY, history);
  // Update best streak on every save
  updateBestStreak();
  return entry;
};

export const deletePerformance = (id: string) => {
  write(HISTORY_KEY, getHistory().filter(h => h.id !== id));
  write(FEEDBACK_KEY, getFeedbacks().filter(f => f.performanceId !== id));
};

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const getFeedbacks = (): MentorFeedback[] => read<MentorFeedback[]>(FEEDBACK_KEY, []);

export const saveFeedback = (feedback: Omit<MentorFeedback, 'id'>): MentorFeedback => {
  const entry: MentorFeedback = { ...feedback, id: Date.now().toString() };
  const all = getFeedbacks();
  all.push(entry);
  write(FEEDBACK_KEY, all);
  return entry;
};

export const getFeedbackByPerformanceId = (perfId: string): MentorFeedback | null =>
  getFeedbacks().find(f => f.performanceId === perfId) || null;

// ─── Goal ─────────────────────────────────────────────────────────────────────
export const getGoal = (): number | null => {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(GOAL_KEY);
  return val ? parseInt(val, 10) : null;
};
export const saveGoal = (score: number) => {
  if (typeof window !== 'undefined') localStorage.setItem(GOAL_KEY, score.toString());
};

// ─── Streak ───────────────────────────────────────────────────────────────────
export const getStreak = (): number => {
  const history = getHistory();
  if (!history.length) return 0;
  const dateSet = new Set(history.map(h => h.date.slice(0, 10)));
  const dates = Array.from(dateSet).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round((new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 864e5);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

export const getBestStreak = (): number => read<number>(BEST_STREAK_KEY, 0);

export const updateBestStreak = () => {
  const current = getStreak();
  const best = getBestStreak();
  const newBest = Math.max(current, best);
  if (typeof window !== 'undefined') localStorage.setItem(BEST_STREAK_KEY, newBest.toString());
  return newBest;
};

// ─── Checked Plan Items ───────────────────────────────────────────────────────
export const getCheckedPlans = (feedbackId: string): number[] => {
  const all = read<Record<string, number[]>>(CHECKED_KEY, {});
  return all[feedbackId] || [];
};
export const toggleCheckedPlan = (feedbackId: string, index: number): number[] => {
  const all = read<Record<string, number[]>>(CHECKED_KEY, {});
  const current = all[feedbackId] || [];
  all[feedbackId] = current.includes(index) ? current.filter(i => i !== index) : [...current, index];
  write(CHECKED_KEY, all);
  return all[feedbackId];
};

// ─── Badges ───────────────────────────────────────────────────────────────────
export const getUnlockedBadges = (): string[] => read<string[]>(BADGES_KEY, []);
export const syncBadges = (earned: string[]) => write(BADGES_KEY, earned);

// ─── Strict Mode ──────────────────────────────────────────────────────────────
export const getStrictMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STRICT_MODE_KEY) === 'true';
};
export const setStrictMode = (val: boolean) => {
  if (typeof window !== 'undefined') localStorage.setItem(STRICT_MODE_KEY, String(val));
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getWeakTopicFrequency = (): Record<string, number> => {
  const freq: Record<string, number> = {};
  getHistory().forEach(h => {
    (h.weakTopics || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
      freq[t] = (freq[t] || 0) + 1;
    });
  });
  return freq;
};

export const getMistakeDistribution = (): { name: string; value: number; color: string }[] => {
  const counts: Record<string, number> = { concept: 0, calculation: 0, time: 0, guess: 0 };
  getHistory().forEach(h => { if (h.mistakeTypes in counts) counts[h.mistakeTypes]++; });
  const meta: Record<string, { label: string; color: string }> = {
    concept:     { label: 'Concept Gap',       color: '#818cf8' },
    calculation: { label: 'Calc Error',        color: '#3B82F6' },
    time:        { label: 'Time Pressure',     color: '#f59e0b' },
    guess:       { label: 'Wild Guessing',     color: '#10b981' },
  };
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: meta[k].label, value: v, color: meta[k].color }));
};

export const getAccuracyHistory = (): { name: string; accuracy: number; score: number }[] =>
  getHistory().filter(h => h.testType === 'full').slice(-15).map(h => ({
    name: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.totalScore,
    accuracy: Math.round((h.totalScore / 200) * 100),
  }));

// ─── CSV Export ───────────────────────────────────────────────────────────────
export const exportToCSV = () => {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  if (!history.length) return;
  const esc = (v: unknown) => { const s = String(v ?? '-'); return s.includes(',') ? `"${s.replace(/"/g, '""')}"` : s; };
  const headers = ['Date','Type','Subject','Total','Max','Quant','Reasoning','English','GS','Weak Topics','Mistake','Time Issue','Detail'];
  const rows = history.map(h => [
    esc(new Date(h.date).toLocaleDateString('en-IN')),
    esc(h.testType), esc(h.sectionalSubject||'-'),
    esc(h.totalScore), esc(h.testType==='full'?200:50),
    esc(h.quantScore), esc(h.reasoningScore), esc(h.englishScore), esc(h.gsScore),
    esc(h.weakTopics), esc(h.mistakeTypes),
    esc(h.timeManagementIssue?'Yes':'No'), esc(h.timeManagementDesc||'-'),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `ssc_performance_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

// ─── Intelligence Caching ─────────────────────────────────────────────────────
export const getIntelCache = (): Record<string, TopicIntelData> => read<Record<string, TopicIntelData>>(INTEL_CACHE_KEY, {});

export const getIntelForTopic = (topic: string): TopicIntelData | null => {
  const cache = getIntelCache();
  return cache[topic] || null;
};

export const saveIntelToCache = (topic: string, data: TopicIntelData) => {
  const cache = getIntelCache();
  cache[topic] = data;
  write(INTEL_CACHE_KEY, cache);
};

export const updateIntelStatus = (topic: string, status: 'understood' | 'revise_later' | 'none') => {
  const cache = getIntelCache();
  if (cache[topic]) {
    cache[topic].status = status;
    write(INTEL_CACHE_KEY, cache);
  }
};

// ─── Smart Revision Tracker ───────────────────────────────────────────────────
export interface RevisionTask {
  day: 1 | 3 | 7;
  dueDate: string;   // ISO YYYY-MM-DD
  completed: boolean;
  completedDate?: string;
}

export interface RevisionEntry {
  id: string;
  topic: string;
  subject: string;
  studiedDate: string; // ISO YYYY-MM-DD
  revisions: RevisionTask[];
}

function addDays(base: string, n: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const getRevisions = (): RevisionEntry[] => read<RevisionEntry[]>(REVISION_KEY, []);

export const logStudiedTopic = (topic: string, subject: string): RevisionEntry => {
  const today = new Date().toISOString().slice(0, 10);
  const entry: RevisionEntry = {
    id: Date.now().toString(),
    topic,
    subject,
    studiedDate: today,
    revisions: [
      { day: 1, dueDate: addDays(today, 1), completed: false },
      { day: 3, dueDate: addDays(today, 3), completed: false },
      { day: 7, dueDate: addDays(today, 7), completed: false },
    ],
  };
  const all = getRevisions();
  all.push(entry);
  write(REVISION_KEY, all);
  return entry;
};

export const completeRevision = (entryId: string, day: 1 | 3 | 7): RevisionEntry[] => {
  const today = new Date().toISOString().slice(0, 10);
  const all = getRevisions().map(e => {
    if (e.id !== entryId) return e;
    return {
      ...e,
      revisions: e.revisions.map(r =>
        r.day === day ? { ...r, completed: true, completedDate: today } : r
      ),
    };
  });
  write(REVISION_KEY, all);
  return all;
};

export const deleteRevisionEntry = (id: string) => {
  write(REVISION_KEY, getRevisions().filter(e => e.id !== id));
};

export const getRevisionStreak = (): number => {
  const all = getRevisions();
  const completedDates = new Set<string>();
  all.forEach(e =>
    e.revisions.forEach(r => { if (r.completed && r.completedDate) completedDates.add(r.completedDate); })
  );
  const sorted = Array.from(completedDates).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = addDays(today, -1);
  if (!sorted.length || (sorted[0] !== today && sorted[0] !== yesterday)) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const diff = Math.round((new Date(prev).getTime() - new Date(curr).getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

export const getBestRevisionStreak = (): number => read<number>('ssc_rev_best_streak', 0);

export const updateBestRevisionStreak = () => {
  const current = getRevisionStreak();
  const best = getBestRevisionStreak();
  const newBest = Math.max(current, best);
  write('ssc_rev_best_streak', newBest);
  return newBest;
};
