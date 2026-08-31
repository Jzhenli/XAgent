/// <reference types="vite/client" />

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const zhCn: Language
  export default zhCn
}

declare module 'element-plus/dist/locale/en.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const en: Language
  export default en
}

declare module 'element-plus/dist/locale/zh-tw.mjs' {
  import type { Language } from 'element-plus/es/locale'
  const zhTw: Language
  export default zhTw
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
