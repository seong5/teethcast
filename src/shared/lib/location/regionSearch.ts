/* 행정구역 JSON 데이터를 로드하고 검색하는 유틸리티 */

import { isHierarchicalRegions } from '@/shared/types/guards'
import { fetchAPIWithGuard } from '@/shared/api/fetch'
import { normalizeSidoName } from './formatAddress'
import type { HierarchicalRegions } from '@/shared/types/location'

let regionsCache: HierarchicalRegions | null = null

export async function loadRegions(): Promise<HierarchicalRegions> {
  if (regionsCache) {
    return regionsCache
  }

  try {
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

function formatSearchResults(
  results: Array<{ sido: string; sigungu: string; dong?: string }>,
): string[] {
  return results.map((r) => {
    const parts = [r.sido, r.sigungu]
    if (r.dong) parts.push(r.dong)
    return parts.join(' ')
  })
}

export function searchRegions(query: string, regions: HierarchicalRegions): string[] {
  const trimmed = query.trim()
  if (!trimmed || Object.keys(regions).length === 0) return []

  const parts = trimmed.split(/\s+/).filter((part) => part.length > 0)
  const results: Array<{ sido: string; sigungu: string; dong?: string }> = []

  if (parts.length === 1) {
    const word = parts[0]

    if (regions[word]) {
      Object.keys(regions[word]).forEach((sigungu) => {
        results.push({ sido: word, sigungu })
      })
    } else {
      Object.keys(regions).forEach((sido) => {
        Object.keys(regions[sido]).forEach((sigungu) => {
          if (sigungu.toLowerCase().includes(word.toLowerCase())) {
            results.push({ sido, sigungu })
            regions[sido][sigungu].forEach((dong) => {
              results.push({ sido, sigungu, dong })
            })
          } else {
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
    const [first, second] = parts
    const normalizedSido = normalizeSidoName(first)
    const sidoToTry = normalizedSido || first

    if (regions[sidoToTry]?.[second]) {
      regions[sidoToTry][second].forEach((dong) => {
        results.push({ sido: sidoToTry, sigungu: second, dong })
      })
    } else {
      Object.keys(regions).forEach((s) => {
        if (s.toLowerCase().includes(sidoToTry.toLowerCase())) {
          Object.keys(regions[s]).forEach((sg) => {
            if (sg.toLowerCase().includes(second.toLowerCase())) {
              regions[s][sg].forEach((dong) => {
                results.push({ sido: s, sigungu: sg, dong })
              })
            }
          })
        }
      })
    }

    if (results.length === 0) {
      Object.keys(regions).forEach((s) => {
        Object.keys(regions[s]).forEach((sg) => {
          if (sg.toLowerCase().includes(first.toLowerCase())) {
            regions[s][sg].forEach((d) => {
              if (d.toLowerCase().includes(second.toLowerCase())) {
                results.push({ sido: s, sigungu: sg, dong: d })
              }
            })
          }
        })
      })
    }
  } else if (parts.length >= 3) {
    const [sido, sigungu, dong] = parts

    if (regions[sido]?.[sigungu]?.includes(dong)) {
      results.push({ sido, sigungu, dong })
    } else {
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

  const limitedResults = uniqueResults.slice(0, 10)

  if (limitedResults.length === 0) {
    return ['해당 장소의 정보가 제공되지 않습니다.']
  }

  return formatSearchResults(limitedResults)
}

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
