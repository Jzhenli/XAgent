<template>
  <div class="settings-section">
    <!-- 用户/角色 标签页切换 -->
    <div class="tabs-wrapper">
      <el-tabs v-model="activeTab" class="user-management-tabs">
        <!-- 用户列表 -->
        <el-tab-pane :label="$t('settings.user.list_title')" name="users">
          <el-table :data="userStore.users" stripe :border="false" v-loading="userStore.loading">
            <el-table-column
              prop="username"
              :label="$t('settings.user.username')"
              min-width="90"
            />
            <el-table-column
              prop="display_name"
              :label="$t('settings.user.display_name')"
              min-width="90"
            />
            <el-table-column :label="$t('settings.user.role')" min-width="90">
              <template #default="{ row }">
                <el-tag size="small">{{ row.role_display_name || row.role_name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('settings.user.status')"
              align="center"
            >
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('settings.user.last_login')"
              min-width="140"
            >
              <template #default="{ row }">
                {{ formatTime(row.last_login) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('settings.actions_label')"
              width="180"
              fixed="right"
              align="center"
            >
              <template #default="{ row }">
                <el-button
                  v-if="userStore.hasPermission('users', 'update')"
                  type="primary"
                  link
                  size="small"
                  @click="openEditUserDialog(row)"
                >
                  {{ $t('common.edit') }}
                </el-button>
                <el-button
                  v-if="userStore.hasPermission('users', 'update')"
                  type="warning"
                  link
                  size="small"
                  @click="openChangePasswordDialog(row)"
                >
                  {{ $t('settings.user.change_password') }}
                </el-button>
                <el-button
                  v-if="userStore.hasPermission('users', 'delete')"
                  type="danger"
                  link
                  size="small"
                  @click="handleDeleteUser(row)"
                  :disabled="row.username === 'admin'"
                >
                  {{ $t('common.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>

      <!-- 角色列表 -->
      <el-tab-pane :label="$t('settings.role.list_title')" name="roles">
          <el-table :data="userStore.roles" stripe :border="false">
            <el-table-column
              prop="name"
              :label="$t('settings.role.name')"
              min-width="90"
            />
            <el-table-column
              prop="display_name"
              :label="$t('settings.user.display_name')"
              min-width="90"
            />
            <el-table-column
              prop="description"
              :label="$t('settings.role.description')"
              min-width="140"
            />
            <el-table-column
              :label="$t('settings.role.type')"
              align="center"
            >
              <template #default="{ row }">
                <el-tag :type="row.is_system ? 'info' : 'success'" size="small">
                  {{ row.is_system ? $t('settings.role.system') : $t('settings.role.custom') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('settings.actions_label')"
              width="120"
              fixed="right"
              align="center"
            >
              <template #default="{ row }">
                <el-button
                  v-if="userStore.hasPermission('users', 'update')"
                  type="primary"
                  link
                  size="small"
                  @click="openEditRoleDialog(row)"
                >
                  {{ $t('common.edit') }}
                </el-button>
                <el-button
                  v-if="userStore.hasPermission('users', 'delete')"
                  type="danger"
                  link
                  size="small"
                  @click="handleDeleteRole(row)"
                  :disabled="row.is_system"
                >
                  {{ $t('common.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
      </el-tabs>

      <!-- 标签页右侧操作按钮 -->
      <div class="tabs-header-actions">
        <div
          v-if="activeTab === 'users' && userStore.hasPermission('users', 'create')"
          class="action-btn add"
          @click="openCreateUserDialog"
        >
          <el-icon :size="14"><Plus /></el-icon>
          <span>{{ $t('settings.user.add') }}</span>
        </div>
        <div
          v-if="activeTab === 'roles' && userStore.hasPermission('users', 'create')"
          class="action-btn add"
          @click="openCreateRoleDialog"
        >
          <el-icon :size="14"><Plus /></el-icon>
          <span>{{ $t('settings.role.add') }}</span>
        </div>
      </div>
    </div>

    <!-- 用户新增/编辑弹窗 -->
    <UserDialog
      v-model:visible="userDialogVisible"
      :title="userDialogTitle"
      :editing-user-id="editingUserId"
      :form="userForm"
      :role-options="roleOptions"
      @submit="handleUserSubmit"
    />

    <!-- 角色新增/编辑弹窗 -->
    <RoleDialog
      v-model:visible="roleDialogVisible"
      :title="roleDialogTitle"
      :editing-role-name="editingRoleName"
      :form="roleForm"
      @submit="handleRoleSubmit"
    />

    <!-- 修改密码弹窗 -->
    <PasswordDialog
      v-model:visible="passwordDialogVisible"
      :form="passwordForm"
      @submit="handleChangePassword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users'
import { useUserManagement } from '../composables/useUserManagement'
import UserDialog from './UserDialog.vue'
import RoleDialog from './RoleDialog.vue'
import PasswordDialog from './PasswordDialog.vue'

const userStore = useUserStore()

/** 当前激活的标签页：'users' | 'roles' */
const activeTab = ref<'users' | 'roles'>('users')

const {
  // 用户弹窗状态
  userDialogVisible,
  userDialogTitle,
  editingUserId,
  userForm,
  // 角色弹窗状态
  roleDialogVisible,
  roleDialogTitle,
  editingRoleName,
  roleForm,
  // 密码弹窗状态
  passwordDialogVisible,
  passwordForm,
  // 下拉选项
  roleOptions,
  // 工具函数
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
} = useUserManagement()
</script>

<style scoped>
/* ==================== 标签页容器 ==================== */
.tabs-wrapper {
  position: relative;
  margin-top: 8px;
}

.user-management-tabs {
  margin-top: 0;
}

/* 标签页头部：为右侧操作按钮预留空间 */
.user-management-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
  padding-right: 120px;
}

/* ==================== 标签页右侧操作按钮 ==================== */
.tabs-header-actions {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
}

/* 通用操作按钮样式 */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 80px;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

/* 新增按钮：主色 */
.action-btn.add {
  color: #fff;
  background: rgba(102, 102, 255, 1);
}

/* ==================== 标签页项样式 ==================== */
.user-management-tabs :deep(.el-tabs__item) {
  font-size: 16px !important;
  font-weight: bold;
  line-height: 24px;
  color: var(--text-secondary);
  padding: 12px 16px !important;
  height: 48px !important;
}

.user-management-tabs :deep(.el-tabs__item.is-active) {
  color: var(--color-primary);
}

.user-management-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--color-primary);
}

/* ==================== 响应式：1025px - 1366px ==================== */
@media (min-width: 1025px) and (max-width: 1366px) {
  .user-management-tabs :deep(.el-tabs__header) {
    margin-bottom: 12px;
    padding-right: 100px;
  }
}
</style>

<!-- 表格样式（非 scoped 以确保穿透 Element Plus 内部结构） -->
<style>
/* ==================== 表格容器透明背景 ==================== */
.user-management-tabs .el-table,
.user-management-tabs .el-table__inner-wrapper,
.user-management-tabs .el-table__header-wrapper,
.user-management-tabs .el-table__body-wrapper,
.user-management-tabs .el-table__empty-block,
.user-management-tabs .el-table__header,
.user-management-tabs .el-table__body,
.user-management-tabs .el-table__footer-wrapper {
  background-color: transparent !important;
  border: none !important;
}

/* 表头透明背景 */
.user-management-tabs .el-table thead,
.user-management-tabs .el-table thead tr,
.user-management-tabs .el-table thead th.el-table__cell {
  background-color: transparent !important;
}

/* ==================== 单元格透明背景 + 固定行高 ==================== */
/* th/td 单元格本身透明 */
.user-management-tabs .el-table th.el-table__cell,
.user-management-tabs .el-table td.el-table__cell,
.user-management-tabs .el-table tr {
  background-color: transparent !important;
  border: none !important;
}

/* 单元格底部边框作为行分隔线 */
.user-management-tabs .el-table th.el-table__cell,
.user-management-tabs .el-table td.el-table__cell {
  border-bottom: 1px solid var(--border-light) !important;
}

/* 单元格内部 .cell 元素：固定行高（关键！真正控制行高的是这个元素） */
.user-management-tabs .el-table .el-table__cell .cell {
  padding: 4px 0 !important;
  line-height: 20px !important;
  white-space: nowrap !important;
}

/* loading 遮罩层透明 */
.user-management-tabs .el-table .el-loading-mask {
  background-color: transparent !important;
}

/* 斑马纹透明 */
.user-management-tabs .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: transparent !important;
}

/* hover 行透明 */
.user-management-tabs .el-table__body tr:hover > td.el-table__cell {
  background-color: transparent !important;
}

/* 固定列透明（左右两侧） */
.user-management-tabs .el-table .el-fixed-column--right,
.user-management-tabs .el-table .el-fixed-column--left,
.user-management-tabs .el-table .el-fixed-column--right .el-table,
.user-management-tabs .el-table .el-fixed-column--left .el-table {
  background-color: transparent !important;
}

/* 固定列遮罩透明 */
.user-management-tabs .el-table .el-fixed-column__shadow {
  background-color: transparent !important;
}

/* ==================== 深色主题下标签页文字颜色 ==================== */
[data-theme='dark'] .user-management-tabs .el-tabs__item {
  color: rgba(255, 255, 255, 0.60);
}

[data-theme='dark'] .user-management-tabs .el-tabs__item.is-active {
  color: rgba(255, 255, 255, 1);
}

[data-theme='dark'] .user-management-tabs .el-tabs__active-bar {
  background-color: rgba(255, 255, 255, 1);
}
</style>