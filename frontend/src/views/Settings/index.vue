<template>
  <div class="settings-page">
    <div class="settings-container">
      <SettingsNav
        v-model:active-menu="activeMenu"
        :compact="useCompactLayout"
      />

      <div class="settings-content">
        <GeneralConfig
          v-if="activeMenu === 'general'"
          :system-config="systemConfig"
          :config-loading="configLoading"
          @save="handleSave"
        />

        <LogsPanel v-if="activeMenu === 'logs'" />

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@/utils/useResponsive'
import { useUserStore } from '@/stores/users'
import { useGeneralConfig } from './composables/useGeneralConfig'
import { useBackup } from './composables/useBackup'
import SettingsNav from './components/SettingsNav.vue'
import GeneralConfig from './components/GeneralConfig.vue'
import LogsPanel from './components/LogsPanel.vue'
import BackupPanel from './components/BackupPanel.vue'
import UserManagement from './components/UserManagement.vue'
import PermissionMatrix from './components/PermissionMatrix.vue'
import VisualizationConfig from './components/VisualizationConfig.vue'

const { t } = useI18n()

const { isTablet, isMobile, isMediumTablet, width } = useResponsive()

const useCompactLayout = computed(() => {
  if (isMobile.value) return true
  if (isTablet.value) return true
  if (isMediumTablet.value) return true
  if (width.value <= 1366) return true
  return false
})

const activeMenu = ref('general')

const userStore = useUserStore()

const {
  systemConfig,
  configLoading,
  loadSystemConfig,
  handleSave,
} = useGeneralConfig()

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
} = useBackup()

onMounted(async () => {
  userStore.restoreSession()
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchRoles(),
    userStore.fetchPermissionMatrix(),
    loadBackupList(),
    loadSystemConfig(),
  ])
})
</script>

<style scoped>
.settings-page {
  padding: 0;
}

.settings-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-container);
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  min-height: calc(100vh - 160px);
}

@media (min-width: 1025px) {
  .settings-container {
    flex-direction: row;
    min-height: calc(100vh - 200px);
  }
}

.settings-sidebar {
  width: 200px;
  border-right: 1px solid var(--border-base);
  flex-shrink: 0;
}

.settings-sidebar .el-menu {
  border-right: none;
}

.settings-tabs {
  display: flex;
  background: var(--bg-container);
  border-radius: 8px 8px 0 0;
  padding: 4px;
  gap: 4px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-base);
  overflow-x: auto;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.settings-tab:hover {
  background: var(--bg-hover);
}

.settings-tab.active {
  background: var(--color-primary);
  color: var(--text-white);
}

.settings-tab .el-icon {
  font-size: 16px;
}

.settings-content {
  flex: 1;
  padding: 24px;
  overflow-x: auto;
  min-width: 0;
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

  .settings-tabs {
    padding: 2px;
    gap: 2px;
  }

  .settings-tab {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-container {
    flex-direction: column;
    min-height: calc(100vh - 180px);
  }

  .settings-tabs {
    padding: 6px;
    gap: 6px;
  }

  .settings-tab {
    padding: 10px 14px;
    font-size: 14px;
  }

  .settings-content {
    padding: 16px;
    overflow-x: auto;
  }
}

</style>
