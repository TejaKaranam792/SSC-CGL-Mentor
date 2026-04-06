"use client";
import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';
const KEY = 'ssc_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return { theme, toggleTheme };
}
