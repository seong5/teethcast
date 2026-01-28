'use client';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearchClick?: () => void;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '검색...',
  onSearchClick,
  className = '',
}: SearchBarProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/20 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/20 sm:gap-4 sm:rounded-3xl sm:p-6 md:flex-row ${className}`}
      role="search"
      aria-label="검색"
    >
      <div className="relative w-full flex-1">
        <label htmlFor="search-input" className="sr-only">
          {placeholder || '검색어 입력'}
        </label>
        <input
          id="search-input"
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && onSearchClick) {
              onSearchClick();
            }
          }}
          aria-label={placeholder || '검색어 입력'}
          className="w-full rounded-xl border-none bg-slate-50 py-3 px-3 text-sm font-medium text-black outline-none transition-all focus:ring-4 focus:ring-[#10a6c1]/20 focus:border focus:border-[#10a6c1] dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:rounded-2xl sm:py-3.5 sm:px-4"
        />
      </div>
      {onSearchClick && (
        <div className="flex w-full md:w-auto">
          <button
            onClick={onSearchClick}
            aria-label="검색 실행"
            className="flex flex-1 items-center justify-center rounded-xl border border-[#10a6c1] bg-[#10a6c1] px-4 py-3 text-sm font-black text-white transition-all hover:bg-[#0d8fa8] focus:outline-none focus:ring-2 focus:ring-[#10a6c1] focus:ring-offset-2 sm:rounded-2xl sm:px-6 sm:py-3.5 md:flex-none"
          >
            검색
          </button>
        </div>
      )}
    </div>
  );
}
