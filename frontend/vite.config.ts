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
    // 生产构建开启 sourcemap：生成独立 .map 文件（JS 末尾带注释链接），
    // 方便在 DevTools 里查看源码、定位错误堆栈；
    // 若后续接入 Sentry 等错误监控，可改为 'hidden'（生成 .map 但不在 JS 里暴露链接）
    sourcemap: true
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