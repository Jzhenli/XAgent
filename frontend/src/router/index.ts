import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { settingsApi } from '@/api/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
})

const ROUTE_PERMISSION_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/devices': 'devices',
  '/channels': 'channels',
  '/rules': 'rules',
  '/alerts': 'alerts',
  '/scada': 'scada',
  '/settings': 'settings',
}

// Match routes with dynamic segments
function matchRoute(path: string): string | null {
  if (ROUTE_PERMISSION_MAP[path]) {
    return ROUTE_PERMISSION_MAP[path]
  }
  // Handle /scada/:id/preview
  if (path.startsWith('/scada/') && path.endsWith('/preview')) {
    return ROUTE_PERMISSION_MAP['/scada']
  }
  // Handle /scada/:id
  if (path.startsWith('/scada/')) {
    return ROUTE_PERMISSION_MAP['/scada']
  }
  // Handle /graphic/:id/preview
  if (path.startsWith('/graphic/') && path.endsWith('/preview')) {
    return ROUTE_PERMISSION_MAP['/scada']
  }
  // Handle /graphic/:id
  if (path.startsWith('/graphic/')) {
    return ROUTE_PERMISSION_MAP['/scada']
  }
  return null
}

/** 预览路由 pattern：vant 全屏轮播、scada 预览、graphic 预览 */
const PREVIEW_ROUTE_PATTERNS: (string | RegExp)[] = [
  '/scada/vant',
  /^\/scada\/[^/]+\/preview$/,
  /^\/graphic\/[^/]+\/preview$/,
]

function isPreviewRoute(path: string): boolean {
  return PREVIEW_ROUTE_PATTERNS.some(p =>
    typeof p === 'string' ? path === p : p.test(path)
  )
}

/** 启动自动跳转预览逻辑仅执行一次的标志位（模块级） */
let startupAutoJumpDone = false

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: 'route.login', public: true }
  },
  // 预览相关路由 - 独立布局，不使用 MainLayout
  {
    path: '/scada/vant',
    name: 'VantPreview',
    component: () => import('@/views/vant/vant.vue'),
    meta: { title: 'route.preview', public: true }
  },
  {
    path: '/scada/:id/preview',
    name: 'ScadaPreview',
    component: () => import('@/views/ScadaPreview.vue'),
    meta: { title: 'route.scadaPreview', public: true }
  },
  {
    path: '/graphic/:id/preview',
    name: 'GraphicPreview',
    component: () => import('@/views/GraphicPreview/index.vue'),
    meta: { title: 'route.graphicPreview', public: true }
  },
  // 主应用路由 - 使用 MainLayout
  {
    path: '',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        // 空路径子路由：访问 '/' 时重定向到监控面板（旧顶级 '/' 重定向记录会被空路径布局记录覆盖，永远匹配不到）
        path: '',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/home/index.vue'),
        meta: { title: 'route.dashboard', icon: 'Odometer' }
      },
      {
        path: '/devices',
        name: 'Devices',
        component: () => import('@/views/Devices/index.vue'),
        meta: { title: 'route.devices', icon: 'Monitor' }
      },
      {
        path: '/channels',
        name: 'NorthChannels',
        component: () => import('@/views/Tunnels/index.vue'),
        meta: { title: 'route.channels', icon: 'Connection' }
      },
      {
        path: '/rules',
        name: 'Rules',
        component: () => import('@/views/Rules/index.vue'),
        meta: { title: 'route.rules', icon: 'Connection' }
      },
      {
        path: '/alerts',
        name: 'Alerts',
        component: () => import('@/views/Alarms/index.vue'),
        meta: { title: 'route.alerts', icon: 'Bell' }
      },
      {
        path: '/scada',
        name: 'ScadaList',
        component: () => import('@/views/ProjectList/index.vue'),
        meta: { title: 'route.scadaList', icon: 'Folder' }
      },
      {
        path: '/scada/:id',
        name: 'ScadaEdit',
        component: () => import('@/views/ScadaEditor/index.vue'),
        meta: { title: 'route.scadaEdit', icon: 'PictureFilled' }
      },
      {
        path: '/graphic/:id',
        name: 'GraphicEdit',
        component: () => import('@/views/Graphic/index.vue'),
        meta: { title: 'route.graphicEdit', icon: 'PictureFilled' }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: 'route.settings', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function findFirstAllowedPath(userStore: ReturnType<typeof useUserStore>): string {
  const paths = ['/dashboard', '/devices', '/channels', '/rules', '/alerts', '/scada', '/settings']
  for (const p of paths) {
    const resource = ROUTE_PERMISSION_MAP[p]
    if (!resource || userStore.hasPermission(resource, 'view')) {
      return p
    }
  }
  return '/dashboard'
}

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  document.title = 'XPlay'

  // ========== 启动自动跳转预览逻辑（仅首次进入时执行） ==========
  if (!startupAutoJumpDone) {
    startupAutoJumpDone = true
    try {
      // 一次请求批量读取所有 settings
      const allSettings = await settingsApi.list()
      const settings = allSettings.settings
      const autoJump = settings['visualization.auto_jump_preview']
      const lastUrl = typeof settings['visualization.last_preview_url'] === 'string'
        ? settings['visualization.last_preview_url']
        : null

      if (autoJump === true && lastUrl && isPreviewRoute(lastUrl)) {
        // 自动登录（若未登录）
        const userStore = useUserStore()
        if (!userStore.isLoggedIn) {
          userStore.restoreSession()
        }
        if (!userStore.isLoggedIn) {
          const result = await userStore.login('admin', '123456')
          if (result.success) {
            next(lastUrl)
            return
          }
          // 自动登录失败，放弃自动跳转，继续走后面的正常守卫流程
          console.warn('Auto login failed, falling back to normal flow')
        } else {
          next(lastUrl)
          return
        }
      }
      // autoJump !== true，或 lastUrl 不存在，或 lastUrl 非法 → 正常继续走原有守卫流程
    } catch (err) {
      console.warn('Startup auto-jump check failed:', err)
      // 出错时静默降级，走正常流程
    }
  }

  if (to.meta.public) {
    next()
    return
  }

  const userStore = useUserStore()
  
  // Restore session from localStorage if not already authenticated
  if (!userStore.isLoggedIn) {
    userStore.restoreSession()
  }

  if (!userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Fetch roles if not already loaded
  if (userStore.roles.length === 0) {
    try {
      await userStore.fetchRoles()
    } catch (error) {
      console.error('Failed to fetch roles:', error)
      // Continue even if roles fetch fails - user can still navigate
    }
  }

  const resource = matchRoute(to.path)
  if (resource && !userStore.hasPermission(resource, 'view')) {
    const allowed = findFirstAllowedPath(userStore)
    if (allowed === to.path) {
      next()
    } else {
      next(allowed)
    }
    return
  }

  next()
})

router.afterEach((to) => {
  NProgress.done()

  // 进入预览页时，异步保存当前 URL 供下次启动恢复
  if (isPreviewRoute(to.fullPath)) {
    settingsApi.set('visualization.last_preview_url', to.fullPath).catch(() => {})
  }
})

router.onError(() => {
  NProgress.done()
})

export default router
export { ROUTE_PERMISSION_MAP }
