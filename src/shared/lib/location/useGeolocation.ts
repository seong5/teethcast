'use client';

import { useState, useCallback } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  position: Position | null;
  error: string | null;
  isLoading: boolean;
  getCurrentPosition: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setPosition({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
          accuracy: geoPosition.coords.accuracy,
        });
        setIsLoading(false);
      },
      (geoError) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = '위치 정보 권한이 거부되었습니다.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case geoError.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    position,
    error,
    isLoading,
    getCurrentPosition,
  };
}
