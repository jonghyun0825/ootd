# Step 08. 사진 업로드/리사이징/Storage/DB 연동

## 목표
- 아이폰 갤러리에서 선택한 사진을 브라우저에서 리사이징 (큰 이미지 최대 1600px, 썸네일 최대 400px, JPEG/WebP 압축)
- 리사이징된 파일을 Supabase Storage(`photos/{userId}/{photoId}.jpg`, `thumbnails/{userId}/{photoId}.jpg`)에 업로드
- 사진 메타데이터(`outfit_photos`)와 아이템 태그(`outfit_items`)를 Supabase Database에 저장
- 여러 장 동시 업로드, 개별 진행 상태 표시, 실패 시 재시도 지원

## 완료 기준
- [ ] 사진 1장 업로드 시 Storage에 큰 이미지 + 썸네일 2개 파일 생성
- [ ] DB에 season/items/tags/memo 저장 확인
- [ ] 여러 장 업로드 시 각각 개별 태그로 저장
- [ ] 업로드 실패 시 에러 메시지 및 재시도 버튼 동작
