<template>
  <el-container class="app-layout">
    <template v-if="showSidebar">
      <el-aside
        :width="isCollapsed || shouldCollapseSidebar ? '64px' : '188px'"
        class="app-aside"
        :class="{
          collapsed: isCollapsed || shouldCollapseSidebar,
          'fullscreen-hidden': isFullscreenMode,
        }"
      >
        <div class="logo">
          <img class="logo-image" src="@/assets/login/logo.svg" alt="logo" />
          <span v-if="!isCollapsed && !shouldCollapseSidebar" class="logo-text">
            XPlay
          </span>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="app-menu"
          :collapse="isCollapsed || shouldCollapseSidebar"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
          >
            <Icon
              :name="item.icon"
              :size="28"
              type="mono-line"
              :color="{ normal: 'white' }"
            />

            <span class="menu-title" style="margin-left: 14px">{{
              item.title
            }}</span>
          </el-menu-item>
        </el-menu>

        <div class="aside-footer">
          <div class="collapse-btn" @click="toggleCollapse">
            <Icon
              name="sidebar"
              type="color-white"
              :size="32"
              :color="{ normal: 'white' }"
            />
          </div>
        </div>
      </el-aside>
    </template>

    <el-drawer
      v-if="showDrawer"
      v-model="isDrawerVisible"
      direction="ltr"
      :with-header="false"
      size="260px"
      class="mobile-drawer"
      :class="{ 'fullscreen-hidden': isFullscreenMode }"
    >
      <div class="drawer-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/login/logo.svg" alt="logo" />
          <span class="logo-text">XPlay</span>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="app-menu mobile-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.path"
            :index="item.path"
          >
            <Icon :name="item.icon" :size="32" :color="{ normal: 'white' }" />

            <span style="margin-left: 14px">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>

    <el-container :class="{ 'fullscreen-mode': isFullscreenMode }">
      <el-header
        v-if="!isFullscreenMode && !isLoginPage"
        class="app-header"
        :class="{ 'mobile-header': isMobile || isTablet }"
      >
        <div class="header-left">
          <el-button
            v-if="showDrawer"
            :icon="Menu"
            class="menu-toggle-btn"
            @click="toggleDrawer"
          />
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-badge
            :value="alertStore.pendingAlerts"
            :hidden="alertStore.pendingAlerts === 0"
          >
            <Icon
              name="alarm"
              type="mono-line"
              :size="24"
              :color="{ normal: 'rgba(247, 111, 131, 1)' }"
              @click="router.push('/alerts')"
            />
          </el-badge>
          <ThemeSwitcher />
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            popper-class="header-dropdown-popper"
            :teleported="false"
            @command="handleLanguageChange"
          >
            <div class="language-selector">
              {{ currentLanguageLabel }}
            </div>
            <template #dropdown>
              <el-dropdown-menu class="header-dropdown-menu">
                <el-dropdown-item
                  v-for="lang in languageOptions"
                  :key="lang.value"
                  :command="lang.value"
                >
                  {{ lang.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            popper-class="header-dropdown-popper"
            :teleported="false"
          >
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span v-if="!isMobile && !isTablet" class="user-name">
                {{
                  userStore.currentUser?.display_name ||
                  userStore.currentUser?.username ||
                  $t("common.notLoggedIn")
                }}
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="header-dropdown-menu">
                <el-dropdown-item v-if="userStore.isLoggedIn" disabled>
                  <el-tag
                    size="small"
                    :type="
                      userStore.currentUser?.role_name === 'admin'
                        ? 'danger'
                        : 'primary'
                    "
                  >
                    {{
                      userStore.currentUser?.role_display_name ||
                      userStore.currentUser?.role_name
                    }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/settings')">{{
                  $t("layout.personalSettings")
                }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">{{
                  $t("layout.logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main
        class="app-main"
        :class="{
          'fullscreen-main': isFullscreenMode,
          'login-main': isLoginPage,
        }"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="['Dashboard']">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  Odometer,
  Monitor,
  Connection,
  Bell,
  Setting,
  User,
  PictureFilled,
  Menu,
} from "@element-plus/icons-vue";
import { useAlertStore } from "@/stores/alerts";
import { useUserStore } from "@/stores/users";
import { useResponsive } from "@/utils/useResponsive";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import { ElMessage } from "element-plus";
import "@x-plateform/graphic-editor/dist/index.css";
import "@x-plateform-mono/common/dist/index.css";
import { Icon } from "@/icon/index";

const { t, locale } = useI18n();

const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();
const userStore = useUserStore();
const { isTablet, isMobile, width, height } = useResponsive();

const isCollapsed = ref(false);
const isDrawerVisible = ref(false);
const forceExpanded = ref(false);

const languageOptions = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
];

