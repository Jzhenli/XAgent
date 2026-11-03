import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  esbuild: {
    pure: ['console.log', 'console.info', 'console.debug']
  },
  build: {
    // sourcemap: true        // 开启：生成独立 .map 文件
    // sourcemap: 'inline'    // 开启：Base64 内嵌到 JS
    // sourcemap: 'hidden'    // 开启：生成 .map 但不在 JS 里暴露链接（适合 Sentry）
    sourcemap: false         // 关闭：生产构建不生成 .map 文件（默认值）
  },
  // 开发服务器代理
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true
      }
    }
  }
})