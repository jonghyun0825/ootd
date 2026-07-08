# Step 06. Supabase 연동 준비 (문서 및 설정 파일)

## 목표
- `.env.example` 작성 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- `services/supabaseClient.ts` 작성 (환경변수 기반 클라이언트 생성)
- SQL 스키마 파일 작성: `outfit_photos`, `outfit_items` 테이블
- Row Level Security 정책 SQL 작성 (본인 데이터만 CRUD 가능)
- Supabase Storage bucket(`outfit-photos`) 및 정책 문서 작성
- 사용자가 Supabase 콘솔에서 직접 수행해야 할 절차를 `docs/supabase-setup.md`에 순서대로, 클릭 위치까지 구체적으로 안내

## 완료 기준
- [ ] `.env.example` 파일 존재, 민감 키 미포함
- [ ] SQL 파일 실행 시 오류 없이 테이블/정책 생성 가능 (문서 기준 검증)
- [ ] Storage 정책 문서에 사용자 폴더 분리(`{userId}/...`) 규칙 명시
- [ ] 사용자용 설정 가이드 문서(supabase-setup.md) 완성
