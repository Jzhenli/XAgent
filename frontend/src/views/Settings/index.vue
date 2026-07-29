<template>
  <div class="settings-container">
    <SettingsNav v-model:active-menu="activeMenu" :compact="useCompactLayout" />

    <div class="settings-content">
      <GeneralConfig
        v-if="activeMenu === 'general'"
        :system-config="systemConfig"
        :config-loading="configLoading"
        @save="handleSave"
      />

      <LogViewer v-if="activeMenu === 'logs'" />

      <BackupPanel
        v-if="activeMenu === 'backup'"
        :backup-list="backupList"
        :backup-loading="backupLoading"
        :export-loading="exportLoading"
        :import-loading="importLoading"
        @create="handleCreateBackup"
        @download="handleDownloadConfig"
        @import="handleImportConfig"
        @delete="handleDeleteBackup"
        @restore="handleRestoreBackup"
      />

      <UserManagement v-if="activeMenu === 'users'" />

      <PermissionMatrix v-if="activeMenu === 'permissions'" />

      <VisualizationConfig v-if="activeMenu === 'visualization'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useResponsive } from "@/utils/useResponsive";
import { useUserStore } from "@/stores/users";
import { useGeneralConfig } from "./composables/useGeneralConfig";
import { useBackup } from "./composables/useBackup";
import SettingsNav from "./components/SettingsNav.vue";
import GeneralConfig from "./components/GeneralConfig.vue";
import LogViewer from "./components/LogViewer.vue";
import BackupPanel from "./components/BackupPanel.vue";
import UserManagement from "./components/UserManagement.vue";
import PermissionMatrix from "./components/PermissionMatrix.vue";
import VisualizationConfig from "./components/VisualizationConfig.vue";

const { t } = useI18n();

const { isTablet, isMobile, isMediumTablet, width } = useResponsive();

const useCompactLayout = computed(() => {
  if (isMobile.value) return true;
  if (isTablet.value) return true;
  if (isMediumTablet.value) return true;
  if (width.value <= 1366) return true;
  return false;
});

const activeMenu = ref("general");

const userStore = useUserStore();

const { systemConfig, configLoading, loadSystemConfig, handleSave } =
  useGeneralConfig();

const {
  backupList,
  backupLoading,
  exportLoading,
  importLoading,
  loadBackupList,
  handleCreateBackup,
  handleDownloadConfig,
  handleImportConfig,
  handleDeleteBackup,
  handleRestoreBackup,
} = useBackup();

onMounted(async () => {
  userStore.restoreSession();
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchRoles(),
    userStore.fetchPermissionMatrix(),
    loadBackupList(),
    loadSystemConfig(),
  ]);
});
</script>

<style scoped>
.settings-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
  /* 100px = 顶部 el-header(60px) + el-main 上下内边距(20px * 2) */
  min-height: calc(100vh - 100px);
}

@media (min-width: 1025px) {
  .settings-container {
    flex-direction: row;
  }
}

.settings-content {
  flex: 1;
  padding: 24px;
  overflow-x: auto;
  min-width: 0;
  background: var(--bg-card);
  border-radius: 16px;
}

@media (max-width: 1024px) {
  .settings-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .settings-content {
    padding: 12px;
  }
}

@media (max-height: 700px) {
  .settings-content {
    padding: 12px;
  }
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-container {
    flex-direction: column;
  }

  .settings-content {
    padding: 16px;
    overflow-x: auto;
  }
}
</style>
