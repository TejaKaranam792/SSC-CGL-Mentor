export type Subject = 'quant' | 'reasoning' | 'english' | 'gs';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MicroTopic {
  id: string;
  label: string;
  difficulty: Difficulty;
}

export interface SubjectConfig {
  label: string;
  shortLabel: string;
  icon: string;
  accentColor: string;   // for inline styles where Tailwind purge won't work
  bgClass: string;
  borderClass: string;
  textClass: string;
  topics: MicroTopic[];
}

export const READINESS_TOPICS: Record<Subject, SubjectConfig> = {
  quant: {
    label: 'Quantitative Aptitude',
    shortLabel: 'Quant',
    icon: '📐',
    accentColor: '#818cf8',
    bgClass: 'bg-indigo-500/10',
    borderClass: 'border-indigo-500/40',
    textClass: 'text-indigo-400',
    topics: [
      { id: 'percentage',         label: 'Percentage',                difficulty: 'medium' },
      { id: 'ratio_proportion',   label: 'Ratio & Proportion',        difficulty: 'easy'   },
      { id: 'algebra',            label: 'Algebra',                   difficulty: 'hard'   },
      { id: 'geometry',           label: 'Geometry',                  difficulty: 'hard'   },
      { id: 'time_work',          label: 'Time & Work',               difficulty: 'medium' },
      { id: 'pipes_cistern',      label: 'Pipes & Cistern',           difficulty: 'medium' },
      { id: 'speed_distance',     label: 'Time, Speed & Distance',    difficulty: 'medium' },
      { id: 'number_system',      label: 'Number System',             difficulty: 'hard'   },
      { id: 'profit_loss',        label: 'Profit & Loss',             difficulty: 'easy'   },
      { id: 'mensuration',        label: 'Mensuration',               difficulty: 'hard'   },
      { id: 'trigonometry',       label: 'Trigonometry',              difficulty: 'hard'   },
      { id: 'si_ci',              label: 'Simple & Compound Interest', difficulty: 'easy'  },
      { id: 'data_interpretation',label: 'Data Interpretation',       difficulty: 'medium' },
      { id: 'average',            label: 'Average',                   difficulty: 'easy'   },
      { id: 'mixture_alligation', label: 'Mixture & Alligation',      difficulty: 'medium' },
      { id: 'simplification',     label: 'Simplification',            difficulty: 'easy'   },
      { id: 'lcm_hcf',            label: 'LCM & HCF',                 difficulty: 'medium' },
      { id: 'partnership',        label: 'Partnership',               difficulty: 'medium' },
    ],
  },
  reasoning: {
    label: 'General Intelligence',
    shortLabel: 'Reasoning',
    icon: '🧩',
    accentColor: '#a78bfa',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/40',
    textClass: 'text-purple-400',
    topics: [
      { id: 'coding_decoding',       label: 'Coding-Decoding',          difficulty: 'medium' },
      { id: 'series',                label: 'Series Completion',         difficulty: 'easy'   },
      { id: 'analogies',             label: 'Analogies',                 difficulty: 'easy'   },
      { id: 'blood_relations',       label: 'Blood Relations',           difficulty: 'medium' },
      { id: 'direction',             label: 'Direction Sense',           difficulty: 'easy'   },
      { id: 'syllogism',             label: 'Syllogism',                 difficulty: 'medium' },
      { id: 'matrix',                label: 'Matrix',                    difficulty: 'medium' },
      { id: 'non_verbal',            label: 'Non-Verbal Reasoning',      difficulty: 'hard'   },
      { id: 'classification',        label: 'Classification',            difficulty: 'easy'   },
      { id: 'statement_conclusion',  label: 'Statement & Conclusion',    difficulty: 'hard'   },
      { id: 'dictionary_order',      label: 'Dictionary/Word Formation', difficulty: 'easy'   },
      { id: 'math_operations',       label: 'Mathematical Operations',   difficulty: 'medium' },
      { id: 'clock_calendar',        label: 'Clock & Calendar',          difficulty: 'hard'   },
    ],
  },
  english: {
    label: 'English Language',
    shortLabel: 'English',
    icon: '📝',
    accentColor: '#34d399',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    topics: [
      { id: 'tenses',                  label: 'Tenses',                    difficulty: 'medium' },
      { id: 'error_spotting',          label: 'Error Spotting',            difficulty: 'hard'   },
      { id: 'cloze_test',              label: 'Cloze Test',                difficulty: 'medium' },
      { id: 'fill_blanks',             label: 'Fill in the Blanks',        difficulty: 'easy'   },
      { id: 'synonyms',                label: 'Synonyms & Antonyms',       difficulty: 'medium' },
      { id: 'para_jumbles',            label: 'Para Jumbles',              difficulty: 'hard'   },
      { id: 'reading_comprehension',   label: 'Reading Comprehension',     difficulty: 'hard'   },
      { id: 'idioms',                  label: 'Idioms & Phrases',          difficulty: 'medium' },
      { id: 'narration',               label: 'Narration / Voice',         difficulty: 'hard'   },
      { id: 'sentence_improvement',    label: 'Sentence Improvement',      difficulty: 'medium' },
      { id: 'spelling',                label: 'Spelling Correction',       difficulty: 'medium' },
    ],
  },
  gs: {
    label: 'General Studies',
    shortLabel: 'GS',
    icon: '🌍',
    accentColor: '#fbbf24',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    topics: [
      { id: 'polity',          label: 'Polity & Constitution',    difficulty: 'medium' },
      { id: 'history',         label: 'History',                  difficulty: 'medium' },
      { id: 'geography',       label: 'Geography',                difficulty: 'easy'   },
      { id: 'science_tech',    label: 'Science & Technology',     difficulty: 'hard'   },
      { id: 'economy',         label: 'Economy & Finance',        difficulty: 'hard'   },
      { id: 'static_gk',       label: 'Static GK',               difficulty: 'easy'   },
      { id: 'physics',         label: 'Physics',                  difficulty: 'medium' },
      { id: 'chemistry',       label: 'Chemistry',                difficulty: 'medium' },
      { id: 'biology',         label: 'Biology',                  difficulty: 'easy'   },
      { id: 'current_affairs', label: 'Current Affairs',          difficulty: 'medium' },
    ],
  },
};

export const SUBJECTS = Object.keys(READINESS_TOPICS) as Subject[];

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  easy:   { label: 'Easy',      color: 'text-emerald-400' },
  medium: { label: 'PYQ-Level', color: 'text-primary'  },
  hard:   { label: 'Advanced',  color: 'text-rose-400'   },
};
