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

  if (normalizedTopic.includes("pipe") || normalizedTopic.includes("cistern")) {
    return {
      topic,
      subject,
      overview: "Pipes and Cistern is a direct extension of Time & Work, where output pipes perform 'negative work'.",
      coreRules: [
        "Inlet pipes (filling) are positive work (+).",
        "Outlet pipes (emptying) are negative work (-).",
        "Total capacity of the tank is the LCM of time taken by individual pipes.",
      ],
      shortcuts: [
        "Formula: If pipe A fills in 'x' hours and pipe B empties in 'y' hours, net work in 1 hour = (1/x - 1/y).",
        "Use fractional values or LCM units to avoid complex calculations.",
      ],
      traps: [
        "Filling vs. Emptying: Always check if the question says the tank was initially full or empty.",
        "Leakage: A leak is just an outlet pipe that works continuously.",
      ],
      examStrategy: [
        "Solve these alongside Time & Work questions as the logic is identical.",
        "Watch out for questions where pipes are opened alternately.",
      ],
      memoryHacks: [
        "Think of empty pipes as 'thieves' stealing the water that filling pipes 'earn'.",
      ],
      miniPractice: [
        {
          question: "Pipe A fills a tank in 10h, Pipe B empties it in 15h. In how many hours will the tank be full if both are opened?",
          answer: "30 hours",
          explanation: "LCM(10, 15) = 30 units. A=3 u/h, B=-2 u/h. Net = 1 u/h. Time = 30/1 = 30h."
        }
      ]
    };
  }

  if (normalizedTopic.includes("speed") || normalizedTopic.includes("distance") || normalizedTopic.includes("train")) {
    return {
      topic,
      subject,
      overview: "Time, Speed & Distance (TSD) is a foundational arithmetic topic covering relative speed, trains, and boats & streams.",
      coreRules: [
        "Core Formula: Distance = Speed × Time.",
        "Unit Conversion: 1 km/h = 5/18 m/s; 1 m/s = 18/5 km/h.",
        "Relative Speed: Add speeds if moving toward each other; subtract if moving in same direction.",
      ],
      shortcuts: [
        "Average Speed = 2xy / (x + y) when distance is constant.",
        "Ratio Method: If distance is constant, Speed ∝ 1/Time.",
        "Boats: Speed Downstream = u + v; Speed Upstream = u - v.",
      ],
      traps: [
        "Unit Mismatch: Mixing km and seconds—always normalize units first.",
        "Train Length: When a train crosses a platform, Distance = Train Length + Platform Length.",
      ],
      examStrategy: [
        "Identify if speed, distance, or time is constant to apply ratio shortcuts.",
        "Draw a simple line diagram for meeting point problems.",
      ],
      memoryHacks: [
        "Think of 'D' as the 'Dad' (Top of the triangle) in D = S × T.",
      ],
      miniPractice: [
        {
          question: "A train 150m long crosses a pole in 9s. Find its speed in km/h.",
          answer: "60 km/h",
          explanation: "Speed = 150/9 = 50/3 m/s. In km/h: (50/3) × (18/5) = 10 × 6 = 60 km/h."
        }
      ]
    };
  }

  if (normalizedTopic.includes("mensuration")) {
    return {
      topic,
      subject,
      overview: "Mensuration tests your knowledge of 2D areas and 3D volumes. Accuracy in calculation is as vital as formula memory.",
      coreRules: [
        "2D: Square, Rectangle, Circle, Triangle (Heron's formula).",
        "3D: Cube, Cuboid, Cylinder, Cone, Sphere.",
        "Pythagorean triplets are essential for diagonal and slant height calculations.",
      ],
      shortcuts: [
        "Divisibility by 11: Since π ≈ 22/7, if an option is the only one divisible by 11, it is likely the answer for circles/cylinders.",
        "Unit Digit: Use the last digit of calculations to eliminate options quickly.",
        "Successive % change for Area (x + y + xy/100).",
      ],
      traps: [
        "Radius vs Diameter: Always check which one is given—common 'silly mistake' trap.",
        "Internal vs External dimensions in hollow shapes.",
      ],
      examStrategy: [
        "Memorize the first 15 squares and cubes to speed up volume calculations.",
        "Flag complex combination shapes (e.g., cone on hemisphere) for the second pass.",
      ],
      memoryHacks: [
        "Visualize shapes as 'stacking' 2D slices—a cylinder is just a stack of circles (πr² × h).",
      ],
      miniPractice: [
        {
          question: "Find the volume of a sphere with radius 21 cm.",
          answer: "38808 cm³",
          explanation: "Volume = (4/3)πr³ = (4/3) × (22/7) × 21 × 21 × 21 = 88 × 441 = 38808."
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
