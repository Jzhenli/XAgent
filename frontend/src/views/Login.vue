<template>
  <div class="login-page">
    <!-- 左侧：品牌标识、登录表单、页脚 -->
    <div class="login-left">
      <div class="login-logo">
        <img class="logo-image" src="@/assets/login/logo.svg" alt="logo" />
        <img
          class="logo-text"
          src="@/assets/login/lubanx_dark.svg"
          alt="lubanx_dark"
        />
      </div>

      <div class="login-form-section">
        <h1 class="login-title">{{ t("login.title") }}</h1>
        <div class="login-subtitle">
          <img class="logo-sub" src="@/assets/login/XPlay.svg" alt="XPlay" />
          <span class="brand-x">{{ t("login.subtitle") }}</span>
        </div>

        <el-form class="login-form" @submit.prevent="handleLogin">
          <el-form-item>
            <el-input
              v-model="loginForm.username"
              :placeholder="t('login.username')"
              size="large"
              prefix-icon="User"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('login.password')"
              size="large"
              prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <div class="lang-switch-wrapper">
            <el-dropdown trigger="click" @command="handleLanguageChange">
              <span class="lang-switch-text">
                {{ currentLanguageLabel }}
                <el-icon><Switch /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="opt in languageOptions"
                    :key="opt.value"
                    :command="opt.value"
                  >
                    {{ opt.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              {{ t("login.loginBtn") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="login-footer">
        <span>{{ t("login.footer") }}</span>
        <span class="footer-link" @click="openAboutDialog">{{
          t("login.aboutUs")
        }}</span>
        <span class="footer-link">{{ t("login.contactUs") }}</span>
      </div>

      <el-dialog
        v-model="aboutDialogVisible"
        :title="t('login.aboutUs')"
        width="460px"
        align-center
        class="about-dialog"
      >
        <div class="about-content">
          <img class="about-logo" src="@/assets/login/logo.svg" alt="logo" />
          <div class="about-product">XPlay by LUBANX</div>
          <div class="about-version-list">
            <div class="about-version-row">
              <span class="about-version-label">{{
                t("login.softwareVersion")
              }}</span>
              <span class="about-version-value">{{
                versionInfo.software
              }}</span>
            </div>
            <div class="about-version-row">
              <span class="about-version-label">{{
                t("login.uiVersion")
              }}</span>
              <span class="about-version-value">{{ versionInfo.ui }}</span>
            </div>
            <div class="about-version-row">
              <span class="about-version-label">{{
                t("login.backendVersion")
              }}</span>
              <span class="about-version-value">{{ versionInfo.backend }}</span>
            </div>
          </div>
          <div class="about-company">无锡研奇智联技术有限公司</div>
          <div class="about-copyright">
            Control © 2024 Adveco Technology Co., Ltd. All rights reserved.
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 右侧：登录背景图 -->
    <div class="login-right">
      <img
        class="right-image"
        src="@/assets/login/login_background.png"
        alt="login background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { Switch } from "@element-plus/icons-vue";
import { systemApi } from "@/api/system";
import packageInfo from "../../package.json";

/** 路由实例 */
const router = useRouter();
/** 当前路由信息，用于读取登录后回跳地址 */
const route = useRoute();
/** 用户状态管理 */
const userStore = useUserStore();
/** i18n 实例 */
const { t, locale } = useI18n();

/** 登录表单数据 */
const loginForm = ref({ username: "", password: "" });
/** 登录按钮 loading 状态 */
const loading = ref(false);
/** 关于我们弹框显隐 */
const aboutDialogVisible = ref(false);
/** 版本信息：软件版本、UI 版本、后端版本 */
const versionInfo = ref({
  software: "3.0.0",
  ui: packageInfo.version,
  backend: "-",
});

/** 支持的语言列表 */
interface LanguageOption {
  value: "zh-CN" | "en" | "zh-TW";
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
];

/** 当前选中语言的可读名称 */
const currentLanguageLabel = computed(() => {
  const matched = languageOptions.find((option) => option.value === locale.value);
  return matched ? matched.label : locale.value;
});

/**
 * 切换语言
 * @param lang 目标语言代码
 */
function handleLanguageChange(lang: string) {
  locale.value = lang as "zh-CN" | "en" | "zh-TW";
  localStorage.setItem("locale", lang);
}

/** 打开关于我们弹框，并尝试从后端获取最新版本信息 */
async function openAboutDialog() {
  aboutDialogVisible.value = true;
  // try {
  //   const data = await systemApi.getVersion();
  //   versionInfo.value.software = data.software || versionInfo.value.software;
  //   versionInfo.value.backend = data.backend || versionInfo.value.backend;
  // } catch {
  //   // 后端接口不可用时保留默认版本信息
  // }
}

/** 处理登录提交 */
async function handleLogin() {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning(t("login.pleaseEnterCredentials"));
    return;
  }

  loading.value = true;
  try {
    const success = await userStore.login(
      loginForm.value.username,
      loginForm.value.password,
    );
    if (success) {
      ElMessage.success(t("login.loginSuccess"));
      const redirect = (route.query.redirect as string) || "/dashboard";
      router.push(redirect);
    } else {
      ElMessage.error(t("login.loginFailed"));
    }
  } catch {
    ElMessage.error(t("login.loginError"));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.login-page {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  overflow: hidden;
  background: radial-gradient(farthest-side at 0% 0%, #383477ff, #19162aff);
  font-family:
    "PingFang SC",
    "Microsoft YaHei",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

/* 左侧表单区 */
.login-left {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 9px;
}

.logo-image {
  width: 28px;
  height: 28px;
  display: block;
}

.logo-text {
  width: 120px;
  height: 28px;
  display: block;
}

.login-form-section {
  flex: 1;
  width: 40%;
  min-width: 280px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-title {
  font-size: 40px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.93);
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.login-subtitle {
  margin: 0 0 40px 0;
  display: flex;
}

.logo-sub {
  width: 80px;
  height: 28px;
  display: block;
}

.brand-x {
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.93);
  white-space: nowrap;
  flex-shrink: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.login-form :deep(.el-input__wrapper) {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.93);
  border-radius: 0;
  box-shadow: none;
  padding: 0 12px;
  height: 42px;
  transition: all 0.25s ease;
}

.login-form :deep(.el-input__inner) {
  color: #ffffff;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.login-form :deep(.el-input__icon) {
  color: rgba(255, 255, 255, 0.93);
  font-size: 24px;
}

.login-form :deep(.el-input__suffix-inner) {
  color: rgba(255, 255, 255, 0.35);
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  border: none;
  background: rgba(102, 102, 255, 1);
  margin-top: 20px;
}

.login-btn:hover,
.login-btn:focus {
  background: rgba(102, 102, 255, 1);
}

.lang-switch-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.lang-switch-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.93);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.lang-switch-text:hover,
.lang-switch-text:focus {
  color: rgba(255, 255, 255, 0.7);
}

.lang-switch-text .el-icon {
  font-size: 16px;
}

/* 关于我们弹框 */
:deep(.el-dialog) {
  background: rgba(0, 0, 0, 1);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(50px);
}

:deep(.el-dialog__header) {
  padding: 4px 24px 0;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  color: rgba(255, 255, 255, 0.93);
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn) {
  top: 5px;
  right: 16px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: rgba(255, 255, 255, 0.93);
  font-size: 24px;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: rgba(255, 255, 255, 1);
}

:deep(.el-dialog__body) {
  padding: 8px 24px 32px;
}

.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
}

.about-logo {
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
}

.about-product {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.about-version-list {
  display: flex;
  gap: 6px;
  margin-bottom: 60px;
}

.about-version-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.about-version-label {
  color: rgba(255, 255, 255, 0.6);
}

.about-version-value {
  color: rgba(255, 255, 255, 0.93);
  font-weight: 400;
}

.about-company {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
}

.about-copyright {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.login-footer {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.93);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.footer-link {
  cursor: pointer;
  transition: color 0.2s;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.5);
}

/* 右侧几何背景区 */
.login-right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.right-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .login-left {
    flex: 0 0 50%;
    padding: 48px 32px;
  }
}

@media (max-width: 768px) {
  .login-left {
    flex: 1;
    max-width: 100%;
    min-width: auto;
    padding: 40px 32px;
  }

  .login-right {
    display: none;
  }

  .login-title {
    font-size: 26px;
  }

  .login-subtitle {
    font-size: 12px;
    margin-bottom: 32px;
  }

  .login-form :deep(.el-input__wrapper) {
    height: 44px;
  }

  .login-form :deep(.el-input__inner) {
    height: 42px;
    line-height: 42px;
  }

  .login-btn {
    height: 44px;
  }
}

@media (max-width: 375px) {
  .login-title {
    font-size: 24px;
  }
}
</style>
