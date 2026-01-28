/**
 * 시/도 약칭을 풀네임으로 변환
 * @param sido 시/도 이름 (약칭 또는 풀네임)
 * @returns 풀네임 (예: "서울" -> "서울특별시", "대전" -> "대전광역시")
 */
export function normalizeSidoName(sido: string): string {
  if (!sido) return ''

  // 이미 풀네임인 경우 그대로 반환
  if (
    sido.includes('특별시') ||
    sido.includes('광역시') ||
    sido.includes('특별자치시') ||
    sido.includes('도') ||
    sido.includes('특별자치도')
  ) {
    return sido
  }

  // 약칭을 풀네임으로 변환
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

/**
 * 주소를 띄어쓰기 형식으로 포맷팅
 * @param sido 시/도
 * @param sigungu 시/군/구
 * @param dong 동/읍/면 (선택)
 * @returns 포맷팅된 주소 (예: "서울특별시 종로구 청운동")
 */
export function formatAddress(sido: string, sigungu: string, dong?: string): string {
  const parts: string[] = []
  const normalizedSido = normalizeSidoName(sido)
  if (normalizedSido) parts.push(normalizedSido)
  if (sigungu) parts.push(sigungu)
  if (dong) parts.push(dong)
  return parts.join(' ')
}

/**
 * 검색어를 분석하여 몇 단계까지 검색해야 하는지 반환
 * @param query 검색어 (예: "서울특별시", "서울특별시 종로구", "서울특별시 종로구 청운동")
 * @returns 검색 단계 (1: 시/도만, 2: 시/군/구까지, 3: 동까지)
 */
export function analyzeSearchQuery(query: string): number {
  const trimmed = query.trim()
  if (!trimmed) return 0

  const parts = trimmed.split(/\s+/)
  return parts.length
}

/**
 * 검색 결과가 검색어와 일치하는지 확인
 * @param result 검색 결과
 * @param query 검색어
 * @returns 일치 여부
 */
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

  // 포맷팅된 주소에 검색어가 포함되어 있는지 확인 (더 유연한 매칭)
  const formattedLower = result.formattedAddress.toLowerCase()
  const queryLower = trimmed.toLowerCase()

  // 검색어가 포맷팅된 주소에 포함되어 있으면 일치
  if (formattedLower.includes(queryLower)) {
    return true
  }

  // 검색어를 공백으로 분리하여 각 부분이 주소의 어딘가에 포함되는지 확인
  const queryParts = queryLower.split(/\s+/).filter((part) => part.length > 0)
  if (queryParts.length === 0) return false

  // 모든 검색어 부분이 주소에 포함되어 있는지 확인
  return queryParts.every((part) => formattedLower.includes(part))
}
