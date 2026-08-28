import './polyfill-crypto'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus, { ElTooltip } from 'element-plus'
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
 * 全局 Tooltip 默认行为补丁（对所有 <el-tooltip> 生效，无需逐个组件修改）
 *
 * 背景：Element Plus 的 app.use(ElementPlus, { tooltip: {...} }) 全局配置
 * 实际只对 button/card/table/link 等组件生效，tooltip 并不消费该配置。
 * 因此这里通过克隆 ElTooltip 并覆盖默认 props，再全局重新注册实现。
 *
 * - hideAfter: 50 —— 触发 mouseleave 后 50ms 即隐藏
 * - autoClose: 3000 —— 显示 3 秒后自动关闭（兜底）
 *
 * autoClose 是关键：平板等触摸设备上，点击仅触发浏览器合成的 mouseenter，
 * 而 mouseleave 往往要等到点击其他元素才会触发；若用户点击后不动，
 * tooltip 会一直挂在页面上，只能依靠 autoClose 自动关闭。
 */
const GlobalTooltip = {
  ...ElTooltip,
  props: {
    ...ElTooltip.props,
    hideAfter: { type: Number, default: 50 },
    autoClose: { type: Number, default: 3000 },
  },
} as unknown as typeof ElTooltip
app.component('ElTooltip', GlobalTooltip)

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
