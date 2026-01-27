'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, ThemeToggle } from '@/shared/ui';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <span className="text-lg font-bold text-[#10a6c1] sm:text-xl dark:text-[#10a6c1]">Teethcast</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/">
            <Button
              type="button"
              variant={pathname === '/' ? 'primary' : 'ghost'}
              size="sm"
              className={pathname === '/' ? '' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'}
            >
              홈
            </Button>
          </Link>
          <Link href="/favorites">
            <Button
              type="button"
              variant={pathname === '/favorites' ? 'primary' : 'ghost'}
              size="sm"
              className={pathname === '/favorites' ? '' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'}
            >
              즐겨찾기
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
