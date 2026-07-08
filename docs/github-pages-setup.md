# GitHub Pages 배포 가이드 (사용자님이 직접 하셔야 하는 부분)

## 1. GitHub 저장소(repository) 만들기

1. https://github.com 로그인
2. 우측 상단 **+** 버튼 → **New repository** 클릭
3. **Repository name** 입력 (예: `ootd`) — 나중에 이 이름이 배포 주소에 그대로 들어갑니다
4. **Public** 선택 (GitHub Pages 무료 배포를 위해 Public 권장)
5. **Create repository** 클릭 (README 등 추가 파일 체크는 하지 않아도 됩니다)

> 저장소 이름을 `ootd`가 아닌 다른 이름으로 만드셨다면, `vite.config.ts` 파일의 `base: '/ootd/'` 부분을
> 저에게 알려주시면 실제 저장소 이름에 맞게 제가 수정해드리겠습니다.

## 2. 코드 올리기 (push)

저장소를 만들면 GitHub가 안내하는 명령어가 보입니다. 이 부분은 제가 대신 실행해드릴 수 있으니,
저장소 만든 뒤 **저장소 주소(예: https://github.com/내계정/ootd)** 를 저에게 알려주세요.
제가 git 초기화와 첫 push를 도와드리겠습니다. (실제 push 실행 전에는 항상 먼저 확인 받겠습니다.)

## 3. Supabase 값을 GitHub Secrets에 등록하기

GitHub Actions가 빌드할 때 Supabase 접속 정보를 사용할 수 있도록 등록합니다.

1. 저장소 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Secrets and variables** → **Actions** 클릭
3. **New repository secret** 클릭
4. 아래 두 개를 각각 등록
   - Name: `VITE_SUPABASE_URL` / Secret: (Supabase Project URL)
   - Name: `VITE_SUPABASE_ANON_KEY` / Secret: (Supabase anon public 키)

## 4. GitHub Pages 활성화

1. 저장소 **Settings** → 왼쪽 메뉴 **Pages** 클릭
2. **Build and deployment** 항목의 **Source** 를 **GitHub Actions** 로 선택

이렇게 설정해두면 `main` 브랜치에 코드를 올릴(push) 때마다 자동으로 빌드되고 배포됩니다.
(배포 워크플로 파일은 `.github/workflows/deploy.yml` 에 이미 만들어 두었습니다.)

## 5. 배포 확인

1. 저장소의 **Actions** 탭에서 워크플로가 초록색 체크로 끝났는지 확인
2. **Settings → Pages** 상단에 표시되는 주소로 접속 (예: `https://내계정.github.io/ootd/`)
3. 아이폰 Safari에서 같은 주소로 접속해 정상적으로 보이는지 확인
4. Safari 공유 버튼 → **홈 화면에 추가** 로 앱처럼 사용할 수 있습니다.

## 요약: 사용자님이 저에게 알려주셔야 할 것

- [ ] GitHub 저장소 주소
- [ ] Supabase Project URL
- [ ] Supabase anon public 키

이 세 가지를 알려주시면 나머지 연결 작업은 제가 진행하겠습니다.
