<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.backup') }}</h3>
    <div class="backup-section">
      <div class="backup-actions">
        <el-button
          type="primary"
          :icon="Refresh"
          :loading="exportLoading"
          @click="emit('create')"
        >
          {{ $t('settings.backup.export') }}
        </el-button>
        <el-upload
          :show-file-list="false"
          accept=".zip"
          :auto-upload="false"
          :disabled="importLoading"
          :on-change="(file) => emit('import', file)"
        >
          <el-button :icon="Upload" :loading="importLoading">{{ $t('settings.backup.import') }}</el-button>
        </el-upload>
        <el-button
          :icon="Download"
          :disabled="backupList.length === 0"
          @click="emit('download')"
        >
          {{ $t('settings.backup.download_latest') }}
        </el-button>
      </div>

      <el-table
        :data="backupList"
        v-loading="backupLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column :label="$t('settings.backup.filename')" min-width="200">
          <template #default="{ row, $index }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-icon style="color: var(--color-primary);"><Document /></el-icon>
              <span>{{ row.filename }}</span>
              <el-tag v-if="$index === 0" type="success" size="small">{{ $t('settings.backup.latest') }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('settings.backup.size')" width="100" align="center">
          <template #default="{ row }">
            {{ row.size_mb }} MB
          </template>
        </el-table-column>
        <el-table-column :label="$t('settings.backup.created_at')" width="170" align="center">
          <template #default="{ row }">
            {{ row.created_at.replace('T', ' ').substring(0, 19) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('settings.actions_label')" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="emit('restore', row)">{{ $t('settings.backup.restore') }}</el-button>
            <el-button type="default" link size="small" @click="emit('download', row)">{{ $t('settings.backup.download') }}</el-button>
            <el-button type="danger" link size="small" @click="emit('delete', row)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty :description="$t('settings.backup.no_backup')">
            <el-button type="primary" size="small" @click="emit('create')">{{ $t('settings.backup.create_now') }}</el-button>
          </el-empty>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh, Upload, Download, Document } from '@element-plus/icons-vue'
import type { ConfigBackup } from '@/api/config'
import type { UploadFile } from 'element-plus'

defineProps<{
  backupList: ConfigBackup[]
  backupLoading: boolean
  exportLoading: boolean
  importLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'download', backup?: ConfigBackup): void
  (e: 'import', file: UploadFile): void
  (e: 'delete', backup: ConfigBackup): void
  (e: 'restore', backup: ConfigBackup): void
}>()
</script>

<style scoped>
.backup-section {
  max-width: 1000px;
}

.backup-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.settings-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-primary);
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-section h3 {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
</style>