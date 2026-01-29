'use client';

import { useTheme } from '@/shared/lib';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2 sm:text-sm"
        aria-label="테마 전환"
      >
        테마
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors sm:px-3 sm:py-2 sm:text-sm"
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      {theme === 'light' ? '다크 모드' : '라이트 모드'}
    </button>
  );
}