const currentLanguageLabel = computed(() => {
  const opt = languageOptions.find((o) => o.value === locale.value);
  return opt ? opt.label : locale.value;
});

function handleLanguageChange(lang: string) {
  locale.value = lang as "zh-CN" | "en" | "zh-TW";
  localStorage.setItem("locale", lang);
  ElMessage.success(t("common.languageChanged"));
}

const currentTime = ref(
  new Date().toLocaleString(locale.value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
let timeTimer: ReturnType<typeof setInterval>;

watch(locale, () => {
  currentTime.value = new Date().toLocaleString(locale.value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
});

const shouldCollapseSidebar = computed(() => {
  if (forceExpanded.value) return false;
  return width.value <= 1280 || height.value <= 700;
});

const allMenuItems = computed(() => [
  {
    path: "/dashboard",
    title: t("layout.dashboard"),
    icon: "dashboard",
    resource: "dashboard",
  },
  {
    path: "/channels",
    title: t("layout.channels"),
    icon: "display",
    resource: "channels",
  },
  {
    path: "/devices",
    title: t("layout.devices"),
    icon: "layer",
    resource: "devices",
  },
  {
    path: "/scada",
    title: t("layout.scada"),
    icon: "logicDeployNode",
    resource: "scada",
  },
  {
    path: "/rules",
    title: t("layout.rules"),
    icon: "graphic",
    resource: "rules",
  },
  {
    path: "/alerts",
    title: t("layout.alerts"),
    icon: "alarm",
    resource: "alerts",
  },
  {
    path: "/settings",
    title: t("layout.settings"),
    icon: "setting",
    resource: "settings",
  },
]);

const menuItems = computed(() =>
  allMenuItems.value.filter((item) =>
    userStore.hasPermission(item.resource, "view"),
  ),
);

const activeMenu = computed(() => route.path);

const pageTitle = computed(() => {
  const title = route.meta.title;
  return title ? t(title as string) : "";
});

const handleMenuSelect = (path: string) => {
  if (route.path !== path) {
    router.push(path).catch(() => {});
  }
  if (isTablet.value || isMobile.value) {
    isDrawerVisible.value = false;
  }
};

const toggleCollapse = () => {
  if (
    shouldCollapseSidebar.value ||
    width.value <= 1280 ||
    height.value <= 700
  ) {
    forceExpanded.value = !forceExpanded.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};

const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value;
};

const isFullscreenMode = ref(false);

const showSidebar = computed(
  () =>
    !isTablet.value &&
    !isMobile.value &&
    route.path !== "/login" &&
    !isFullscreenMode.value,
);
const showDrawer = computed(
  () =>
    (isTablet.value || isMobile.value) &&
    route.path !== "/login" &&
    !isFullscreenMode.value,
);
const isLoginPage = computed(() => route.path === "/login");

function handleLogout() {
  userStore.logout();
  router.push("/login");
}

onMounted(() => {
  timeTimer = setInterval(() => {
    currentTime.value = new Date().toLocaleString(locale.value, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, 1000);
});

onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer);
  }
});
</script>

<style scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
  background: var(--bg-base);
}

