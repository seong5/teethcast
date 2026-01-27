'use client';

import { useState } from 'react';
import { SearchBar } from '@/shared/ui';

export function HomePage() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log('검색:', searchValue);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Teethcast
        </h1>
        <p className="text-center text-lg mb-12">
          우리나라 각 지역에 대한 날씨 정보를 확인할 수 있는 서비스입니다.
        </p>
        <div className="w-full">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
            onSearchClick={handleSearch}
          />
        </div>
      </div>
    </main>
  );
}
