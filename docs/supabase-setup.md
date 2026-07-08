# Supabase 설정 가이드 (사용자님이 직접 하셔야 하는 부분)

이 문서는 계정 권한이 필요해서 제가 대신 할 수 없는 부분만 모았습니다. 순서대로 따라 해주세요.
막히는 부분이 있으면 어느 단계에서 막혔는지 알려주시면 제가 화면 설명을 더 자세히 드릴게요.

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 접속 → 우측 상단 **Start your project** 클릭
2. GitHub 계정 또는 이메일로 회원가입/로그인
3. **New project** 클릭
4. 아래 값 입력
   - **Name**: `outfit-archive` (원하는 이름으로 변경 가능)
   - **Database Password**: 임의의 비밀번호 생성 (따로 메모해 두세요. 나중에 필요할 수 있어요)
   - **Region**: `Northeast Asia (Seoul)` 이 보이면 선택, 없으면 가까운 지역 선택
5. **Create new project** 클릭 후 1~2분 정도 기다립니다 (프로젝트 생성 중).

## 2. API 키 복사해서 저에게 전달하기

1. 왼쪽 메뉴 하단의 **Project Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 아래 두 값을 복사합니다.
   - **Project URL** (예: `https://xxxxxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열, `eyJ...` 로 시작)
4. 이 두 값을 저에게 채팅으로 붙여넣어 주세요. 제가 `.env` 파일에 직접 넣어드릴게요.

> 주의: **service_role** 키는 저에게도 절대 공유하지 마세요. 이 키는 앱에 넣으면 안 되는 키입니다.

## 3. 데이터베이스 테이블 만들기 (SQL 실행)

1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 이 프로젝트 폴더의 `supabase/schema.sql` 파일 내용을 전체 복사해서 붙여넣기
   (제가 이미 만들어 두었습니다 — 파일 탐색기에서 `ootd/supabase/schema.sql` 열어서 전체 선택 후 복사하시면 됩니다)
4. 우측 하단 **Run** 버튼 클릭
5. "Success. No rows returned" 메시지가 나오면 성공입니다.

이 SQL은 다음을 자동으로 만들어줍니다.
- `outfit_photos`, `outfit_items` 테이블
- 본인 데이터만 보고 쓸 수 있게 하는 보안 정책(RLS)

## 4. Storage 버킷 만들기

1. 왼쪽 메뉴에서 **Storage** 클릭
2. **New bucket** 클릭
3. 이름에 정확히 `outfit-photos` 입력 (오탈자 없이 정확히 입력해야 합니다)
4. **Public bucket** 옵션은 **꺼짐(비공개)** 상태로 두고 생성
5. 생성 후 별도 정책 설정은 필요 없습니다 — 위 3단계 SQL 실행 시 Storage 접근 정책도 함께 생성되었습니다.

## 5. 이메일 로그인(매직 링크) 확인

1. 왼쪽 메뉴에서 **Authentication** → **Providers** 클릭
2. **Email** 항목이 활성화(Enabled)되어 있는지 확인 (기본값으로 켜져 있는 경우가 많습니다)
3. **Authentication** → **URL Configuration** 메뉴로 이동
4. **Site URL** 에 나중에 배포할 GitHub Pages 주소를 입력합니다.
   - 예: `https://내계정.github.io/ootd/`
   - 아직 배포 전이라면 `http://localhost:5183/ootd/` 를 임시로 넣어도 됩니다. 배포 후 다시 알려주시면 제가 안내해드릴게요.
5. **Redirect URLs** 에도 같은 주소를 추가합니다.

## 6. 값 전달 방법

아래 두 가지를 채팅으로 알려주세요.
1. Project URL
2. anon public 키

전달해주시면 제가 `.env` 파일을 만들어서 실제 Supabase와 연결하겠습니다 (8단계 작업).

## 참고: 비용

Supabase Free 플랜 기준으로 시작하면 됩니다. 데이터베이스 500MB, Storage 1GB까지 무료입니다.
사진이 많아지면 언젠가 유료 플랜 전환이 필요할 수 있습니다. 이 앱은 백업(JSON 내보내기)과 별도로,
중요한 원본 사진은 아이폰 갤러리/iCloud에도 보관하는 것을 권장합니다.
