"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Target, LineChart, Zap, Crown, ArrowUpRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-foreground font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">
      
      {/* ── Navbar (Landing Only) ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 border-b border-white/[0.05] bg-[#05050A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="block font-black text-white leading-none text-lg">SSC CGL</span>
              <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary mt-0.5">Elite Mentor</span>
            </div>
          </div>
          <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-slate-200 transition-colors rounded-full font-bold text-sm">
            Enter App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Ambient Background Glows ──────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/[0.08] blur-[100px] rounded-[100%] pointer-events-none" />

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-5 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-black tracking-widest text-primary uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Strict AI-Powered Coaching
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Stop giving mocks blindly. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Start extracting intelligence.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-slate-400 text-base sm:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
            The first AI mentor that forces you to confront your weaknesses. Get brutal post-test analysis, 1-day fix protocols, and a hyper-targeted ROI syllabus strategy.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 transition-all rounded-full text-white font-bold text-base shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] hover:-translate-y-1">
              Start Free Training <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-5xl mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050A] z-10 h-full w-full" />
          <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-card/50 backdrop-blur-sm p-2 sm:p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <img src="/images/analytics_dashboard.png" alt="Analytics Dashboard Interface" className="w-full h-auto rounded-xl sm:rounded-[1.5rem] border border-white/10 relative z-0" />
          </div>
        </motion.div>
      </section>

      {/* ── Feature Sections ──────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 px-5 max-w-7xl mx-auto z-10 space-y-32">
        
        {/* Feature 1: AI Mentor Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
            <img src="/images/ai_mentor_feedback.png" alt="AI Mentor Feedback UI" className="relative w-full rounded-3xl border border-white/10 shadow-2xl skew-y-2 lg:skew-y-0 lg:-rotate-2 transition-transform hover:rotate-0 duration-500" />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">Brutal AI Feedback. <br/> Zero sugarcoating.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Every mock test you log is analyzed by our strict AI mentor. It hunts down exact concept gaps, calls out poor time management, and generates a <strong>mandatory 1-Day Fix Protocol</strong> to patch your leaks before your next mock.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Root Cause Analysis for exact mistake types",
                "Actionable 1-Day Fix Protocol checklist",
                "Automated Targeted Drills generation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2: High ROI Alignment (Clarity Hub) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
              <LineChart className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">Cut the noise. <br/> Master the High-ROI syllabus.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Not all topics are created equal. The <strong>Clarity Hub</strong> analyzes the master syllabus and separates the high-weightage goldmines from the low-ROI traps, giving you a crystal-clear roadmap.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Visual ROI weightage matrix",
                "Avoid low-yield time-trap topics",
                "AI-powered 30-day focus strategy"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full opacity-50" />
             <img src="/images/clarity_ui.png" alt="Clarity UI Dashboard" className="relative w-full rounded-3xl border border-white/10 shadow-2xl -skew-y-2 lg:-skew-y-0 lg:rotate-2 transition-transform hover:rotate-0 duration-500" />
          </div>
        </div>

        {/* Feature 3: Section Readiness Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-50" />
            <img src="/images/readiness_quiz.png" alt="Readiness Quiz Mockup" className="relative w-full rounded-3xl border border-white/10 shadow-2xl skew-y-2 lg:skew-y-0 lg:-rotate-2 transition-transform hover:rotate-0 duration-500" />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">Micro-topic precision testing.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Don't guess your proficiency. Use the <strong>Readiness Engine</strong> to take blazing fast, timed PYQ micro-drills on any sub-topic to definitively prove you are exam-ready.
            </p>
            <Link href="/readiness" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors mt-2">
              Explore Readiness Engine <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature 4: Spaced Repetition (Revision) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">1→3→7 Spaced Repetition. Lock it in.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Studying once is an illusion of knowledge. Our <strong>Smart Revision Tracker</strong> automatically schedules your topics for review on Day 1, Day 3, and Day 7 to guarantee neurological retention.
            </p>
            <Link href="/revision" className="inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 transition-colors mt-2">
              Explore Smart Revision <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-amber-500/20 blur-3xl rounded-full opacity-50" />
             <img src="/images/revision_tracker.png" alt="Revision Tracker UI" className="relative w-full rounded-3xl border border-white/10 shadow-2xl -skew-y-2 lg:-skew-y-0 lg:rotate-2 transition-transform hover:rotate-0 duration-500" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="relative py-32 px-5 max-w-5xl mx-auto text-center z-10 border-t border-white/[0.05]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-[600px] h-[300px] bg-primary/[0.05] blur-[80px] rounded-[100%] pointer-events-none" />
        
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Execution is everything.</h2>
        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
          The competition isn't sleeping. Start extracting brutal intelligence from your mock tests today and scale your scores.
        </p>

        <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black hover:bg-slate-200 transition-all rounded-full font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1">
          Launch Elite Mentor App <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8 text-center text-slate-500 text-sm font-medium z-10 relative">
        <p>&copy; {new Date().getFullYear()} SSC CGL Elite Mentor. For the relentless.</p>
      </footer>
    </div>
  );
}
