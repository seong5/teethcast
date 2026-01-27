'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/shared/ui';
import WeatherIcon, { WindIcon, HumidityIcon } from '@/shared/ui/WeatherIcon';
import { useGeolocation, useReverseGeocoding, useWeather } from '@/shared/lib';
import type { WeatherData } from '@/shared/lib/useWeather';

export function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const { position, error, isLoading, getCurrentPosition } = useGeolocation();
  const { address, error: addressError, isLoading: addressLoading, getAddressFromCoordinates } = useReverseGeocoding();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { weather, error: weatherError, isLoading: weatherLoading, getWeather } = useWeather();

  useEffect(() => {
    // 페이지 로드 시 자동으로 현재 위치 감지
    getCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    // 위치 정보를 받으면 주소로 변환
    if (position) {
      getAddressFromCoordinates(position.latitude, position.longitude);
      // 날씨 정보도 함께 가져오기
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      getWeather(position.latitude, position.longitude);
    }
  }, [position, getAddressFromCoordinates, getWeather]);

  const handleSearch = () => {
    console.log('검색:', searchValue);
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:p-10 bg-white dark:bg-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="w-full mb-8">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
            onSearchClick={handleSearch}
          />
        </div>
        
        <h2 className="text-center text-base mb-8 text-gray-600 dark:text-gray-300 sm:text-lg sm:mb-10 md:mb-12">
          현재 내 위치의 날씨를 확인해보세요!
        </h2>
        
        {/* 위치 정보 표시 */}
        {(isLoading || addressLoading || weatherLoading) && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            현재 위치와 날씨를 확인하는 중...
          </div>
        )}
        {(error || addressError || weatherError) && (
          <div className="text-center text-sm text-red-500 dark:text-red-400 mb-4">
            {error || addressError || weatherError}
          </div>
        )}
        
        {/* 위치 및 날씨 정보 표시 */}
        {address && (
          <div className="mb-6">
            <h3 className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              현재 위치: {address.fullAddress}
            </h3>
            
            {/* 날씨 정보 카드 */}
            {/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
            {weather !== null && (() => {
              const weatherData = weather as WeatherData;
              return (
                <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-3">
                      <WeatherIcon
                        sky={weatherData.sky}
                        precipitation={weatherData.precipitation}
                        size={40}
                        aria-label={`${weatherData.sky} ${weatherData.precipitation !== '없음' ? weatherData.precipitation : ''}`.trim()}
                      />
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {weatherData.temperature}°C
                      </div>
                    </div>
                    <div className="text-lg text-gray-700 dark:text-gray-300">
                      {weatherData.sky}{' '}
                      {weatherData.precipitation !== '없음' ? `· ${weatherData.precipitation}` : ''}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm w-full">
                      <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-600 dark:text-gray-400">최저기온</div>
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {weatherData.minTemp}°C
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-gray-600 dark:text-gray-400">최고기온</div>
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {weatherData.maxTemp}°C
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">습도</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {weatherData.humidity}%
                          </div>
                        </div>
                        <HumidityIcon
                          size={24}
                          aria-label={`습도 ${weatherData.humidity}퍼센트`}
                        />
                      </div>
                      <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">풍속</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {weatherData.windSpeed}m/s
                          </div>
                        </div>
                        <WindIcon
                          size={24}
                          aria-label={`풍속 ${weatherData.windSpeed}미터`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
            
            {/* 시간대별 날씨 */}
            {/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
            {weather !== null && (() => {
              const weatherData = weather as WeatherData;
              if (weatherData.hourly && weatherData.hourly.length > 0) {
                return (
                  <div className="w-full mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      시간대별 날씨
                    </h2>
                    <div className="overflow-x-auto">
                      <div className="flex gap-4 justify-center items-center pb-2">
                        {weatherData.hourly.map((hourly, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-24 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
                          >
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {hourly.time}
                            </div>
                            <div className="flex flex-col items-center gap-1 mb-1">
                              <WeatherIcon
                                sky={hourly.sky}
                                precipitation={hourly.precipitation}
                                size={24}
                                aria-label={`${hourly.sky} ${hourly.precipitation !== '없음' ? hourly.precipitation : ''}`.trim()}
                              />
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {hourly.temperature}°C
                              </div>
                            </div>
                            {hourly.precipitation !== '없음' && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                {hourly.precipitation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            {/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
          </div>
        )}
      </div>
    </main>
  );
}
