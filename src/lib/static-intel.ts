import { TopicIntelData } from "./storage";

export function getStaticIntel(topic: string, subject: string): Omit<TopicIntelData, "status"> {
  const normalizedTopic = topic.toLowerCase();
  
  if (normalizedTopic.includes("vocab") || normalizedTopic.includes("syn")) {
    return {
      topic,
      subject,
      overview: "Vocabulary tests your direct word knowledge. In SSC CGL, repeated PYQs form a massive chunk of this section.",
      coreRules: [
        "Learn root words (e.g., 'phil' = love, 'misan' = hate).",
        "Group words by theme (positive/negative tone).",
        "Always read the options first to eliminate obvious wrong tones.",
      ],
      shortcuts: [
        "Use elimination: If 3 options mean the exact same thing, the 4th is the answer.",
        "Prefix check: 'In-', 'Un-', 'Dis-' usually reverse the standard meaning.",
      ],
      traps: [
        "Examiners often put the exact opposite meaning in Option A to trick you if you didn't read if it asked for Antonym.",
        "Lookalike words: Assent vs Ascent.",
      ],
      examStrategy: [
        "Do not spend more than 10 seconds per question. You either know it or you don't.",
        "Mark for review only if you can comfortably eliminate 2 options.",
      ],
      memoryHacks: [
        "Connect difficult words to an absurd mental image or friend.",
        "Mnemonics: E.g., 'Assiduous' -> sounds like 'Ass (donkey) doing work' -> Hardworking.",
      ],
      miniPractice: [
        {
          question: "Find the antonym of 'MITIGATE'",
          answer: "Aggravate",
          explanation: "Mitigate means to lessen the severity. Aggravate means to make worse."
        },
        {
          question: "What is the meaning of 'To bite the dust'?",
          answer: "To fail or die.",
          explanation: "A classic idiom meaning to suffer a defeat."
        }
      ]
    };
  }

  if (normalizedTopic.includes("trigo") || normalizedTopic.includes("quant")) {
    return {
      topic,
      subject,
      overview: "Trigonometry relies heavily on standard identities, value-putting techniques, and right-angle triangle triplets.",
      coreRules: [
        "Memorize all standard triplets (3-4-5, 5-12-13, 8-15-17).",
        "Know the quadrant signs perfectly (ASTC rule).",
        "Angles for common values: 0, 30, 45, 60, 90."
      ],
      shortcuts: [
        "Value Putting: If the question has variables in options, put θ = 30° or 45° to bypass solving the equation entirely.",
        "Wait before putting 45° if options have cot/tan vs cosec/sec to avoid 1/0 or identical option values."
      ],
      traps: [
        "Forgetting to check the quadrant domain restrictions (e.g., θ in 2nd quadrant makes Cosine negative).",
        "Dividing by zero accidentally during value putting."
      ],
      examStrategy: [
        "Attempt value-putting first. If the equation gets complex, revert to basic identities.",
        "Solve these in the second pass of your exam to avoid getting stuck early on."
      ],
      memoryHacks: [
        "SOH CAH TOA for basic ratios.",
        "Add Sugar To Coffee (All, Sin, Tan, Cos) for positive quadrants."
      ],
      miniPractice: [
        {
          question: "Find the value of Sin²30° + Cos²30°",
          answer: "1",
          explanation: "Standard identity: Sin²θ + Cos²θ = 1 for any θ."
        },
        {
          question: "If Tanθ = 3/4, find Sinθ (Assume 1st quadrant)",
          answer: "3/5",
          explanation: "Using 3-4-5 triplet. Opposite=3, Adjacent=4, Hypotenuse=5. Sinθ = Opp/Hyp = 3/5."
        }
      ]
    };
  }

  // Generic Fallback for all other topics
  return {
    topic,
    subject,
    overview: `Mastering ${topic} requires strict adherence to previous year patterns and consistent revision of fundamental concepts.`,
    coreRules: [
      "Always clear basic concepts before jumping to shortcuts.",
      "Analyze PYQs (Previous Year Questions) to grasp the recurring patterns.",
      "Maintain a formula/short-notes diary specifically for this."
    ],
    shortcuts: [
      "Skip lengthy calculation setups by estimating options.",
      "Look for recurring SSC CGL structural patterns. Often the same trick repeats with different numbers."
    ],
    traps: [
      "Getting stuck on calculation-heavy variants—skip them for the second pass.",
      "Misreading 'NOT' or 'INCORRECT' in the question statement."
    ],
    examStrategy: [
      "If you can't see the path to the solution within 20 seconds, flag it and move on.",
      "Use option elimination heavily before calculating the exact final digit."
    ],
    memoryHacks: [
      "Use the 'Feynman Technique': explain the trick of this topic aloud to yourself.",
      "Connect formulas to standard visual patterns."
    ],
    miniPractice: [
      {
        question: `Sample practice question for ${topic} based on SSC CGL Tier-1 level.`,
        answer: "Sample Correct Option",
        explanation: "Applying the core formula yields this result immediately without multi-step derivation."
      },
      {
        question: "Identify the incorrect pattern in a standard tricky scenario.",
        answer: "Option C",
        explanation: "This is a classic trap where the initial assumption leads you to A, but the edge-case condition points to C."
      }
    ]
  };
}
