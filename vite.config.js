import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // during `netlify dev` this forwards /api to the local functions runtime
      '/api': { target: 'http://localhost:8888', changeOrigin: true },
    },
  },
})
