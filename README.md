<div align="center">

# 👑 SSC CGL Elite Mentor

**An AI-powered, performance-driven coaching platform for SSC CGL aspirants.**  
Built to be brutal with your scores — and laser-focused on your improvement.

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

SSC CGL Elite Mentor is a **full-stack, AI-first web application** that replaces generic coaching advice with a personalised, brutally honest mentor experience. Students log their mock test results; the platform runs them through a Gemini-powered analysis pipeline and returns structured feedback — weaknesses ranked, root causes identified, and a concrete hour-by-hour study plan generated in seconds.

The entire product runs **client-side + one lightweight API route** with no database — perfect for instant deployment on Vercel.

---

## ✨ Feature Highlights

| Module | Description |
|---|---|
| **📊 Performance Logger** | Log full / sectional test scores with subject-level breakdown |
| **🤖 AI Mentor Feedback** | Gemini analyses every number and returns actionable coaching cards |
| **⚡ Readiness Engine** | Topic-level drills with PYQ-style questions and a readiness verdict |
| **🧭 Clarity Hub** | Full SSC CGL syllabus explorer with trap-alerts and exam strategy |
| **📈 Analytics Dashboard** | Score trend charts, mistake distribution, streak tracking, badge wall |
| **🧠 Smart Revision Tracker** | 1-3-7 spaced-repetition scheduler with streak system and bulk-complete flow |
| **🎖️ Badge System** | Achievement badges that unlock as you hit milestones |
| **🌗 Dark / Light Mode** | Smooth theme toggle persisted across sessions |
| **⚔️ Strict Mode** | Toggle a no-mercy mentor persona for maximum pressure |

---

## 🏗️ Tech Stack

```
Framework   : Next.js 16 (App Router)
Language    : TypeScript 5
UI          : React 19 + Tailwind CSS v4 + Framer Motion 12
AI Backend  : Google Gemini API (via /api/mentor route)
Storage     : localStorage (zero-backend, instant deploy)
Icons       : Lucide React
Fonts       : Geist Sans / Geist Mono (via next/font)
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/mentor/          # Gemini AI route handler
│   ├── clarity/             # Syllabus & strategy explorer
│   ├── history/             # Analytics & export
│   ├── readiness/           # Topic drill engine (+ /test, /results)
│   ├── revision/            # Smart Revision Tracker (1-3-7 system)
│   ├── report/              # Detailed report view
│   ├── globals.css          # Design tokens & theme variables
│   ├── layout.tsx           # Root layout with Navbar
│   └── page.tsx             # Performance logger (home)
│
├── components/
│   ├── revision/
│   │   ├── TopicLogger.tsx  # Log today's studied topic
│   │   └── RevisionList.tsx # Pending / upcoming / done dashboard
│   ├── clarity/             # Syllabus accordion, trap alerts
│   ├── readiness/           # Topic selector, stats, drill UI
│   ├── InputForm.tsx        # Score entry form
│   ├── MentorResponseCards.tsx
│   ├── Navbar.tsx
│   ├── ProgressTracker.tsx
│   ├── StudyModePanel.tsx
│   ├── TodaysFocus.tsx
│   └── WeaknessIntel.tsx
│
└── lib/
    ├── storage.ts           # All localStorage read/write + revision logic
    ├── badges.ts            # Badge sync engine
    ├── readiness.ts         # Readiness scoring + localStorage layer
    ├── readiness-topics.ts  # PYQ question bank
    ├── syllabus-data.ts     # Full SSC CGL syllabus tree
    ├── theme.ts             # Theme context & hook
    └── utils.ts             # cn() utility
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 10.x (or yarn / pnpm / bun)
- A **Google Gemini API key** — [get one free](https://aistudio.google.com/app/apikey)

### 1 — Clone & install

```bash
git clone https://github.com/your-username/ssc-mentor.git
cd ssc-mentor
npm install
```

### 2 — Configure environment

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never commit `.env.local` — it is already in `.gitignore`.

### 3 — Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Smart Revision Tracker — How It Works

The **1-3-7 spaced-repetition system** is based on the well-researched Ebbinghaus forgetting curve:

1. **Log a topic** → the system auto-creates 3 revision tasks: Day+1, Day+3, Day+7.
2. **Dashboard** shows tasks in three lanes — 🔴 Pending, 🟡 Upcoming, 🟢 Completed.
3. **Mark as done** → moves to green; all 3 done → topic is marked 🏆 **Retained**.
4. **Missed revision?** → flagged as overdue with a retention-cycle warning.
5. **Bulk mode** → "Revise All Due Topics" opens a modal to blitz through everything at once.
6. **Streak system** → tracks daily revision consistency with 🔥 current and 🏆 best streaks.

All data is stored in `localStorage` under the key `ssc_revision_log`.

---

## 🌐 Deployment

### Deploy to Vercel (recommended — one click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push the repo to GitHub.
2. Import the repo in [vercel.com](https://vercel.com).
3. Add `GEMINI_API_KEY` as an **Environment Variable** in the Vercel project settings.
4. Hit **Deploy** — done.

### Build locally

```bash
npm run build   # Compile for production
npm run start   # Run the production server
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Compile production bundle |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the codebase |

---

## 🗺️ Roadmap

- [ ] Cloud sync (Supabase / Firebase) for multi-device support
- [ ] Push notifications for revision reminders (PWA)
- [ ] AI-generated revision notes per topic
- [ ] Subject-wise mock test generator
- [ ] Shareable progress cards for social motivation
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add X"`
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for SSC CGL aspirants who refuse to settle.

</div>
