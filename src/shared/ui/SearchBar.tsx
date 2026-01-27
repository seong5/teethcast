'use client';

interface SearchBarProps {
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
      className={`flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/20 md:flex-row ${className}`}
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
          className="w-full rounded-2xl border-none bg-slate-50 py-3.5 px-4 text-sm font-medium text-black outline-none transition-all focus:ring-4 focus:ring-[#10a6c1]/20 focus:border focus:border-[#10a6c1]"
        />
      </div>
      {onSearchClick && (
        <div className="flex w-full md:w-auto">
          <button
            onClick={onSearchClick}
            aria-label="검색 실행"
            className="flex flex-1 items-center justify-center rounded-2xl border border-[#10a6c1] bg-[#10a6c1] px-6 py-3.5 text-sm font-black text-white transition-all hover:bg-[#0d8fa8] focus:outline-none focus:ring-2 focus:ring-[#10a6c1] focus:ring-offset-2 md:flex-none"
          >
            검색
          </button>
        </div>
      )}
    </div>
  );
}
