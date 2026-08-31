import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/users'
import { userApi, type UserInfo, type RoleInfo } from '@/api/users'

/** 用户状态类型 */
type UserStatus = 'active' | 'inactive' | 'locked'

/** 通用错误提取类型 */
type ErrorLike = {
  response?: { data?: { detail?: unknown; message?: string } }
  message?: string
}

/** FastAPI 校验错误项 */
type ValidationError = { msg?: string }

/** 用户表单数据结构 */
interface UserForm {
  username: string
  password: string
  display_name: string
  email: string
  role_name: string
  status: UserStatus
}

/** 角色表单数据结构 */
interface RoleForm {
  name: string
  display_name: string
  description: string
}

/** 通用 API 操作结果 */
interface ApiResult {
  success: boolean
  message: string
}

/** 用户状态 → Element Plus Tag 类型映射 */
const STATUS_TAG_TYPE: Record<UserStatus, 'success' | 'info' | 'danger'> = {
  active: 'success',
  inactive: 'info',
  locked: 'danger',
}

/**
 * 用户管理组合式函数
 * 封装用户与角色的新增、编辑、删除、密码修改等交互逻辑，
 * 统一管理三个弹窗的显示状态及表单数据。
 */
export function useUserManagement() {
  const { t, te, locale } = useI18n()
  const userStore = useUserStore()

  // ==================== 内置角色本地化辅助 ====================

  /**
   * 获取内置角色的本地化 display_name（仅在原始值未被用户修改时翻译）
   */
  function getBuiltinRoleDisplayName(name: string, displayName: string): string {
    const key = `settings.role.builtin.${name}.display_name`
    if (!te(key)) return displayName
    const zhRef = t(key, {}, { locale: 'zh-CN' })
    if (displayName === zhRef) return t(key)
    return displayName
  }

  /**
   * 获取内置角色的本地化 description（仅在原始值未被用户修改时翻译）
   */
  function getBuiltinRoleDescription(name: string, description: string): string {
    const key = `settings.role.builtin.${name}.description`
    if (!te(key)) return description
    const zhRef = t(key, {}, { locale: 'zh-CN' })
    if (description === zhRef) return t(key)
    return description
  }

  /**
   * 获取内置用户的本地化 display_name（仅在原始值未被用户修改时翻译）
   * 通过角色名查找对应的内置用户显示名翻译键。
   */
  function getBuiltinUserDisplayName(roleName: string, displayName: string): string {
    const key = `settings.role.builtin.${roleName}.user_display_name`
    if (!te(key)) return displayName
    const zhRef = t(key, {}, { locale: 'zh-CN' })
    if (displayName === zhRef) return t(key)
    return displayName
  }

  // ==================== 用户弹窗状态 ====================

  /** 用户弹窗可见性 */
  const userDialogVisible = ref(false)
  /** 用户弹窗标题（根据新增/编辑模式切换） */
  const userDialogTitle = ref(t('settings.user.add_title'))
  /** 编辑中的用户 ID，null 表示当前为新增模式 */
  const editingUserId = ref<number | null>(null)
  /** 用户表单数据 */
  const userForm = ref<UserForm>({
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
  /** 角色弹窗标题（根据新增/编辑模式切换） */
  const roleDialogTitle = ref(t('settings.role.add_title'))
  /** 编辑中的角色名称，null 表示当前为新增模式 */
  const editingRoleName = ref<string | null>(null)
  /** 角色表单数据 */
  const roleForm = ref<RoleForm>({
    name: '',
    display_name: '',
    description: '',
  })

  // ==================== 密码修改弹窗状态 ====================

  /** 密码弹窗可见性 */
  const passwordDialogVisible = ref(false)
  /** 待修改密码的用户 ID */
  const passwordUserId = ref<number | null>(null)
  /** 密码表单数据 */
  const passwordForm = ref<{ new_password: string }>({ new_password: '' })

  // ==================== 计算属性 ====================

  /** 角色下拉选项：供用户表单中的角色选择器使用，显示本地化后的名称 */
  const roleOptions = computed(() =>
    userStore.roles.map(r => ({
      label: getBuiltinRoleDisplayName(r.name, r.display_name),
      value: r.name,
    }))
  )

  // ==================== 工具函数 ====================

  /**
   * 根据当前 i18n 语言获取浏览器可识别的语言代码。
   * @returns 'zh' 或 'en'
   */
  function getBrowserLocale(): 'zh' | 'en' {
    return locale.value.startsWith('zh') ? 'zh' : 'en'
  }

  /**
   * 将秒级时间戳格式化为本地时间字符串。
   * @param timestamp - Unix 时间戳（秒）
   * @returns 格式化后的时间，无效值时返回国际化占位符
   */
  function formatTime(timestamp: number | null): string {
    if (!timestamp) return t('common.dash')
    return new Date(timestamp * 1000).toLocaleString(getBrowserLocale())
  }

  /**
   * 根据用户状态获取 Element Plus Tag 类型。
   * @param status - 用户状态
   */
  function getStatusType(status: UserStatus) {
    return STATUS_TAG_TYPE[status]
  }

  /**
   * 获取用户状态对应的国际化标签文本。
   * @param status - 用户状态
   */
  function getStatusLabel(status: UserStatus) {
    return t(`settings.status.${status}`)
  }

  /**
   * 从用户表单中提取需要提交的字段（仅包含非空值）。
   * @param form - 用户表单
   * @returns 用于更新接口的 payload
   */
  function buildUserUpdatePayload(form: UserForm) {
    const payload: Record<string, string> = {}
    if (form.display_name) payload.display_name = form.display_name
    if (form.email) payload.email = form.email
    if (form.role_name) payload.role_name = form.role_name
    if (form.status) payload.status = form.status
    return payload
  }

  /**
   * 从异常对象中提取可读的错误消息。
   * 兼容 FastAPI 的 detail（字符串或数组）、通用 message、以及网络异常。
   * @param e - catch 到的异常对象
   * @param fallbackKey - 兜底国际化 key
   * @returns 可直接展示的错误文本
   */
  function getErrorMessage(e: unknown, fallbackKey: string): string {
    if (e === 'cancel') return ''
    const data = (e as ErrorLike)?.response?.data
    // FastAPI 校验错误：detail 为数组，每项含 msg 字段
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item: ValidationError) => item.msg || JSON.stringify(item)).join('; ')
    }
    // FastAPI 普通错误：detail 为字符串
    if (typeof data?.detail === 'string' && data.detail) {
      return data.detail
    }
    // 通用后端 message 字段
    if (typeof data?.message === 'string' && data.message) {
      return data.message
    }
    // Axios 自带 message（如 Network Error、Timeout）
    if (e instanceof Error) {
      return e.message
    }
    return t(fallbackKey)
  }

  /**
   * 统一处理 API 操作结果：根据 success 字段显示成功或错误提示。
   * @param result - 接口返回的 { success, message } 对象
   * @param successMessage - 操作成功时显示的提示文案
   * @returns 操作是否成功
   */
  function handleResult(result: ApiResult, successMessage: string): boolean {
    if (result.success) {
      ElMessage.success(successMessage)
      return true
    }
    ElMessage.error(result.message || t('settings.operation_failed'))
    return false
  }

  // ==================== 用户操作 ====================

  /**
   * 重置用户表单为默认值，并设定指定的默认角色。
   * @param defaultRole - 默认角色名
   */
  function resetUserForm(defaultRole = 'viewer') {
    userForm.value = {
      username: '',
      password: '',
      display_name: '',
      email: '',
      role_name: defaultRole,
      status: 'active',
    }
  }

  /**
   * 打开新增用户弹窗，重置表单并将默认角色设为 viewer。
   */
  function openCreateUserDialog() {
    userDialogTitle.value = t('settings.user.add_title')
    editingUserId.value = null
    resetUserForm('viewer')
    userDialogVisible.value = true
  }

  /**
   * 打开编辑用户弹窗，将已有用户数据回填至表单。
   * @param user - 待编辑的用户
   */
  function openEditUserDialog(user: UserInfo) {
    userDialogTitle.value = t('settings.user.edit_title')
    editingUserId.value = user.id
    userForm.value = {
      username: user.username,
      password: '',
      display_name: getBuiltinUserDisplayName(user.role_name, user.display_name || ''),
      email: user.email || '',
      role_name: user.role_name,
      status: (user.status as UserStatus) || 'active',
    }
    userDialogVisible.value = true
  }

  /**
   * 提交用户表单：
   * - 编辑模式：调用 updateUser，仅提交非空字段
   * - 新增模式：校验用户名与密码后调用 createUser
   */
  async function handleUserSubmit() {
    try {
      if (editingUserId.value) {
        const updateData = buildUserUpdatePayload(userForm.value)
        const result = await userStore.updateUser(editingUserId.value, updateData)
        if (!handleResult(result, t('settings.user.update_success'))) return
      } else {
        if (!userForm.value.username || !userForm.value.password) {
          ElMessage.warning(t('settings.user.fill_username_password'))
          return
        }
        const result = await userStore.createUser({
          username: userForm.value.username,
          password: userForm.value.password,
          role_name: userForm.value.role_name,
          display_name: userForm.value.display_name || undefined,
          email: userForm.value.email || undefined,
        })
        if (!handleResult(result, t('settings.user.create_success'))) return
      }
      userDialogVisible.value = false
    } catch (e: unknown) {
      ElMessage.error(getErrorMessage(e, 'settings.operation_failed'))
    }
  }

  /**
   * 删除指定用户，带二次确认。
   * @param user - 待删除的用户
   */
  async function handleDeleteUser(user: UserInfo) {
    try {
      await ElMessageBox.confirm(
        t('settings.user.delete_confirm_msg', { name: user.display_name || user.username }),
        t('settings.delete_confirm'),
        {
          type: 'warning',
          customClass: 'x-message-box',
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
        }
      )
      const result = await userStore.deleteUser(user.id)
      handleResult(result, t('settings.user.delete_success'))
    } catch {
      // 用户取消操作
    }
  }

  /**
   * 打开修改密码弹窗并清空上次输入。
   * @param user - 目标用户
   */
  function openChangePasswordDialog(user: UserInfo) {
    passwordUserId.value = user.id
    passwordForm.value.new_password = ''
    passwordDialogVisible.value = true
  }

  /**
   * 提交密码修改请求，校验新密码非空后调用后端接口。
   */
  async function handleChangePassword() {
    if (!passwordForm.value.new_password) {
      ElMessage.warning(t('settings.password.enter_new'))
      return
    }
    try {
      const response = await userApi.changePassword(passwordUserId.value!, passwordForm.value.new_password)
      const result = response.data as ApiResult
      if (!handleResult(result, t('settings.password.change_success'))) return
      passwordDialogVisible.value = false
    } catch (e: unknown) {
      ElMessage.error(getErrorMessage(e, 'settings.password.change_failed'))
    }
  }

  // ==================== 角色操作 ====================

  /**
   * 打开新增角色弹窗，重置角色表单。
   */
  function openCreateRoleDialog() {
    roleDialogTitle.value = t('settings.role.add_title')
    editingRoleName.value = null
    roleForm.value = { name: '', display_name: '', description: '' }
    roleDialogVisible.value = true
  }

  /**
   * 打开编辑角色弹窗，将已有角色数据回填至表单（内置角色的 display_name/description 做本地化翻译）。
   * @param role - 待编辑的角色
   */
  function openEditRoleDialog(role: RoleInfo) {
    roleDialogTitle.value = t('settings.role.edit_title')
    editingRoleName.value = role.name
    roleForm.value = {
      name: role.name,
      display_name: getBuiltinRoleDisplayName(role.name, role.display_name),
      description: getBuiltinRoleDescription(role.name, role.description || ''),
    }
    roleDialogVisible.value = true
  }

  /**
   * 提交角色表单：
   * - 编辑模式：调用 updateRole
   * - 新增模式：校验 name/display_name 后调用 createRole
   */
  async function handleRoleSubmit() {
    try {
      if (editingRoleName.value) {
        const result = await userStore.updateRole(editingRoleName.value, {
          display_name: roleForm.value.display_name,
          description: roleForm.value.description || undefined,
        })
        if (!handleResult(result, t('settings.role.update_success'))) return
      } else {
        if (!roleForm.value.name || !roleForm.value.display_name) {
          ElMessage.warning(t('settings.role.fill_name_display'))
          return
        }
        const result = await userStore.createRole({
          name: roleForm.value.name,
          display_name: roleForm.value.display_name,
          description: roleForm.value.description || undefined,
        })
        if (!handleResult(result, t('settings.role.create_success'))) return
      }
      roleDialogVisible.value = false
    } catch (e: unknown) {
      ElMessage.error(getErrorMessage(e, 'settings.operation_failed'))
    }
  }

  /**
   * 删除指定角色，系统角色禁止删除，带二次确认。
   * @param role - 待删除的角色
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
          customClass: 'x-message-box',
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
        }
      )
      const result = await userStore.deleteRole(role.name)
      handleResult(result, t('settings.role.delete_success'))
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
