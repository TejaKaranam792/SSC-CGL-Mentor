export type Subject = 'Quant' | 'Reasoning' | 'English' | 'GS';
export type ROILevel = 'High' | 'Medium' | 'Low';

export interface SyllabusTopic {
  id: string;
  subject: Subject;
  topicLabel: string;
  avgQuestions: string;
  weightage: number;        // 1-10 scale
  scoringEase: number;      // 1-10 scale (10 = extremely easy to score)
  timeRequired: number;     // 1-10 scale (10 = takes very long to master)
  isTrap: boolean;          // High time/effort for low guaranteed marks
  description: string;
}

export interface CalculatedTopic extends SyllabusTopic {
  roiScore: number;
  roiLevel: ROILevel;
}

// Complete SSC CGL Tier 1 Syllabus Data
const RAW_DATA: SyllabusTopic[] = [
  // ── QUANT ──
  { id: 'percentage', subject: 'Quant', topicLabel: 'Percentage', avgQuestions: '1-2', weightage: 7, scoringEase: 8, timeRequired: 4, isTrap: false, description: 'Core base for everything (Profit/Loss, SI/CI, DI). Master this first.' },
  { id: 'ratio', subject: 'Quant', topicLabel: 'Ratio & Proportion', avgQuestions: '1-2', weightage: 7, scoringEase: 9, timeRequired: 3, isTrap: false, description: 'Extremely high ROI. Easy rules, solves many arithmetic problems quickly.' },
  { id: 'number_system', subject: 'Quant', topicLabel: 'Number System', avgQuestions: '1-2', weightage: 6, scoringEase: 5, timeRequired: 7, isTrap: true, description: 'Vast topic with many abstract theorems for just 1-2 questions. Do basics only initially.' },
  { id: 'geometry', subject: 'Quant', topicLabel: 'Geometry', avgQuestions: '3-4', weightage: 10, scoringEase: 4, timeRequired: 9, isTrap: false, description: 'Highest weightage but takes time to learn all theorems. Very important.' },
  { id: 'algebra', subject: 'Quant', topicLabel: 'Algebra', avgQuestions: '2-3', weightage: 8, scoringEase: 6, timeRequired: 6, isTrap: false, description: 'Formula-based. Fast to score once you recognize the fixed patterns.' },
  { id: 'trigonometry', subject: 'Quant', topicLabel: 'Trigonometry', avgQuestions: '2-3', weightage: 8, scoringEase: 4, timeRequired: 8, isTrap: true, description: 'Requires memorizing identities. Beginners get stuck here; learn standard values first.' },
  { id: 'mensuration', subject: 'Quant', topicLabel: 'Mensuration', avgQuestions: '1-2', weightage: 6, scoringEase: 6, timeRequired: 5, isTrap: false, description: 'Formula-heavy but direct application. Good ROI if formulas are memorized.' },
  { id: 'di', subject: 'Quant', topicLabel: 'Data Interpretation', avgQuestions: '3-4', weightage: 9, scoringEase: 8, timeRequired: 4, isTrap: false, description: 'Very high ROI. Just basic calculation (average, ratio, percentage) applied visually.' },
  { id: 'time_work', subject: 'Quant', topicLabel: 'Time & Work', avgQuestions: '1-2', weightage: 6, scoringEase: 8, timeRequired: 4, isTrap: false, description: 'LCM method makes this very easy and reliable to score.' },
  { id: 'pipes_cistern', subject: 'Quant', topicLabel: 'Pipes & Cistern', avgQuestions: '1', weightage: 5, scoringEase: 8, timeRequired: 3, isTrap: false, description: 'Direct extension of Time & Work with similar logic but includes negative work for outlet pipes.' },
  { id: 'average', subject: 'Quant', topicLabel: 'Average', avgQuestions: '1', weightage: 5, scoringEase: 8, timeRequired: 3, isTrap: false, description: 'Very basic. High scoring ease with simple logic.' },
  { id: 'mixture_alligation', subject: 'Quant', topicLabel: 'Mixture & Alligation', avgQuestions: '1', weightage: 5, scoringEase: 6, timeRequired: 5, isTrap: false, description: 'Powerful trick that can be applied to profit, average, and SI/CI.' },
  { id: 'simplification', subject: 'Quant', topicLabel: 'Simplification & BODMAS', avgQuestions: '1', weightage: 4, scoringEase: 9, timeRequired: 2, isTrap: false, description: 'Free marks if calculation speed is decent.' },
  { id: 'lcm_hcf', subject: 'Quant', topicLabel: 'LCM & HCF', avgQuestions: '1', weightage: 4, scoringEase: 7, timeRequired: 3, isTrap: false, description: 'Basic application based questions that are mostly formula driven.' },
  { id: 'partnership', subject: 'Quant', topicLabel: 'Partnership', avgQuestions: '1-0', weightage: 4, scoringEase: 8, timeRequired: 3, isTrap: false, description: 'Just a simple extension of Ratio & Proportion.' },

  // ── REASONING ──
  { id: 'coding', subject: 'Reasoning', topicLabel: 'Coding-Decoding', avgQuestions: '2-3', weightage: 8, scoringEase: 8, timeRequired: 3, isTrap: false, description: 'High frequency. Very easy with position value practice.' },
  { id: 'series', subject: 'Reasoning', topicLabel: 'Series (Number/Letter)', avgQuestions: '3-4', weightage: 9, scoringEase: 6, timeRequired: 4, isTrap: false, description: 'Number series can sometimes be tricky, but letter series is free marks.' },
  { id: 'blood_relation', subject: 'Reasoning', topicLabel: 'Blood Relations', avgQuestions: '1-2', weightage: 5, scoringEase: 7, timeRequired: 3, isTrap: false, description: 'Family tree drawing guarantees the right answer. Easy concept.' },
  { id: 'syllogism', subject: 'Reasoning', topicLabel: 'Syllogism', avgQuestions: '1-2', weightage: 6, scoringEase: 8, timeRequired: 4, isTrap: false, description: 'Venn diagrams make this 100% accurate. Learn rules once.' },
  { id: 'missing_number', subject: 'Reasoning', topicLabel: 'Missing Number Matrix', avgQuestions: '1-2', weightage: 5, scoringEase: 3, timeRequired: 6, isTrap: true, description: 'Can waste huge amounts of time in exam if logic doesn\'t click immediately. Skip initially.' },
  { id: 'non_verbal', subject: 'Reasoning', topicLabel: 'Non-Verbal (Images)', avgQuestions: '3-5', weightage: 9, scoringEase: 9, timeRequired: 2, isTrap: false, description: 'Mirror images, paper folding, hidden figures. Free marks with zero calculation.' },
  { id: 'analogy', subject: 'Reasoning', topicLabel: 'Analogy & Classification', avgQuestions: '3-4', weightage: 8, scoringEase: 7, timeRequired: 4, isTrap: false, description: 'Test of general knowledge and logic. Good ROI.' },
  { id: 'direction_distance', subject: 'Reasoning', topicLabel: 'Direction & Distance', avgQuestions: '1', weightage: 4, scoringEase: 9, timeRequired: 2, isTrap: false, description: 'Very easy visual questions. Cannot go wrong if diagram is drawn.' },
  { id: 'math_operations', subject: 'Reasoning', topicLabel: 'Mathematical Operations', avgQuestions: '1-2', weightage: 5, scoringEase: 7, timeRequired: 4, isTrap: false, description: 'Requires fast calculation mentally. BODMAS application.' },
  { id: 'dictionary_order', subject: 'Reasoning', topicLabel: 'Dictionary/Word Formation', avgQuestions: '1-2', weightage: 4, scoringEase: 10, timeRequired: 1, isTrap: false, description: 'Absolute free marks without any prior preparation.' },
  { id: 'clock_calendar', subject: 'Reasoning', topicLabel: 'Clock & Calendar', avgQuestions: '0-1', weightage: 3, scoringEase: 4, timeRequired: 5, isTrap: true, description: 'Rarely asked now. Lots of odd-days concepts to memorize for low reward.' },

  // ── ENGLISH ──
  { id: 'vocab', subject: 'English', topicLabel: 'Vocab (Syn/Ant/Idioms/OWS)', avgQuestions: '8-10', weightage: 10, scoringEase: 4, timeRequired: 9, isTrap: false, description: 'Huge weightage but takes months of daily reading. Start day 1.' },
  { id: 'grammar_rules', subject: 'English', topicLabel: 'Grammar (Error Spotting)', avgQuestions: '3-4', weightage: 7, scoringEase: 6, timeRequired: 6, isTrap: false, description: 'Requires rules. Focus on Tense, Subject-Verb Agreement, and Prepositions first.' },
  { id: 'cloze', subject: 'English', topicLabel: 'Cloze Test', avgQuestions: '5', weightage: 9, scoringEase: 7, timeRequired: 5, isTrap: false, description: 'Combines grammar and vocab. Reading daily improves this naturally.' },
  { id: 'voice_narration', subject: 'English', topicLabel: 'Active/Passive & Direct/Indirect', avgQuestions: '2-3', weightage: 6, scoringEase: 9, timeRequired: 2, isTrap: false, description: 'Pure rules. Extremely high ROI. Easiest grammar marks.' },
  { id: 'reading_comp', subject: 'English', topicLabel: 'Reading Comprehension', avgQuestions: '5', weightage: 9, scoringEase: 6, timeRequired: 4, isTrap: false, description: 'High volume marks in Mains. Focus on reading speed.' },
  { id: 'para_jumbles', subject: 'English', topicLabel: 'Para Jumbles (PQRS)', avgQuestions: '2', weightage: 5, scoringEase: 5, timeRequired: 5, isTrap: false, description: 'Look for connecting words, pronouns, and chronological flow.' },
  { id: 'spelling', subject: 'English', topicLabel: 'Spelling Correction', avgQuestions: '1-2', weightage: 5, scoringEase: 7, timeRequired: 3, isTrap: false, description: 'Easy marks if reading habit is good. Can use elimination.' },

  // ── GS ──
  { id: 'current_affairs', subject: 'GS', topicLabel: 'Current Affairs', avgQuestions: '4-6', weightage: 9, scoringEase: 5, timeRequired: 7, isTrap: false, description: 'Read last 6 months. High weightage, unpredictable.' },
  { id: 'polity', subject: 'GS', topicLabel: 'Polity', avgQuestions: '2-4', weightage: 7, scoringEase: 8, timeRequired: 4, isTrap: false, description: 'Articles, Amendments, President. Fixed syllabus, very high GS ROI.' },
  { id: 'history_ancient', subject: 'GS', topicLabel: 'Ancient & Medieval History', avgQuestions: '2-3', weightage: 6, scoringEase: 2, timeRequired: 9, isTrap: true, description: 'Vast syllabus, low yield. Do only PYQ and major dynasties initially.' },
  { id: 'history_modern', subject: 'GS', topicLabel: 'Modern History', avgQuestions: '2-3', weightage: 6, scoringEase: 7, timeRequired: 4, isTrap: false, description: 'Freedom struggle (1857-1947). Story-like, easy to remember. Better ROI than Ancient.' },
  { id: 'science', subject: 'GS', topicLabel: 'General Science', avgQuestions: '4-5', weightage: 8, scoringEase: 6, timeRequired: 6, isTrap: false, description: 'Focus on Biology (vitamins, diseases) and basic Physics concepts.' },
  { id: 'statig_gk', subject: 'GS', topicLabel: 'Static GK', avgQuestions: '3-5', weightage: 8, scoringEase: 4, timeRequired: 8, isTrap: false, description: 'Dances, festivals, firsts in India. Pure cramming but high yield.' },
  { id: 'economy', subject: 'GS', topicLabel: 'Economics', avgQuestions: '1-2', weightage: 4, scoringEase: 4, timeRequired: 6, isTrap: true, description: 'Demand/Supply, Five Year Plans. Sometimes tricky and low weightage.' },
  { id: 'geography', subject: 'GS', topicLabel: 'Geography', avgQuestions: '2-3', weightage: 6, scoringEase: 6, timeRequired: 7, isTrap: false, description: 'Indian Rivers, Mountains, Passes. Conceptual and straightforward.' },
];

// ROI Calculation Engine
// roiScore = weightage + scoringEase - timeRequired
export const SYLLABUS: CalculatedTopic[] = RAW_DATA.map(topic => {
  const roiScore = topic.weightage + topic.scoringEase - topic.timeRequired;
  
  let roiLevel: ROILevel = 'Medium';
  if (topic.isTrap || roiScore <= 5) roiLevel = 'Low';
  else if (roiScore >= 10) roiLevel = 'High';

  return { ...topic, roiScore, roiLevel };
});

export const getSubjectsData = () => {
  const subjects: Subject[] = ['Quant', 'Reasoning', 'English', 'GS'];
  return subjects.map(sub => ({
    name: sub,
    topics: SYLLABUS.filter(t => t.subject === sub).sort((a,b) => b.roiScore - a.roiScore)
  }));
};
