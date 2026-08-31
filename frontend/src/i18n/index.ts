import { createI18n } from 'vue-i18n'
import { watch, ref } from 'vue'
import dayjs from 'dayjs'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

import zhCnEp from 'element-plus/dist/locale/zh-cn.mjs'
import enEp from 'element-plus/dist/locale/en.mjs'
import zhTwEp from 'element-plus/dist/locale/zh-tw.mjs'

// dayjs locale 包
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'

// vue-i18n locale 到 Element Plus locale 的映射
const EP_LOCALE_MAP: Record<string, any> = {
  'zh-CN': zhCnEp,
  'en': enEp,
  'zh-TW': zhTwEp,
}

// vue-i18n locale 到 dayjs locale 的映射
const DAYJS_LOCALE_MAP: Record<string, string> = {
  'zh-CN': 'zh-cn',
  'en': 'en',
  'zh-TW': 'zh-tw',
}

const defaultLocale = localStorage.getItem('locale') || 'zh-CN'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en': en,
    'zh-TW': zhTW,
  },
})

/** 当前 Element Plus 语言包 ref，供 ElConfigProvider 消费 */
export const currentEpLocale = ref<any>(EP_LOCALE_MAP[defaultLocale] ?? zhCnEp)

/**
 * 同步 dayjs 的语言到当前 vue-i18n locale
 */
function syncDayjsLocale(locale: string): void {
  const dayjsLocale = DAYJS_LOCALE_MAP[locale] ?? DAYJS_LOCALE_MAP['zh-CN']
  dayjs.locale(dayjsLocale)
}

/**
 * 同步 Element Plus 的语言到当前 vue-i18n locale
 */
function syncElementPlusLocale(locale: string): void {
  currentEpLocale.value = EP_LOCALE_MAP[locale] ?? EP_LOCALE_MAP['zh-CN']
}

// 初始化时同步一次
syncDayjsLocale(defaultLocale)
syncElementPlusLocale(defaultLocale)

// 监听 vue-i18n locale 变化，自动同步 dayjs 和 Element Plus
watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    syncDayjsLocale(newLocale)
    syncElementPlusLocale(newLocale)
  },
)

export { syncDayjsLocale, syncElementPlusLocale }
export default i18n
