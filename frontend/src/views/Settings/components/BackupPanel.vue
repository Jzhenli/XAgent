<template>
  <div class="settings-section">
    <!-- 标题栏 -->
    <div class="settings-header">
      <div class="settings-section-title">{{ $t('settings.menu.backup') }}</div>
      <div class="settings-header-actions">
        <!-- 创建备份 -->
        <div
          class="action-btn accent"
          :class="{ loading: exportLoading }"
          @click="handleCreateClick"
        >
          <el-icon v-if="!exportLoading" :size="14"><Refresh /></el-icon>
          <span v-else class="btn-spinner"></span>
          <span>{{ $t('settings.backup.export') }}</span>
        </div>

        <!-- 导入备份 -->
        <el-upload
          :show-file-list="false"
          accept=".zip"
          :auto-upload="false"
          :disabled="importLoading"
          :on-change="(file) => importBackup(file)"
        >
          <div
            class="action-btn accent"
            :class="{ loading: importLoading }"
          >
            <el-icon v-if="!importLoading" :size="14"><Upload /></el-icon>
            <span v-else class="btn-spinner"></span>
            <span>{{ $t('settings.backup.import') }}</span>
          </div>
        </el-upload>

        <!-- 下载最新备份 -->
        <div
          class="action-btn download"
          :class="{ disabled: backupList.length === 0 }"
          @click="handleDownloadLatestClick"
        >
          <el-icon :size="14"><Download /></el-icon>
          <span>{{ $t('settings.backup.download_latest') }}</span>
        </div>
      </div>
    </div>

    <!-- 备份列表 -->
    <el-table
      :data="backupList"
      v-loading="backupLoading"
      stripe
      style="width: 100%"
    >
      <el-table-column :label="$t('settings.backup.filename')" min-width="200">
        <template #default="{ row, $index }">
          <div class="cell-file">
            <el-icon class="file-icon"><Document /></el-icon>
            <span>{{ row.filename }}</span>
            <el-tag v-if="$index === 0" type="success" size="small">
              {{ $t('settings.backup.latest') }}
            </el-tag>
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
          <el-button type="primary" link size="small" @click="restoreBackup(row)">
            {{ $t('settings.backup.restore') }}
          </el-button>
          <el-button type="default" link size="small" @click="downloadBackup(row)">
            {{ $t('settings.backup.download') }}
          </el-button>
          <el-button type="danger" link size="small" @click="deleteBackup(row)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty :description="$t('settings.backup.no_backup')">
          <el-button type="primary" size="small" @click="createBackup">
            {{ $t('settings.backup.create_now') }}
          </el-button>
        </el-empty>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Refresh, Upload, Download, Document } from '@element-plus/icons-vue'
import { configApi, type ConfigBackup } from '@/api/config'

const { t } = useI18n()

/** 通用错误提取工具 */
type ErrorLike = { response?: { data?: { detail?: string } }; message?: string }

const getErrorMessage = (e: unknown, fallback: string): string => {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  const err = e as ErrorLike
  return err?.response?.data?.detail || fallback
}

/** 从下载 URL 中安全提取 token，缺失时返回空字符串 */
const extractToken = (url: string): string => {
  const idx = url.indexOf('token=')
  return idx !== -1 ? url.substring(idx + 6) : ''
}

/* ------------------------------ 状态 ------------------------------ */

/** 备份列表数据 */
const backupList = ref<ConfigBackup[]>([])
/** 列表加载状态 */
const backupLoading = ref(false)
/** 导出/创建加载状态 */
const exportLoading = ref(false)
/** 导入加载状态 */
const importLoading = ref(false)

/* ------------------------------ 事件守卫 ------------------------------ */

/** 创建按钮点击守卫 */
function handleCreateClick() {
  if (exportLoading.value) return
  createBackup()
}

/** 下载最新按钮点击守卫 */
function handleDownloadLatestClick() {
  if (backupList.value.length === 0) return
  downloadLatest()
}

/* ------------------------------ 数据加载 ------------------------------ */

/** 加载备份列表 */
async function loadBackupList() {
  try {
    backupLoading.value = true
    const res = await configApi.listConfigs()
    backupList.value = res.configs
  } catch (e: unknown) {
    ElMessage.error(getErrorMessage(e, t('settings.backup.load_failed')))
  } finally {
    backupLoading.value = false
  }
}

/* ------------------------------ 操作：创建备份 ------------------------------ */

/** 创建新的备份（导出当前配置） */
async function createBackup() {
  try {
    exportLoading.value = true
    const res = await configApi.exportConfig()
    if (res.success) {
      ElMessage.success(t('settings.backup.export_success', { file: res.file, size: res.size_mb }))
      await loadBackupList()
    } else {
      ElMessage.error(res.error || t('settings.backup.export_failed'))
    }
  } catch (e: unknown) {
    ElMessage.error(getErrorMessage(e, t('settings.backup.export_failed')))
  } finally {
    exportLoading.value = false
  }
}

/* ------------------------------ 操作：下载备份 ------------------------------ */

