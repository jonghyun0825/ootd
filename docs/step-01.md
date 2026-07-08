# Step 01. 요구사항 정리 및 기술 스택 확정

## 목표
- 명세서의 핵심 요구사항을 확정하고, 앱 전체의 기준선(scope)을 문서화한다.
- GitHub Pages + Supabase 구조에서 "코드로 해결 가능한 부분"과 "사용자가 계정에서 직접 해야 하는 부분"을 분리한다.
- 기술 스택을 확정한다: Vite + React + TypeScript + Supabase JavaScript Client, 순수 CSS.

## 범위
- 기능 범위: 로그인, 홈, 필터, 업로드, 아카이브, 상세, 수정 화면
- 금지 기능: AI 이미지 분석, 자동 태깅, 텍스트 검색창, SNS 공유, 추천 기능, 결제, 관리자 페이지
- 저장소 원칙: 사진 파일 = Supabase Storage / 태그·메모 = Supabase Database / 로그인 = Supabase Auth / IndexedDB·localStorage = 임시 캐시·설정 전용

## 완료 기준
- [x] 핵심 요구사항 요약 완료
- [x] 사용자 액션이 필요한 항목(Supabase 프로젝트 생성, GitHub repo 생성, 환경변수 입력 등) 목록화 완료
- [x] 기술 스택 확정 완료 (Vite + React + TypeScript + Supabase JS Client)
