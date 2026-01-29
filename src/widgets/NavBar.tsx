'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, ThemeToggle } from '@/shared/ui';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-3">
          <span className="text-sm font-bold text-[#10a6c1] sm:text-lg md:text-xl dark:text-[#10a6c1]">Teethcast</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/">
            <Button
              type="button"
              variant={pathname === '/' ? 'primary' : 'ghost'}
              size="sm"
              className={`min-h-[36px] px-3 py-2 text-xs sm:min-h-[40px] sm:px-5 sm:py-2.5 sm:text-sm ${pathname === '/' ? '' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'}`}
            >
              홈
            </Button>
          </Link>
          <Link href="/favorites">
            <Button
              type="button"
              variant={pathname === '/favorites' ? 'primary' : 'ghost'}
              size="sm"
              className={`min-h-[36px] px-3 py-2 text-xs sm:min-h-[40px] sm:px-5 sm:py-2.5 sm:text-sm ${pathname === '/favorites' ? '' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'}`}
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
