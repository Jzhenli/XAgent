import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/users'

type ErrorLike = { response?: { data?: { detail?: string } } }

export function usePermissionMatrix() {
  const { t } = useI18n()
  const userStore = useUserStore()

  const activePermissionRole = ref(
    userStore.permissionMatrix?.roles?.length
      ? userStore.permissionMatrix.roles[0].name
      : ''
  )
  const permissionEditData = ref<Record<string, Record<string, boolean>>>({})
  const isEditingPermissions = ref(false)

  const RESOURCE_LABELS: Record<string, string> = {
    dashboard: t('settings.resources.dashboard'),
    devices: t('settings.resources.devices'),
    rules: t('settings.resources.rules'),
    alerts: t('settings.resources.alerts'),
    scada: t('settings.resources.scada'),
    settings: t('settings.resources.settings'),
    users: t('settings.resources.users'),
    logs: t('settings.resources.logs'),
    backup: t('settings.resources.backup'),
    control: t('settings.resources.control'),
  }

  const ACTION_LABELS: Record<string, string> = {
    view: t('settings.actions.view'),
    create: t('settings.actions.create'),
    update: t('settings.actions.update'),
    delete: t('settings.actions.delete'),
  }

  const currentRolePermissions = computed(() => {
    if (!activePermissionRole.value || !userStore.permissionMatrix) return null
    return userStore.permissionMatrix.roles.find(r => r.name === activePermissionRole.value)
  })

  function startEditPermissions() {
    if (!currentRolePermissions.value) return
    permissionEditData.value = JSON.parse(JSON.stringify(currentRolePermissions.value.permissions))
    isEditingPermissions.value = true
  }

  function cancelEditPermissions() {
    isEditingPermissions.value = false
    permissionEditData.value = {}
  }

  async function savePermissions() {
    try {
      await userStore.updatePermissionMatrix(activePermissionRole.value, permissionEditData.value)
      ElMessage.success(t('settings.permission.update_success'))
      isEditingPermissions.value = false
    } catch (e: unknown) {
      const err = e as ErrorLike
      ElMessage.error(err?.response?.data?.detail || t('settings.permission.update_failed'))
    }
  }

  function togglePermission(resource: string, action: string) {
    if (!permissionEditData.value[resource]) {
      permissionEditData.value[resource] = {}
    }
    permissionEditData.value[resource][action] = !permissionEditData.value[resource][action]
  }

  function selectAllForResource(resource: string) {
    if (!permissionEditData.value[resource]) {
      permissionEditData.value[resource] = {}
    }
    for (const action of (userStore.permissionMatrix?.actions || [])) {
      permissionEditData.value[resource][action] = true
    }
  }

  function clearAllForResource(resource: string) {
    if (!permissionEditData.value[resource]) {
      permissionEditData.value[resource] = {}
    }
    for (const action of (userStore.permissionMatrix?.actions || [])) {
      permissionEditData.value[resource][action] = false
    }
  }

  watch(() => userStore.permissionMatrix, (matrix) => {
    if (matrix?.roles?.length && !activePermissionRole.value) {
      activePermissionRole.value = matrix.roles[0].name
    }
  })

  return {
    activePermissionRole,
    permissionEditData,
    isEditingPermissions,
    RESOURCE_LABELS,
    ACTION_LABELS,
    currentRolePermissions,
    startEditPermissions,
    cancelEditPermissions,
    savePermissions,
    togglePermission,
    selectAllForResource,
    clearAllForResource,
  }
}