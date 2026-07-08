import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 저장소 이름과 base 경로가 반드시 일치해야 합니다.
// 예: 저장소 주소가 https://github.com/내계정/ootd 라면 base는 "/ootd/" 로 둡니다.
// 저장소 이름이 다르다면 아래 base 값의 "ootd" 부분만 저장소 이름으로 바꿔주세요.
export default defineConfig({
  plugins: [react()],
  base: '/ootd/',
})
