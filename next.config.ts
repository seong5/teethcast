import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // FSD 구조를 위해 pages 디렉토리를 Pages Router로 인식하지 않도록 설정
  // src/pages는 FSD의 페이지 레이어로만 사용
};

export default nextConfig;
