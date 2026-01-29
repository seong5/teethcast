/* 계층 구조 행정구역 데이터 타입 { [시도]: { [시군구]: [동리목록] } } */
export type HierarchicalRegions = {
  [sido: string]: {
    [sigungu: string]: string[]
  }
}