.app-aside {
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.app-aside.collapsed .logo {
  justify-content: center;
  padding-left: 0;
}

.app-aside.collapsed .app-menu .el-menu-item {
  margin: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.app-aside.collapsed .app-menu .el-menu-item .el-icon {
  margin: 0;
}

.app-aside.collapsed .app-menu .el-menu-item .menu-title {
  display: none !important;
}

.app-aside.collapsed .app-menu .el-menu-item > span.fa-stack {
  visibility: visible !important;
  width: 28px !important;
  height: 28px !important;
  overflow: visible !important;
}

.app-aside.collapsed .app-menu .el-menu-item.is-active {
  background: var(--bg-sidebar-active) !important;
}

.app-aside.collapsed .aside-footer {
  padding-left: 0;
  padding-right: 0;
  align-items: center;
}

.app-aside.collapsed .aside-footer .collapse-btn {
  width: 100%;
}

.app-aside.fullscreen-hidden {
  width: 0 !important;
  overflow: hidden;
  opacity: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  gap: 18px;
  border-bottom: 1px solid var(--border-sidebar);
}

.logo-image {
  width: 44px;
  height: 44px;
  display: block;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  line-height: 29px;
  color: #fff;
  letter-spacing: 1px;
}

.app-menu {
  flex: 1;
  border-right: none;
  background: transparent;
}

.app-menu .el-menu-item {
  color: var(--text-sidebar);
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 8px;
  padding-left: 8px !important;
  padding-right: 8px !important;
}

.app-menu .el-menu-item:hover {
  background: var(--bg-sidebar-hover);
  color: var(--text-sidebar-hover);
}

.app-menu .el-menu-item.is-active {
  background: var(--bg-sidebar-active);
  color: var(--text-sidebar-active);
}

.mobile-menu .el-menu-item {
  height: 56px;
  line-height: 56px;
  font-size: 16px;
}

.aside-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.collapse-btn {
  color: var(--text-sidebar);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  color: var(--text-sidebar-hover);
}

.version {
  color: var(--text-disabled);
  font-size: 12px;
  text-align: center;
}

.mobile-drawer.fullscreen-hidden {
  display: none;
}

.drawer-content {
  height: 100%;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
}

.drawer-footer {
  padding: 16px;
  border-top: 1px solid var(--border-sidebar);
}

.app-header {
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: var(--shadow-light);
}

.app-header.mobile-header {
  padding: 0 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle-btn {
  font-size: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  cursor: pointer;
  background: var(--color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.language-selector {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  outline: none;
}

.language-selector:hover {
  background: var(--bg-hover);
}

.language-selector:focus {
  outline: none;
}

.user-info:focus {
  outline: none;
}

.header-right :deep(.el-dropdown) {
  outline: none;
}

.header-right :deep(.el-dropdown:focus) {
  outline: none;
}

.header-right :deep(.el-dropdown__trigger) {
  outline: none;
}

.header-right :deep(.el-dropdown__trigger:focus) {
  outline: none;
}

/* ========== Header 下拉菜单 ========== */
.header-right :deep(.header-dropdown-menu) {
  padding: 8px;
  border-radius: 12px;
  min-width: 110px;
  background: var(--bg-modal, #fff) !important;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  animation: headerDropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes headerDropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.header-right :deep(.header-dropdown-menu .el-dropdown-menu__item) {
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: transparent !important;
  color: var(--el-text-color-primary) !important;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.header-right :deep(.header-dropdown-menu .el-dropdown-menu__item:hover),
.header-right :deep(.header-dropdown-menu .el-dropdown-menu__item:focus),
.header-right :deep(.header-dropdown-menu .el-dropdown-menu__item:active) {
  background: rgba(102, 102, 255, 0.1) !important;
  color: rgba(102, 102, 255, 1) !important;
  transform: translateX(2px);
}

.header-right :deep(.header-dropdown-menu .el-dropdown-menu__item.is-divider) {
  margin: 6px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.app-main {
  padding: 20px;
  overflow-y: auto;
}

.app-main.fullscreen-main {
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  flex: 1;
  height: 100vh !important;
}

.login-main {
  padding: 0;
  background: transparent;
}

.app-footer {
  background: var(--bg-footer);
  border-top: 1px solid var(--border-footer);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.copyright {
  color: var(--text-placeholder);
}

.icp {
  color: var(--text-placeholder);
}

.current-time {
  color: var(--text-secondary);
  font-family: "Courier New", monospace;
}

.divider {
  color: var(--border-light);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .app-main {
    padding: 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .header-right {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 8px;
  }

  .page-title {
    font-size: 14px;
  }
}
</style>

<style>
/* ========== Header 下拉菜单 Popper 容器 ========== */
.header-dropdown-popper {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.header-dropdown-popper .el-popper__arrow {
  display: none !important;
}
</style>
