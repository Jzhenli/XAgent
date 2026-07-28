import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { configApi, type ConfigBackup } from '@/api/config'

export function useBackup() {
  const { t } = useI18n()

  const backupList = ref<ConfigBackup[]>([])
  const backupLoading = ref(false)
  const exportLoading = ref(false)
  const importLoading = ref(false)

  async function loadBackupList() {
    try {
      backupLoading.value = true
      const res = await configApi.listConfigs()
      backupList.value = res.configs
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.backup.load_failed'))
    } finally {
      backupLoading.value = false
    }
  }

  async function handleCreateBackup() {
    try {
      exportLoading.value = true
      const res = await configApi.exportConfig()
      if (res.success) {
        ElMessage.success(t('settings.backup.export_success', { file: res.file, size: res.size_mb }))
        await loadBackupList()
      } else {
        ElMessage.error(res.error || t('settings.backup.export_failed'))
      }
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.backup.export_failed'))
    } finally {
      exportLoading.value = false
    }
  }

  async function handleDownloadConfig(backup?: ConfigBackup) {
    try {
      const filename = backup?.filename || (backupList.value.length > 0 ? backupList.value[0].filename : null)
      if (!filename) {
        ElMessage.warning(t('settings.backup.no_downloadable'))
        return
      }
      const url = configApi.getDownloadUrl(filename)
      const token = url.split('token=')[1]
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    } catch (e: any) {
      ElMessage.error(e.message || t('settings.backup.download_failed'))
    }
  }

  async function handleImportConfig(uploadFile: UploadFile) {
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
      importLoading.value = true
      const res = await configApi.importConfig(file, true)
      if (res.success) {
        ElMessage.success(res.message)
        await loadBackupList()
      } else {
        ElMessage.error(res.error || t('settings.backup.import_failed'))
      }
    } catch {
      // 用户取消
    } finally {
      importLoading.value = false
    }
  }

  async function handleDeleteBackup(backup: ConfigBackup) {
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
      // 用户取消
    }
  }

  async function handleRestoreBackup(backup: ConfigBackup) {
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
      const url = configApi.getDownloadUrl(backup.filename)
      const token = url.split('token=')[1]
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (!response.ok) {
          throw new Error(`${t('settings.backup.download_failed')}: ${response.statusText}`)
        }
        const blob = await response.blob()
        const file = new File([blob], backup.filename, { type: 'application/zip' })
        importLoading.value = true
        const res = await configApi.importConfig(file, true)
        if (res.success) {
          ElMessage.success(res.message)
          await loadBackupList()
        } else {
          ElMessage.error(res.error || t('settings.backup.restore_failed'))
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error(t('settings.backup.download_timeout'))
        }
        throw fetchError
      }
    } catch (e: any) {
      if (e !== 'cancel') {
        ElMessage.error(e.response?.data?.detail || e.message || t('settings.backup.restore_failed'))
      }
    } finally {
      importLoading.value = false
    }
  }

  return {
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
  }
}