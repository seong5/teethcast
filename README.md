# ☀️ Teethcast (리얼티쓰 과제전형)

### 🚀 배포 : https://teethcast.vercel.app/
### 📄 상세 내용 : 노션에 정리했습니다. [이동하기](https://www.notion.so/Teethcast-2f5a3d41f82e80759a1fc90d7b235908?source=copy_link)

# ✨ 서비스 소개

### 📍 현재 위치 기반 날씨 정보
- 사용자의 현재 위치를 자동으로 인식하여 해당 지역의 실시간 날씨를 제공합니다.
- 최저/최고 기온, 풍속, 습도 등 필수 정보를 한눈에 확인할 수 있습니다.

### 📉 시간대별 및 요일별 예보
- 시간 흐름에 따른 기온 변화를 확인할 수 있습니다. (최대 6시간)
- 요일별 날씨 정보를 제공하여 주간 계획을 세우는 데 도움을 줍니다. (3일)

### 🔍 지역 검색
- 현재 위치뿐만 아니라 원하는 지역을 검색하여 우리나라의 날씨 정보를 확인할 수 있습니다.

### ⭐ 즐겨찾기
- 자주 확인하는 지역을 즐겨찾기에 추가하여 매번 검색할 필요 없이 빠르게 접근할 수 있습니다.

# ❓ 프로젝트 실행방법
### 1. 저장소 클론
- git clone [레포지토리-URL]

### 2. 프로젝트 폴더로 이동
- cd [폴더-이름]

### 3. 패키지 설치
- pnpm install

### 4. 환경 변수 설정

이 프로젝트를 실행하려면 외부 API 키가 필요합니다. 
`.env.local` 파일을 생성하고 아래의 환경 변수들을 발급받아 설정해주세요.

| 환경 변수명 | 용도 | 발급처 |
|:--- |:--- |:--- |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY` | 위치 검색 및 주소 변환 | [Kakao Developers](https://developers.kakao.com/) |
| `NEXT_PUBLIC_WEATHER_API_KEY` | 기상청 단기 예보 데이터 | [공공데이터포털](https://www.data.go.kr/) |


# 🧑‍💻 기술스택

| 구분 | 기술 |
|------|------|
| **프레임워크** | Next.js (App router)|
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS |
| **상태 관리** | Zustand |
| **데이터 페칭** | TanStack-Query |
| **HTTP 클라이언트** | Axios |
| **날짜/시간** | dayjs |
| **아이콘** | Lucide React |
| **토스트** | react-hot-toast |
| **패키지 매니저** | pnpm |
| **테스트** | Jest, Testing Library |
| **린트** | ESLint, TypeScript ESLint |
| **외부 API** | 기상청 단기예보·초단기예보, 카카오 로컬(역지오코딩/키워드 검색) |
