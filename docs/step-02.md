# Step 02. 프로젝트 스캐폴딩 및 폴더 구조

## 목표
- Vite + React + TypeScript 프로젝트를 생성한다.
- 명세서 19장의 권장 파일 구조를 그대로 적용한다.
- 옵션 상수(계절, 카테고리, 상의/하의/신발/아우터 종류, 색상)를 `constants/options.ts`에 정의한다.
- 데이터 타입(`OutfitPhoto`, `OutfitItem`, `BackupData` 등)을 `types/outfit.ts`에 정의한다.

## 산출물
```
project-root/
  index.html, package.json, vite.config.ts, .env.example, README.md
  src/
    main.tsx, App.tsx
    styles/global.css
    components/ (BottomNav, PhotoGrid, PhotoCard, FilterChips, UploadPhotoCard, TagForm, ConfirmDialog, LoadingState, EmptyState)
    pages/ (LoginPage, HomePage, FilterPage, UploadPage, ArchivePage, DetailPage, EditPage)
    constants/options.ts
    types/outfit.ts
    services/ (supabaseClient, authService, photoService, storageService, imageResize, backup)
    utils/ (filters, labels, dates)
```

## 완료 기준
- [ ] `npm create vite` 로 React-TS 템플릿 생성 완료
- [ ] 폴더 구조가 명세서 19장과 일치
- [ ] 타입/상수 정의 완료, TypeScript 컴파일 오류 없음
