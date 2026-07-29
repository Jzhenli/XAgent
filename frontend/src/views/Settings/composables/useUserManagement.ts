import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/users'
import type { UserInfo, RoleInfo } from '@/api/users'

/**
 * 用户管理组合式函数
 * 管理用户列表、角色列表的 CRUD 操作及相关弹窗状态
 */
export function useUserManagement() {
  const { t, locale } = useI18n()
  const userStore = useUserStore()

  // ==================== 用户弹窗状态 ====================

  /** 用户弹窗可见性 */
  const userDialogVisible = ref(false)
  /** 用户弹窗标题 */
  const userDialogTitle = ref(t('settings.user.add_title'))
  /** 编辑中的用户 ID（null 表示新增模式） */
  const editingUserId = ref<number | null>(null)
  /** 用户表单数据 */
  const userForm = ref({
    username: '',
    password: '',
    display_name: '',
    email: '',
    role_name: '',
    status: 'active',
  })

  // ==================== 角色弹窗状态 ====================

  /** 角色弹窗可见性 */
  const roleDialogVisible = ref(false)
  /** 角色弹窗标题 */
  const roleDialogTitle = ref(t('settings.role.add_title'))
  /** 编辑中的角色名称（null 表示新增模式） */
  const editingRoleName = ref<string | null>(null)
  /** 角色表单数据 */
  const roleForm = ref({
    name: '',
    display_name: '',
    description: '',
  })

  // ==================== 密码修改弹窗状态 ====================

  /** 密码弹窗可见性 */
  const passwordDialogVisible = ref(false)
  /** 需要修改密码的用户 ID */
  const passwordUserId = ref<number | null>(null)
  /** 密码表单数据 */
  const passwordForm = ref({ new_password: '' })

  // ==================== 计算属性 ====================

  /** 角色下拉选项列表 */
  const roleOptions = computed(() =>
    userStore.roles.map(r => ({ label: r.display_name, value: r.name }))
  )

  // ==================== 工具函数 ====================

  /**
   * 格式化时间戳为本地时间字符串（自动适配当前语言）
   * @param timestamp - Unix 时间戳（秒）
   * @returns 格式化后的时间字符串，无效时间返回国际化占位符
   */
  function formatTime(timestamp: number | null): string {
    if (!timestamp) return t('common.dash')
    const date = new Date(timestamp * 1000)
    // 浏览器语言代码映射：zh-CN/zh-TW → zh，en → en
    const lang = locale.value.startsWith('zh') ? 'zh' : 'en'
    return date.toLocaleString(lang)
  }

  /**
   * 根据用户状态获取对应的 Tag 类型
   * @param status - 用户状态 ('active' | 'inactive' | 'locked')
   * @returns Element Plus Tag 类型
   */
  function getStatusType(status: string) {
    return status === 'active' ? 'success' : status === 'inactive' ? 'info' : 'danger'
  }

  /**
   * 根据用户状态获取对应的国际化标签
   * @param status - 用户状态 ('active' | 'inactive' | 'locked')
   * @returns 翻译后的状态文本
   */
  function getStatusLabel(status: string) {
    return status === 'active'
      ? t('settings.status.active')
      : status === 'inactive'
        ? t('settings.status.inactive')
        : t('settings.status.locked')
  }

  // ==================== 用户操作 ====================

  /**
   * 打开新增用户弹窗
   * 重置表单为默认值，设置默认角色为 viewer
   */
  function openCreateUserDialog() {
    userDialogTitle.value = t('settings.user.add_title')
    editingUserId.value = null
    userForm.value = {
      username: '',
      password: '',
      display_name: '',
      email: '',
      role_name: 'viewer',
      status: 'active',
    }
    userDialogVisible.value = true
  }

  /**
   * 打开编辑用户弹窗
   * @param user - 待编辑的用户信息
   */
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

  /**
   * 提交用户表单（新增或编辑）
   * - 新增：校验用户名和密码，调用 store.createUser
   * - 编辑：仅提交变更字段，调用 store.updateUser
   */
  async function handleUserSubmit() {
    try {
      if (editingUserId.value) {
        // 编辑模式：只提交非空字段
        const updateData: Record<string, string> = {}
        if (userForm.value.display_name) updateData.display_name = userForm.value.display_name
        if (userForm.value.email) updateData.email = userForm.value.email
        if (userForm.value.role_name) updateData.role_name = userForm.value.role_name
        if (userForm.value.status) updateData.status = userForm.value.status
        await userStore.updateUser(editingUserId.value, updateData)
        ElMessage.success(t('settings.user.update_success'))
      } else {
        // 新增模式：校验必填项
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

  /**
   * 删除指定用户
   * 弹窗确认后调用 store.deleteUser
   * @param user - 待删除的用户信息
   */
  async function handleDeleteUser(user: UserInfo) {
    try {
      await ElMessageBox.confirm(
        t('settings.user.delete_confirm_msg', { name: user.display_name || user.username }),
        t('settings.delete_confirm'),
        {
          type: 'warning',
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
        }
      )
      await userStore.deleteUser(user.id)
      ElMessage.success(t('settings.user.delete_success'))
    } catch {
      // 用户取消操作
    }
  }

  /**
   * 打开修改密码弹窗
   * @param user - 目标用户
   */
  function openChangePasswordDialog(user: UserInfo) {
    passwordUserId.value = user.id
    passwordForm.value.new_password = ''
    passwordDialogVisible.value = true
  }

  /**
   * 提交密码修改请求
   * 校验新密码非空后调用 API 更新
   */
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

  // ==================== 角色操作 ====================

  /**
   * 打开新增角色弹窗
   * 重置表单为默认值
   */
  function openCreateRoleDialog() {
    roleDialogTitle.value = t('settings.role.add_title')
    editingRoleName.value = null
    roleForm.value = { name: '', display_name: '', description: '' }
    roleDialogVisible.value = true
  }

  /**
   * 打开编辑角色弹窗
   * @param role - 待编辑的角色信息
   */
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

  /**
   * 提交角色表单（新增或编辑）
   * - 新增：校验名称和显示名称，调用 store.createRole
   * - 编辑：提交变更字段，调用 store.updateRole
   */
  async function handleRoleSubmit() {
    try {
      if (editingRoleName.value) {
        // 编辑模式
        await userStore.updateRole(editingRoleName.value, {
          display_name: roleForm.value.display_name,
          description: roleForm.value.description || undefined,
        })
        ElMessage.success(t('settings.role.update_success'))
      } else {
        // 新增模式：校验必填项
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

  /**
   * 删除指定角色
   * 系统角色禁止删除，弹窗确认后调用 store.deleteRole
   * @param role - 待删除的角色信息
   */
  async function handleDeleteRole(role: RoleInfo) {
    if (role.is_system) {
      ElMessage.warning(t('settings.role.system_cannot_delete'))
      return
    }
    try {
      await ElMessageBox.confirm(
        t('settings.role.delete_confirm_msg', { name: role.display_name }),
        t('settings.delete_confirm'),
        {
          type: 'warning',
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
        }
      )
      await userStore.deleteRole(role.name)
      ElMessage.success(t('settings.role.delete_success'))
    } catch {
      // 用户取消操作
    }
  }

  // ==================== 返回值 ====================

  return {
    // 用户弹窗
    userDialogVisible,
    userDialogTitle,
    editingUserId,
    userForm,
    // 角色弹窗
    roleDialogVisible,
    roleDialogTitle,
    editingRoleName,
    roleForm,
    // 密码弹窗
    passwordDialogVisible,
    passwordForm,
    // 选项与工具
    roleOptions,
    formatTime,
    getStatusType,
    getStatusLabel,
    // 用户操作
    openCreateUserDialog,
    openEditUserDialog,
    handleUserSubmit,
    handleDeleteUser,
    openChangePasswordDialog,
    handleChangePassword,
    // 角色操作
    openCreateRoleDialog,
    openEditRoleDialog,
    handleRoleSubmit,
    handleDeleteRole,
  }
}