# 패션 코디 아카이브

아이폰 갤러리의 코디 사진을 계절/상의/하의/신발/아우터/색상/자유 태그로 직접 정리하고,
텍스트 검색이 아닌 **태그 선택 필터**로만 다시 찾아보는 개인용 패션 아카이브 웹앱입니다.

- AI 이미지 분석/자동 태깅 없음
- 텍스트 검색창 없음 (오직 태그 선택 필터)
- 사진·태그는 Supabase(Storage/Database)에 저장, 브라우저 저장소는 임시 캐시로만 사용
- GitHub Pages에서 정적으로 배포

## 기술 스택

Vite + React + TypeScript + Supabase JavaScript Client

## 로컬 실행

```bash
npm install
npm run dev
```

## Supabase 연결

Supabase 없이도(mock 모드) 화면은 정상 동작합니다. 실제 서비스로 쓰려면:

1. `docs/supabase-setup.md` 문서를 따라 Supabase 프로젝트/테이블/Storage를 만듭니다.
2. `.env.example` 을 참고해 `.env` 파일에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 값을 입력합니다.
3. 다시 `npm run dev` 또는 `npm run build` 실행 시 자동으로 실제 Supabase와 연결됩니다.

## 배포 (GitHub Pages)

`docs/step-10.md` 참고. `vite.config.ts`의 `base` 값이 저장소 이름과 일치해야 합니다.

## 데이터 보관 안내

사진과 태그 정보는 Supabase에 저장됩니다. 다만 어떤 서비스도 영구 보관을 100% 보장할 수
없으므로, 중요한 원본 사진은 아이폰 갤러리나 별도 클라우드에도 보관해 주세요. 아카이브 화면의
백업 내보내기 기능으로 태그 데이터를 JSON으로도 백업할 수 있습니다.

## 개발 문서

- `docs/step-01.md` ~ `docs/step-10.md`: 단계별 개발 계획과 완료 기준
- `docs/supabase-setup.md`: Supabase 계정 설정 가이드
