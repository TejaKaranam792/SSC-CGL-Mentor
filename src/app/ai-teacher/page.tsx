"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Target, Brain, BookOpen, Globe, Lightbulb, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const subjects = [
  { id: "quant", name: "Quantitative Aptitude", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "reasoning", name: "General Intelligence & Reasoning", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "english", name: "English Comprehension", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "gk", name: "General Awareness", icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

const actionCards = [
  { href: "/ai-teacher/mock-test", label: "Take Mini Mock Test", desc: "20 Questions, AI Evaluated", icon: PenTool },
  { href: "/ai-teacher/mistakes", label: "Mistake Tracker", desc: "Revise error patterns", icon: Lightbulb },
];

export default function AITeacherHome() {
  return (
    <div className="relative min-h-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-8">
      <main className="relative z-10 flex flex-col max-w-4xl mx-auto w-full space-y-8 mt-2">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary">
            <GraduationCap className="w-4 h-4" />
            AI Teacher
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Select Subject</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Concept clarity, shortcuts, and speed practice tailored for SSC CGL.</p>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <Link key={sub.id} href={`/ai-teacher/${sub.id}`}>
                <div className={cn("p-5 rounded-2xl border transition-all hover:scale-[1.02] flex items-center gap-4 group cursor-pointer", sub.bg, sub.border)}>
                  <div className={cn("p-3 rounded-xl bg-background shadow-sm", sub.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors">{sub.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Concepts & Practice</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-4 border-t border-border">
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actionCards.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center p-4 border border-border bg-card hover:bg-muted/50 rounded-2xl transition-all cursor-pointer gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{action.label}</h4>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
