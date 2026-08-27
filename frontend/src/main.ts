import './polyfill-crypto'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import './icon/style.css'
import './icon/x-icon-color.css'
import './styles/theme.css'
import './styles/element-theme.css'
import './styles/scada-select.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useThemeStore } from './stores/theme'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, { locale: zhCn })

/**
 * 全局初始化主题，确保独立布局路由（预览页 /graphic/:id/preview、/scada/:id/preview 等）
 * 不经过 MainLayout 也能正确设置 <html data-theme> 属性。
 * 必须在 useThemeStore() 之后显式重新应用：persist 插件在 store setup 执行后才恢复
 * 持久化状态，若不 re-apply，data-theme 属性可能与 store 中的主题不一致。
 */
const themeStore = useThemeStore()
themeStore.setTheme(themeStore.theme)

/**
 * Wait for router to be ready before mounting the app.
 * 
 * This is critical for desktop app webview environment where initialization
 * may be slower than in regular browsers. It ensures:
 * 1. Router is fully initialized before any navigation
 * 2. Route guards are ready to handle authentication
 * 3. Menu components have correct active state
 * 
 * Without this, navigation may not work on first load in webview.
 */
router.isReady().then(() => {
  app.mount('#app')
})
