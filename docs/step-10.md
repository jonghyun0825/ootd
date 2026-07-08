# Step 10. GitHub Pages 배포 및 마무리

## 목표
- `vite.config.ts`에 `base: "/repository-name/"` 설정
- GitHub Actions workflow로 자동 배포 구성 (push 시 build & deploy)
- README.md 작성: 프로젝트 설명, 로컬 실행법, Supabase 설정법 요약, 배포 URL
- 아이폰 Safari에서 실제 접속 및 홈 화면 추가(Add to Home Screen) 테스트

## 사용자 작업 필요
- GitHub repository 생성 및 코드 push
- Repository Settings → Pages 에서 GitHub Actions를 배포 소스로 지정
- (필요시) repository 이름에 맞춰 `vite.config.ts`의 `base` 값 확인 요청

## 완료 기준
- [ ] `npm run build` 최종 성공
- [ ] GitHub Pages 배포 URL에서 앱 정상 로드
- [ ] 아이폰 Safari에서 로그인~업로드~필터~상세~수정~삭제 전체 플로우 확인
- [ ] README에 설정 절차 및 주의사항(백업 안내 문구 포함) 명시