/** 下载最新的备份 */
async function downloadLatest() {
  const latest = backupList.value.length > 0 ? backupList.value[0] : null
  if (!latest) {
    ElMessage.warning(t('settings.backup.no_downloadable'))
    return
  }
  await downloadBackup(latest)
}

/** 下载指定备份 */
async function downloadBackup(backup?: ConfigBackup) {
  const filename = backup?.filename
  if (!filename) {
    ElMessage.warning(t('settings.backup.no_downloadable'))
    return
  }
  try {
    const url = configApi.getDownloadUrl(filename)
    const token = extractToken(url)
    const response = await fetch(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    if (!response.ok) {
      throw new Error(`${t('settings.backup.download_failed')}: ${response.statusText}`)
    }
    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    a.click()
    URL.revokeObjectURL(downloadUrl)
  } catch (e: unknown) {
    ElMessage.error(e instanceof Error ? e.message : t('settings.backup.download_failed'))
  }
}

/* ------------------------------ 操作：导入备份 ------------------------------ */

/** 从文件导入备份 */
async function importBackup(uploadFile: UploadFile) {
  const file = uploadFile.raw
  if (!file) return
  try {
    await ElMessageBox.confirm(
      t('settings.backup.import_confirm'),
      t('settings.backup.import_confirm_title'),
      {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
      }
    )
  } catch {
    // 用户取消确认
    return
  }

  try {
    importLoading.value = true
    const res = await configApi.importConfig(file, true)
    if (res.success) {
      ElMessage.success(res.message)
      await loadBackupList()
    } else {
      ElMessage.error(res.error || t('settings.backup.import_failed'))
    }
  } catch (e: unknown) {
    ElMessage.error(getErrorMessage(e, t('settings.backup.import_failed')))
  } finally {
    importLoading.value = false
  }
}

/* ------------------------------ 操作：删除备份 ------------------------------ */

/** 删除指定备份 */
async function deleteBackup(backup: ConfigBackup) {
  try {
    await ElMessageBox.confirm(
      t('settings.backup.delete_confirm_msg', { filename: backup.filename }),
      t('settings.delete_confirm'),
      {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
      }
    )
    await configApi.deleteConfig(backup.filename)
    ElMessage.success(t('settings.backup.delete_success'))
    await loadBackupList()
  } catch {
    // 用户取消删除
  }
}

/* ------------------------------ 操作：恢复备份 ------------------------------ */

/** 从指定备份恢复系统配置 */
async function restoreBackup(backup: ConfigBackup) {
  try {
    await ElMessageBox.confirm(
      t('settings.backup.restore_confirm'),
      t('settings.backup.restore_confirm_title'),
      {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
      }
    )
    // 下载备份文件
    const url = configApi.getDownloadUrl(backup.filename)
    const token = extractToken(url)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!response.ok) {
        throw new Error(`${t('settings.backup.download_failed')}: ${response.statusText}`)
      }
      const blob = await response.blob()
      const file = new File([blob], backup.filename, { type: 'application/zip' })

      // 导入下载的备份文件
      importLoading.value = true
      const res = await configApi.importConfig(file, true)
      if (res.success) {
        ElMessage.success(res.message)
        await loadBackupList()
      } else {
        ElMessage.error(res.error || t('settings.backup.restore_failed'))
      }
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId)
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        throw new Error(t('settings.backup.download_timeout'))
      }
      throw fetchError
    }
  } catch (e: unknown) {
    if (e !== 'cancel') {
      ElMessage.error(e instanceof Error ? e.message : t('settings.backup.restore_failed'))
    }
  } finally {
    importLoading.value = false
  }
}

/* ------------------------------ 生命周期 ------------------------------ */

onMounted(loadBackupList)
</script>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.settings-section-title {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.settings-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 80px;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 1;
  color: var(--text-primary);
  background: var(--bg-color);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.action-btn.primary {
  color: #fff;
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.action-btn.accent {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.13);
}

.action-btn.download {
  color: #fff;
  background: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.action-btn.disabled,
.action-btn.loading {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.cell-file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: var(--color-primary);
}

/* loading 遮罩层透明 */
:deep(.el-table .el-loading-mask) {
  background-color: transparent !important;
}

/* 表格背景透明 */
:deep(.el-table),
:deep(.el-table__inner-wrapper),
:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper),
:deep(.el-table__empty-block),
:deep(.el-table__header),
:deep(.el-table__body),
:deep(.el-table__footer-wrapper) {
  background-color: transparent !important;
}

:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell),
:deep(.el-table tr) {
  background-color: transparent !important;
}

/* 表头底部边框 */
:deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid var(--border-base) !important;
}

/* 表体行分隔线 */
:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--border-base) !important;
}

/* 斑马纹透明 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: transparent !important;
}

/* hover 行透明 */
:deep(.el-table__body tr:hover > td.el-table__cell),
:deep(.el-table__body tr:hover > td.el-table__cell.hover-cell) {
  background-color: transparent !important;
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-section-title {
    font-size: 16px;
  }
}
</style>