'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/shared/api';

interface Address {
  fullAddress: string;
  sido: string;
  sigungu: string;
  dong?: string;
}

interface UseReverseGeocodingReturn {
  address: Address | null;
  error: string | null;
  isLoading: boolean;
  getAddressFromCoordinates: (latitude: number, longitude: number) => Promise<void>;
}

// 카카오 API 응답 타입
interface KakaoAddressComponent {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name?: string;
  address_name: string;
}

interface KakaoDocument {
  address?: KakaoAddressComponent;
  road_address?: KakaoAddressComponent;
}

interface KakaoReverseGeocodingResponse {
  documents: KakaoDocument[];
  meta: {
    total_count: number;
  };
}

export function useReverseGeocoding(): UseReverseGeocodingReturn {
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // 카카오 로컬 API를 사용한 역지오코딩
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
      
      if (!apiKey) {
        throw new Error('카카오 API 키가 설정되지 않았습니다. 환경변수에 NEXT_PUBLIC_KAKAO_REST_API_KEY를 설정해주세요.');
      }

      // 카카오 좌표→주소 변환 API (역지오코딩)
      const response = await apiClient.get<KakaoReverseGeocodingResponse>(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json`,
        {
          params: {
            x: longitude,
            y: latitude,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        }
      );

      const documents = response.data.documents;
      
      if (documents && documents.length > 0) {
        // 지번 주소와 도로명 주소 모두 확인
        const jibunAddress = documents[0]?.address;
        const roadAddress = documents[0]?.road_address;
        
        // 동 정보는 지번 주소에서 더 정확하게 나옴
        const addressData = jibunAddress || roadAddress;
        
        if (addressData) {
        const sido = addressData.region_1depth_name || '';
        const sigungu = addressData.region_2depth_name || '';
          let dong = addressData.region_3depth_name || undefined;
          
          // 도로명 주소만 있고 동 정보가 없으면, 지번 주소에서 동 정보 가져오기
          if (!dong && roadAddress && jibunAddress) {
            dong = jibunAddress.region_3depth_name || undefined;
          }
          
          // 주소 구성: 시/구/동 (동이 있으면 반드시 포함)
          const addressParts: string[] = [];
          if (sido) addressParts.push(sido);
          if (sigungu) addressParts.push(sigungu);
          if (dong) addressParts.push(dong);
          
          const fullAddress = addressParts.join(' ') || addressData.address_name || '';

          setAddress({
            fullAddress,
            sido,
            sigungu,
            dong,
          });
        } else {
          throw new Error('주소 정보를 찾을 수 없습니다.');
        }
      } else {
        throw new Error('해당 위치의 주소 정보가 없습니다.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('주소 변환 중 오류가 발생했습니다.');
      }
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    address,
    error,
    isLoading,
    getAddressFromCoordinates,
  };
}
