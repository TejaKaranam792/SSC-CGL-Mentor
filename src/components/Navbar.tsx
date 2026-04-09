"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Crown, PlusCircle, BarChart2, Sword, Sun, Moon, Zap, Compass, Brain, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { getStrictMode, setStrictMode } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

const navLinks = [
  { href: "/dashboard", label: "Mock Analyzer",   icon: PlusCircle },
  { href: "/ai-teacher", label: "AI Teacher",     icon: GraduationCap },
  { href: "/readiness", label: "Tests",           icon: Zap        },
  { href: "/clarity",   label: "Master Syllabus", icon: Compass    },
  { href: "/history",   label: "Analytics",       icon: BarChart2  },
  { href: "/revision",  label: "Revision",        icon: Brain      },
];

export function Navbar() {
  const pathname = usePathname();
  const [strict, setStrict] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setStrict(getStrictMode());
    setMounted(true);
  }, []);

  const toggleStrict = () => {
    const next = !strict;
    setStrict(next);
    setStrictMode(next);
  };

  const isLight = theme === "light";

  if (pathname === "/") return null;

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16 border-b border-border bg-background/95 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-5 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative p-1.5 sm:p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="leading-tight">
              <span className="block font-black text-foreground tracking-tight text-[0.95rem] sm:text-[1.05rem]">SSC CGL</span>
              <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-primary" style={{ opacity: 0.8 }}>Elite Mentor</span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {/* Nav Links — desktop only */}
            <div className="hidden md:flex items-center gap-1 bg-muted/50 border border-border p-1.5 rounded-2xl">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-[0.6rem] text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary text-white font-bold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            {mounted && (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                    isLight
                      ? "bg-amber-100 border-amber-300/60 text-amber-700 shadow-sm"
                      : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:block">{isLight ? "Light" : "Dark"}</span>
                </button>

                {/* Strict Mode Toggle */}
                <button
                  onClick={toggleStrict}
                  title={strict ? "Strict Mode ON — Brutal mentor" : "Enable Strict Mode"}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 border",
                    strict
                      ? "bg-red-500/15 border-red-500/40 text-red-500 shadow-sm"
                      : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Sword className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">{strict ? "Strict" : "Normal"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Bottom Tab Bar — mobile only ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border safe-area-inset-bottom">
        <div className="flex items-stretch h-16">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isActive ? "bg-primary/15" : ""
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                </div>
                <span className="leading-none tracking-tight">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
