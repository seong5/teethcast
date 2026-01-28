/**
 * 행정구역 JSON 데이터를 로드하고 검색하는 유틸리티
 */

import { isHierarchicalRegions } from '@/shared/types/guards'
import { fetchAPIWithGuard } from '@/shared/api/fetch'

// 계층 구조 타입 정의
export type HierarchicalRegions = {
  [sido: string]: {
    [sigungu: string]: string[] // 동/읍/면 배열
  }
}

// 행정구역 데이터 캐시
let regionsCache: HierarchicalRegions | null = null

/**
 * 행정구역 JSON 파일을 로드
 */
export async function loadRegions(): Promise<HierarchicalRegions> {
  if (regionsCache) {
    return regionsCache
  }

  try {
    // 타입 가드를 사용한 안전한 fetch
    const data = await fetchAPIWithGuard<HierarchicalRegions>(
      '/data/regions.json',
      isHierarchicalRegions,
    )

    regionsCache = data
    return data
  } catch (error) {
    console.error('행정구역 데이터 로드 실패:', error)
    return {}
  }
}

/**
 * 계층 구조에서 검색 결과를 평면 주소 배열로 변환
 * @param results 검색 결과 배열 [{sido, sigungu, dong?}]
 * @returns 주소 문자열 배열 (예: ["서울특별시 종로구 청운동"])
 */
function formatSearchResults(
  results: Array<{ sido: string; sigungu: string; dong?: string }>,
): string[] {
  return results.map((r) => {
    const parts = [r.sido, r.sigungu]
    if (r.dong) parts.push(r.dong)
    return parts.join(' ')
  })
}

/**
 * 계층 구조 데이터에서 검색 수행
 * @param query 검색어
 * @param regions 계층 구조 행정구역 데이터
 * @returns 검색 결과 배열 (주소 문자열)
 */
export function searchRegions(query: string, regions: HierarchicalRegions): string[] {
  const trimmed = query.trim()
  if (!trimmed || Object.keys(regions).length === 0) return []

  const parts = trimmed.split(/\s+/).filter((part) => part.length > 0)
  const results: Array<{ sido: string; sigungu: string; dong?: string }> = []

  if (parts.length === 1) {
    // 1단어 검색
    const word = parts[0]

    // 시/도 검색
    if (regions[word]) {
      // 해당 시/도의 모든 시/군/구 반환
      Object.keys(regions[word]).forEach((sigungu) => {
        results.push({ sido: word, sigungu })
      })
    } else {
      // 시/군/구 또는 동 검색 (전체 순회)
      Object.keys(regions).forEach((sido) => {
        Object.keys(regions[sido]).forEach((sigungu) => {
          // 시/군/구 검색
          if (sigungu.toLowerCase().includes(word.toLowerCase())) {
            // 시/군/구 레벨 결과 추가
            results.push({ sido, sigungu })
            // 해당 시/군/구의 모든 동도 추가
            regions[sido][sigungu].forEach((dong) => {
              results.push({ sido, sigungu, dong })
            })
          } else {
            // 동 검색 (시/군/구가 일치하지 않는 경우만)
            regions[sido][sigungu].forEach((dong) => {
              if (dong.toLowerCase().includes(word.toLowerCase())) {
                results.push({ sido, sigungu, dong })
              }
            })
          }
        })
      })
    }
  } else if (parts.length === 2) {
    // 2단어 검색: "서울특별시 종로구"
    const [sido, sigungu] = parts

    // 정확한 경로 검색
    if (regions[sido]?.[sigungu]) {
      // 해당 시/군/구의 모든 동 반환
      regions[sido][sigungu].forEach((dong) => {
        results.push({ sido, sigungu, dong })
      })
    } else {
      // 부분 일치 검색
      Object.keys(regions).forEach((s) => {
        if (s.toLowerCase().includes(sido.toLowerCase())) {
          Object.keys(regions[s]).forEach((sg) => {
            if (sg.toLowerCase().includes(sigungu.toLowerCase())) {
              regions[s][sg].forEach((dong) => {
                results.push({ sido: s, sigungu: sg, dong })
              })
            }
          })
        }
      })
    }
  } else if (parts.length >= 3) {
    // 3단어 이상 검색: "서울특별시 종로구 청운동"
    const [sido, sigungu, dong] = parts

    // 정확한 경로 검색
    if (regions[sido]?.[sigungu]?.includes(dong)) {
      results.push({ sido, sigungu, dong })
    } else {
      // 부분 일치 검색
      Object.keys(regions).forEach((s) => {
        if (s.toLowerCase().includes(sido.toLowerCase())) {
          Object.keys(regions[s]).forEach((sg) => {
            if (sg.toLowerCase().includes(sigungu.toLowerCase())) {
              regions[s][sg].forEach((d) => {
                if (d.toLowerCase().includes(dong.toLowerCase())) {
                  results.push({ sido: s, sigungu: sg, dong: d })
                }
              })
            }
          })
        }
      })
    }
  }

  // 중복 제거
  const uniqueResults = results.reduce(
    (acc, current) => {
      const exists = acc.find(
        (item) =>
          item.sido === current.sido &&
          item.sigungu === current.sigungu &&
          item.dong === current.dong,
      )
      if (!exists) {
        acc.push(current)
      }
      return acc
    },
    [] as Array<{ sido: string; sigungu: string; dong?: string }>,
  )

  // 정확도 순으로 정렬 (정확히 일치하는 것 우선)
  const queryLowerForSort = trimmed.toLowerCase()
  uniqueResults.sort((a, b) => {
    const aStr = `${a.sido} ${a.sigungu} ${a.dong || ''}`.trim().toLowerCase()
    const bStr = `${b.sido} ${b.sigungu} ${b.dong || ''}`.trim().toLowerCase()

    const aExact = aStr === queryLowerForSort || aStr.startsWith(queryLowerForSort)
    const bExact = bStr === queryLowerForSort || bStr.startsWith(queryLowerForSort)

    if (aExact && !bExact) return -1
    if (!aExact && bExact) return 1
    return 0
  })

  // 최대 10개만 반환
  const limitedResults = uniqueResults.slice(0, 10)

  return formatSearchResults(limitedResults)
}

/**
 * 주소 문자열을 파싱하여 시/도, 시/군/구, 동/읍/면으로 분리
 * @param address 띄어쓰기 형식 주소 (예: "서울특별시 종로구 청운동")
 * @returns 파싱된 주소 정보
 */
export function parseAddress(address: string): {
  sido: string
  sigungu: string
  dong?: string
} {
  const parts = address.split(/\s+/).filter((part) => part.length > 0)
  return {
    sido: parts[0] || '',
    sigungu: parts[1] || '',
    dong: parts[2],
  }
}
