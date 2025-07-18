import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 确保使用相对路径
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', 'styled-components'],
          'animation-vendor': ['framer-motion'],
        }
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
