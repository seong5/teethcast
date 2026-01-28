const fs = require('fs');
const path = require('path');

// JSON 파일 읽기
const inputPath = path.join(__dirname, '../public/data/regions.json');
const outputPath = path.join(__dirname, '../public/data/regions.json'); // 원본 파일 덮어쓰기

console.log('JSON 파일 읽는 중...');
const flatData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

console.log(`총 ${flatData.length}개의 항목 처리 중...`);

// 계층 구조로 변환
const hierarchical = {};

flatData.forEach((item) => {
  const parts = item.split('-');
  
  if (parts.length === 1) {
    // 시/도만 있는 경우
    const sido = parts[0];
    if (!hierarchical[sido]) {
      hierarchical[sido] = {};
    }
  } else if (parts.length === 2) {
    // 시/도-시/군/구
    const [sido, sigungu] = parts;
    if (!hierarchical[sido]) {
      hierarchical[sido] = {};
    }
    if (!hierarchical[sido][sigungu]) {
      hierarchical[sido][sigungu] = [];
    }
  } else if (parts.length === 3) {
    // 시/도-시/군/구-동/읍/면
    const [sido, sigungu, dong] = parts;
    if (!hierarchical[sido]) {
      hierarchical[sido] = {};
    }
    if (!hierarchical[sido][sigungu]) {
      hierarchical[sido][sigungu] = [];
    }
    // 중복 제거
    if (!hierarchical[sido][sigungu].includes(dong)) {
      hierarchical[sido][sigungu].push(dong);
    }
  }
});

// 정렬 (시/도, 시/군/구, 동 모두 정렬)
Object.keys(hierarchical).forEach((sido) => {
  const sigunguObj = hierarchical[sido];
  Object.keys(sigunguObj).forEach((sigungu) => {
    if (Array.isArray(sigunguObj[sigungu])) {
      sigunguObj[sigungu].sort();
    }
  });
  
  // 시/군/구 키 정렬
  const sortedSigungu = {};
  Object.keys(sigunguObj).sort().forEach((key) => {
    sortedSigungu[key] = sigunguObj[key];
  });
  hierarchical[sido] = sortedSigungu;
});

// 시/도 키 정렬
const sortedHierarchical = {};
Object.keys(hierarchical).sort().forEach((key) => {
  sortedHierarchical[key] = hierarchical[key];
});

// 결과 저장
console.log('계층 구조로 변환 완료!');
console.log(`시/도 개수: ${Object.keys(sortedHierarchical).length}`);

// 파일 크기 비교
const flatSize = JSON.stringify(flatData).length;
const hierarchicalSize = JSON.stringify(sortedHierarchical).length;
const reduction = ((1 - hierarchicalSize / flatSize) * 100).toFixed(2);

console.log(`\n크기 비교:`);
console.log(`평면 구조: ${(flatSize / 1024).toFixed(2)} KB`);
console.log(`계층 구조: ${(hierarchicalSize / 1024).toFixed(2)} KB`);
console.log(`감소율: ${reduction}%`);

// Minify된 버전도 저장
const minified = JSON.stringify(sortedHierarchical);
fs.writeFileSync(outputPath, minified, 'utf-8');

console.log(`\n변환된 파일 저장 완료: ${outputPath}`);
