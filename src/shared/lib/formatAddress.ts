export function normalizeSidoName(sido: string): string {
  if (!sido) return ''

  if (
    sido.includes('특별시') ||
    sido.includes('광역시') ||
    sido.includes('특별자치시') ||
    sido.includes('도') ||
    sido.includes('특별자치도')
  ) {
    return sido
  }

  const sidoMap: Record<string, string> = {
    서울: '서울특별시',
    부산: '부산광역시',
    대구: '대구광역시',
    인천: '인천광역시',
    광주: '광주광역시',
    대전: '대전광역시',
    울산: '울산광역시',
    세종: '세종특별자치시',
    경기: '경기도',
    강원: '강원특별자치도',
    충북: '충청북도',
    충남: '충청남도',
    전북: '전북특별자치도',
    전남: '전라남도',
    경북: '경상북도',
    경남: '경상남도',
    제주: '제주특별자치도',
  }

  return sidoMap[sido] || sido
}

export function formatAddress(sido: string, sigungu: string, dong?: string): string {
  const parts: string[] = []
  const normalizedSido = normalizeSidoName(sido)
  if (normalizedSido) parts.push(normalizedSido)
  if (sigungu) parts.push(sigungu)
  if (dong) parts.push(dong)
  return parts.join(' ')
}

export function analyzeSearchQuery(query: string): number {
  const trimmed = query.trim()
  if (!trimmed) return 0

  const parts = trimmed.split(/\s+/)
  return parts.length
}

export function matchesSearchQuery(
  result: {
    region1depthName: string
    region2depthName: string
    region3depthName?: string
    formattedAddress: string
  },
  query: string,
): boolean {
  const trimmed = query.trim()
  if (!trimmed) return false

  const formattedLower = result.formattedAddress.toLowerCase()
  const queryLower = trimmed.toLowerCase()
  if (formattedLower.includes(queryLower)) {
    return true
  }

  const queryParts = queryLower.split(/\s+/).filter((part) => part.length > 0)
  if (queryParts.length === 0) return false

  return queryParts.every((part) => formattedLower.includes(part))
}
