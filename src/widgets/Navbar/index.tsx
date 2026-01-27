'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold text-[#10a6c1]">Teethcast</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              type="button"
              variant={pathname === '/' ? 'primary' : 'ghost'}
              size="sm"
              className={pathname === '/' ? '' : 'text-slate-600 hover:text-slate-900'}
            >
              홈
            </Button>
          </Link>
          <Link href="/favorites">
            <Button
              type="button"
              variant={pathname === '/favorites' ? 'primary' : 'ghost'}
              size="sm"
              className={pathname === '/favorites' ? '' : 'text-slate-600 hover:text-slate-900'}
            >
              즐겨찾기
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
