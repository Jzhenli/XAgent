<template>
  <div class="about-us-dialog-wrapper">
    <el-dialog
      :model-value="modelValue"
      @update:model-value="(val) => emit('update:modelValue', val)"
      :title="$t('login.aboutUs')"
      :width="width"
      align-center
      :teleported="false"
    >
      <div class="about-us-content">
        <img
          v-if="showLogo"
          class="about-us-logo"
          src="@/assets/login/logo.svg"
          alt="logo"
        />
        <div class="about-us-product">XPlay by LUBANX</div>

        <div class="about-us-version-list">
          <div
            v-for="item in versionItems"
            :key="item.labelKey"
            class="about-us-version-row"
          >
            <span class="about-us-version-label">{{ $t(item.labelKey) }}</span>
            <span class="about-us-version-value">{{ item.value }}</span>
          </div>
        </div>

        <div class="about-us-company">无锡研奇智联技术有限公司</div>
        <div class="about-us-copyright">
          Control © 2024 Adveco Technology Co., Ltd. All rights reserved.
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  width?: string;
  showLogo?: boolean;
  versions?: { labelKey: string; value: string }[];
}

const props = withDefaults(defineProps<Props>(), {
  width: "460px",
  showLogo: true,
  versions: undefined,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const defaultVersions = computed(() => [
  { labelKey: "login.softwareVersion", value: "3.0.0" },
  { labelKey: "login.uiVersion", value: "-" },
  { labelKey: "login.backendVersion", value: "-" },
]);

const versionItems = computed(() => props.versions ?? defaultVersions.value);
</script>

<style scoped>
.about-us-dialog-wrapper :deep(.el-dialog) {
  background: rgba(0, 0, 0, 1);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(50px);
}

.about-us-dialog-wrapper :deep(.el-dialog__header) {
  padding: 4px 24px 0;
  margin-right: 0;
}

.about-us-dialog-wrapper :deep(.el-dialog__title) {
  color: rgba(255, 255, 255, 0.93);
  font-size: 18px;
  font-weight: 500;
}

.about-us-dialog-wrapper :deep(.el-dialog__headerbtn) {
  top: 5px;
  right: 16px;
}

.about-us-dialog-wrapper :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: rgba(255, 255, 255, 0.93);
  font-size: 24px;
}

.about-us-dialog-wrapper :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: rgba(255, 255, 255, 1);
}

.about-us-dialog-wrapper :deep(.el-dialog__body) {
  padding: 8px 24px 32px;
}

.about-us-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
}

.about-us-logo {
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
}

.about-us-product {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.about-us-version-list {
  display: flex;
  gap: 6px;
  margin-bottom: 60px;
}

.about-us-version-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.about-us-version-label {
  color: rgba(255, 255, 255, 0.6);
}

.about-us-version-value {
  color: rgba(255, 255, 255, 0.93);
  font-weight: 400;
}

.about-us-company {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
}

.about-us-copyright {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
