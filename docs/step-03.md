# Step 03. 공통 컴포넌트 및 라우팅 구조

## 목표
- 하단 탭 내비게이션(홈/필터/업로드/아카이브)을 구현한다.
- 화면 전환(라우팅)을 구성한다 (react-router 대신 간단한 상태 기반 라우팅 또는 react-router-dom 사용).
- iPhone Safari safe-area, 2열 그리드, 손가락 터치 크기 등 공통 모바일 레이아웃 CSS를 정의한다.
- 공통 UI 컴포넌트(EmptyState, LoadingState, ConfirmDialog, PhotoGrid, PhotoCard)를 mock 데이터로 우선 구현한다.

## 완료 기준
- [ ] 하단 탭 클릭 시 4개 화면 전환 확인
- [ ] iPhone 시뮬레이션 폭(375px)에서 레이아웃 깨짐 없음
- [ ] safe-area-inset 적용 확인 (뷰포트 meta 및 CSS env())
