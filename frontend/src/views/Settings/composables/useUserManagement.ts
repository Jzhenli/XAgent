import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/users'
import type { UserInfo, RoleInfo } from '@/api/users'

export function useUserManagement() {
  const { t } = useI18n()
  const userStore = useUserStore()

  const userDialogVisible = ref(false)
  const userDialogTitle = ref(t('settings.user.add_title'))
  const editingUserId = ref<number | null>(null)
  const userForm = ref({
    username: '',
    password: '',
    display_name: '',
    email: '',
    role_name: '',
    status: 'active',
  })

  const roleDialogVisible = ref(false)
  const roleDialogTitle = ref(t('settings.role.add_title'))
  const editingRoleName = ref<string | null>(null)
  const roleForm = ref({
    name: '',
    display_name: '',
    description: '',
  })

  const passwordDialogVisible = ref(false)
  const passwordUserId = ref<number | null>(null)
  const passwordForm = ref({ new_password: '' })

  const roleOptions = computed(() =>
    userStore.roles.map(r => ({ label: r.display_name, value: r.name }))
  )

  function formatTime(timestamp: number | null): string {
    if (!timestamp) return '-'
    return new Date(timestamp * 1000).toLocaleString('zh-CN')
  }

  function getStatusType(status: string) {
    return status === 'active' ? 'success' : status === 'inactive' ? 'info' : 'danger'
  }

  function getStatusLabel(status: string) {
    return status === 'active' ? t('settings.status.active') : status === 'inactive' ? t('settings.status.inactive') : t('settings.status.locked')
  }

  function openCreateUserDialog() {
    userDialogTitle.value = t('settings.user.add_title')
    editingUserId.value = null
    userForm.value = { username: '', password: '', display_name: '', email: '', role_name: 'viewer', status: 'active' }
    userDialogVisible.value = true
  }

  function openEditUserDialog(user: UserInfo) {
    userDialogTitle.value = t('settings.user.edit_title')
    editingUserId.value = user.id
    userForm.value = {
      username: user.username,
      password: '',
      display_name: user.display_name || '',
      email: user.email || '',
      role_name: user.role_name,
      status: user.status,
    }
    userDialogVisible.value = true
  }

  async function handleUserSubmit() {
    try {
      if (editingUserId.value) {
        const updateData: Record<string, string> = {}
        if (userForm.value.display_name) updateData.display_name = userForm.value.display_name
        if (userForm.value.email) updateData.email = userForm.value.email
        if (userForm.value.role_name) updateData.role_name = userForm.value.role_name
        if (userForm.value.status) updateData.status = userForm.value.status
        await userStore.updateUser(editingUserId.value, updateData)
        ElMessage.success(t('settings.user.update_success'))
      } else {
        if (!userForm.value.username || !userForm.value.password) {
          ElMessage.warning(t('settings.user.fill_username_password'))
          return
        }
        await userStore.createUser({
          username: userForm.value.username,
          password: userForm.value.password,
          role_name: userForm.value.role_name,
          display_name: userForm.value.display_name || undefined,
          email: userForm.value.email || undefined,
        })
        ElMessage.success(t('settings.user.create_success'))
      }
      userDialogVisible.value = false
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.operation_failed'))
    }
  }

  async function handleDeleteUser(user: UserInfo) {
    try {
      await ElMessageBox.confirm(t('settings.user.delete_confirm_msg', { name: user.display_name || user.username }), t('settings.delete_confirm'), {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
      })
      await userStore.deleteUser(user.id)
      ElMessage.success(t('settings.user.delete_success'))
    } catch {
      // cancelled
    }
  }

  function openChangePasswordDialog(user: UserInfo) {
    passwordUserId.value = user.id
    passwordForm.value.new_password = ''
    passwordDialogVisible.value = true
  }

  async function handleChangePassword() {
    if (!passwordForm.value.new_password) {
      ElMessage.warning(t('settings.password.enter_new'))
      return
    }
    try {
      const { userApi } = await import('@/api/users')
      await userApi.changePassword(passwordUserId.value!, passwordForm.value.new_password)
      ElMessage.success(t('settings.password.change_success'))
      passwordDialogVisible.value = false
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.password.change_failed'))
    }
  }

  function openCreateRoleDialog() {
    roleDialogTitle.value = t('settings.role.add_title')
    editingRoleName.value = null
    roleForm.value = { name: '', display_name: '', description: '' }
    roleDialogVisible.value = true
  }

  function openEditRoleDialog(role: RoleInfo) {
    roleDialogTitle.value = t('settings.role.edit_title')
    editingRoleName.value = role.name
    roleForm.value = {
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
    }
    roleDialogVisible.value = true
  }

  async function handleRoleSubmit() {
    try {
      if (editingRoleName.value) {
        await userStore.updateRole(editingRoleName.value, {
          display_name: roleForm.value.display_name,
          description: roleForm.value.description || undefined,
        })
        ElMessage.success(t('settings.role.update_success'))
      } else {
        if (!roleForm.value.name || !roleForm.value.display_name) {
          ElMessage.warning(t('settings.role.fill_name_display'))
          return
        }
        await userStore.createRole({
          name: roleForm.value.name,
          display_name: roleForm.value.display_name,
          description: roleForm.value.description || undefined,
        })
        ElMessage.success(t('settings.role.create_success'))
      }
      roleDialogVisible.value = false
    } catch (e: any) {
      ElMessage.error(e.response?.data?.detail || t('settings.operation_failed'))
    }
  }

  async function handleDeleteRole(role: RoleInfo) {
    if (role.is_system) {
      ElMessage.warning(t('settings.role.system_cannot_delete'))
      return
    }
    try {
      await ElMessageBox.confirm(t('settings.role.delete_confirm_msg', { name: role.display_name }), t('settings.delete_confirm'), {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
      })
      await userStore.deleteRole(role.name)
      ElMessage.success(t('settings.role.delete_success'))
    } catch {
      // cancelled
    }
  }

  return {
    userDialogVisible,
    userDialogTitle,
    editingUserId,
    userForm,
    roleDialogVisible,
    roleDialogTitle,
    editingRoleName,
    roleForm,
    passwordDialogVisible,
    passwordForm,
    roleOptions,
    formatTime,
    getStatusType,
    getStatusLabel,
    openCreateUserDialog,
    openEditUserDialog,
    handleUserSubmit,
    handleDeleteUser,
    openChangePasswordDialog,
    handleChangePassword,
    openCreateRoleDialog,
    openEditRoleDialog,
    handleRoleSubmit,
    handleDeleteRole,
  }
}