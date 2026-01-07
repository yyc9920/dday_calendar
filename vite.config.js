import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: '/dday_calendar/', // 예: '/baby-dday-app/' (앞뒤 슬래시 필수)
})
