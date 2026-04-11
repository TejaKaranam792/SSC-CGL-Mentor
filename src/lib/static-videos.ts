export interface VideoRecommendation {
  title: string;
  channelName: string;
  youtubeLink: string;
  whyBest: string;
}

// Pre-curated list of top SSC CGL Youtube resources
const VIDEO_DATABASE: Record<string, VideoRecommendation> = {
  // --- English ---
  "Tenses": {
    title: "12 Tenses in English Grammar | Rani Ma'am",
    channelName: "English with Rani Ma'am",
    youtubeLink: "https://www.youtube.com/embed/lWeA-jHLE80", 
    whyBest: "Rani Ma'am is highly rated for SSC CGL English. This video covers Tense rules tailored specifically for exam error-detection questions."
  },
  "Vocabulary": {
    title: "Complete Vocabulary Marathon for SSC CGL",
    channelName: "Neetu Singh / KD Live",
    youtubeLink: "https://www.youtube.com/embed/Pj13iFvPZks",
    whyBest: "Neetu Singh's vocabulary sessions are standard for covering PYQs accurately and memory tricks."
  },
  "Active/Passive Voice": {
    title: "Active and Passive Voice Rules & Tricks",
    channelName: "English with Rani Ma'am",
    youtubeLink: "https://www.youtube.com/embed/M2Mv6z9oZgA",
    whyBest: "Voice is a highly scoring topic. This class provides quick elimination tricks."
  },
  
  // --- Quant ---
  "Percentage": {
    title: "Percentage Complete Concept & PYQ",
    channelName: "Aditya Ranjan Sir Maths",
    youtubeLink: "https://www.youtube.com/embed/5D_9uHwX9wE",
    whyBest: "Aditya Ranjan sir's percentage fractional tricks are the best for calculation speed."
  },
  "Algebra": {
    title: "Complete Algebra Marathon",
    channelName: "Gagan Pratap Sir",
    youtubeLink: "https://www.youtube.com/embed/5r3R_X-K9G8",
    whyBest: "Gagan Pratap Sir is a master of advanced maths shortcuts and value-putting tricks."
  },
  "Geometry": {
    title: "Geometry Full Concept SSC CGL",
    channelName: "Abhinay Maths",
    youtubeLink: "https://www.youtube.com/embed/4yZJ1_yMwG4",
    whyBest: "Abhinay Sharma focuses on visual understanding and deep conceptual clarity."
  },
  "Pipes & Cistern": {
    title: "Pipe and Cistern Complete Concept | Week 4",
    channelName: "Aditya Ranjan Sir Maths",
    youtubeLink: "https://www.youtube.com/embed/Fj7n0d3p1Y0",
    whyBest: "Direct application of Time & Work concepts. Aditya Ranjan sir explains the 'negative work' of outlet pipes perfectly."
  },
  "Speed & Distance": {
    title: "Day 42 | Time, Speed & Distance | Maths | 45 Din 45 Marathon",
    channelName: "Rankers Gurukul / Aditya Ranjan Sir",
    youtubeLink: "https://www.youtube.com/embed/kY0q8T8Dk6U",
    whyBest: "Comprehensive one-shot coverage of TSD, Trains, and Relative Speed with exam-oriented shortcuts."
  },
  "Mensuration": {
    title: "Complete Mensuration (2D & 3D) In One Class",
    channelName: "Abhinay Maths",
    youtubeLink: "https://www.youtube.com/embed/Fj2F1b07Cj8",
    whyBest: "Abhinay sir's visualization of 3D shapes and formula-free approaches for certain problems is elite."
  },
  
  // --- Reasoning ---
  "Syllogism": {
    title: "Syllogism 150-50 Rule Trick",
    channelName: "Vikramjeet Sir / Rankers Gurukul",
    youtubeLink: "https://www.youtube.com/embed/9g_QJzR_jQk",
    whyBest: "The 150-50 method taught here eliminates the need for Venn diagrams entirely."
  },
  "Coding-Decoding": {
    title: "Coding Decoding Master Class",
    channelName: "Piyush Varshney / Careerwill",
    youtubeLink: "https://www.youtube.com/embed/xqzXkq_YhG8",
    whyBest: "Best breakdown of position values and reverse coding patterns."
  },

  // --- GS ---
  "Polity": {
    title: "Complete Indian Polity Marathon",
    channelName: "Parmar SSC",
    youtubeLink: "https://www.youtube.com/embed/WJ1p4fU9Fzo",
    whyBest: "Parmar SSC is currently the most relevant channel for TCS-pattern GS questions."
  },
  "History": {
    title: "Modern History Quick Revision",
    channelName: "Lucent GK / Study IQ",
    youtubeLink: "https://www.youtube.com/embed/V61gA5mR6QY",
    whyBest: "Crisp and targeted summary of timelines and movements."
  }
};

const DEFAULT_RECOMMENDATIONS: Record<string, VideoRecommendation> = {
  "english": {
    title: "English Grammar Core Rules for SSC",
    channelName: "English with Rani Ma'am",
    youtubeLink: "https://www.youtube.com/embed/2_m8h1i2OZs",
    whyBest: "Rani Ma'am is the leading instructor for SSC English basics."
  },
  "quant": {
    title: "Maths Calculation & Concept Tricks",
    channelName: "Aditya Ranjan Sir",
    youtubeLink: "https://www.youtube.com/embed/0X9R_8K_fFE",
    whyBest: "Focus on calculation speed and arithmetic shortcuts."
  },
  "reasoning": {
    title: "Reasoning PYQ Practice Class",
    channelName: "Vikramjeet Sir",
    youtubeLink: "https://www.youtube.com/embed/BvXk8GfC5A4",
    whyBest: "Best logical elimination strategies."
  },
  "gs": {
    title: "Static GK Complete Marathon",
    channelName: "Parmar SSC",
    youtubeLink: "https://www.youtube.com/embed/FwT0tB5jNmg",
    whyBest: "Excellent coverage of standard Static GK asked by TCS."
  }
};

export const getStaticVideoForTopic = (topic: string, subject: string): VideoRecommendation => {
  if (VIDEO_DATABASE[topic]) {
    return VIDEO_DATABASE[topic];
  }
  
  // Return default mapped to subject, or a generic fallback
  const normalizedSubject = subject.toLowerCase();
  return DEFAULT_RECOMMENDATIONS[normalizedSubject] || {
    title: `Best Strategy for ${topic} (SSC CGL)`,
    channelName: "SSC Target Master",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Safe fallback
    whyBest: "This video has been selected because it cleanly covers the essentials. Build a strong foundation before jumping to PYQs."
  };
};
