<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.users') }}</h3>
    <div class="user-section">
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ $t('settings.user.list_title') }}</span>
            <el-button v-if="userStore.hasPermission('users', 'create')" type="primary" :icon="Plus" size="small" @click="openCreateUserDialog">{{ $t('settings.user.add') }}</el-button>
          </div>
        </template>
        <el-table :data="userStore.users" stripe v-loading="userStore.loading">
          <el-table-column prop="username" :label="$t('settings.user.username')" min-width="90" />
          <el-table-column prop="display_name" :label="$t('settings.user.display_name')" min-width="90" />
          <el-table-column :label="$t('settings.user.role')" min-width="90">
            <template #default="{ row }">
              <el-tag size="small">{{ row.role_display_name || row.role_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('settings.user.status')" width="70" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('settings.user.last_login')" min-width="140">
            <template #default="{ row }">
              {{ formatTime(row.last_login) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('settings.actions_label')" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-if="userStore.hasPermission('users', 'update')" type="primary" link size="small" @click="openEditUserDialog(row)">{{ $t('common.edit') }}</el-button>
              <el-button v-if="userStore.hasPermission('users', 'update')" type="warning" link size="small" @click="openChangePasswordDialog(row)">{{ $t('settings.user.change_password') }}</el-button>
              <el-button v-if="userStore.hasPermission('users', 'delete')" type="danger" link size="small" @click="handleDeleteUser(row)" :disabled="row.username === 'admin'">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ $t('settings.role.list_title') }}</span>
            <el-button v-if="userStore.hasPermission('users', 'create')" type="primary" :icon="Plus" size="small" @click="openCreateRoleDialog">{{ $t('settings.role.add') }}</el-button>
          </div>
        </template>
        <el-table :data="userStore.roles" stripe>
          <el-table-column prop="name" :label="$t('settings.role.name')" min-width="90" />
          <el-table-column prop="display_name" :label="$t('settings.user.display_name')" min-width="90" />
          <el-table-column prop="description" :label="$t('settings.role.description')" min-width="140" />
          <el-table-column :label="$t('settings.role.type')" width="70" align="center">
            <template #default="{ row }">
              <el-tag :type="row.is_system ? 'info' : 'success'" size="small">
                {{ row.is_system ? $t('settings.role.system') : $t('settings.role.custom') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('settings.actions_label')" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-if="userStore.hasPermission('users', 'update')" type="primary" link size="small" @click="openEditRoleDialog(row)">{{ $t('common.edit') }}</el-button>
              <el-button v-if="userStore.hasPermission('users', 'delete')" type="danger" link size="small" @click="handleDeleteRole(row)" :disabled="row.is_system">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <UserDialog
      v-model:visible="userDialogVisible"
      :title="userDialogTitle"
      :editing-user-id="editingUserId"
      :form="userForm"
      :role-options="roleOptions"
      @submit="handleUserSubmit"
    />

    <RoleDialog
      v-model:visible="roleDialogVisible"
      :title="roleDialogTitle"
      :editing-role-name="editingRoleName"
      :form="roleForm"
      @submit="handleRoleSubmit"
    />

    <PasswordDialog
      v-model:visible="passwordDialogVisible"
      :form="passwordForm"
      @submit="handleChangePassword"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users'
import { useUserManagement } from '../composables/useUserManagement'
import UserDialog from './UserDialog.vue'
import RoleDialog from './RoleDialog.vue'
import PasswordDialog from './PasswordDialog.vue'

const userStore = useUserStore()

const {
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
} = useUserManagement()
</script>

<style scoped>
.user-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  border: 1px solid var(--border-light);
}

.section-card :deep(.el-card__header) {
  padding: 12px 20px;
  background: var(--bg-hover);
  border-bottom: 1px solid var(--border-light);
}

.section-card :deep(.el-card__body) {
  padding: 0;
}

.section-card :deep(.el-table) {
  border-radius: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
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

  .section-card {
    margin-bottom: 16px;
  }

  .section-card :deep(.el-card__header) {
    padding: 10px 16px;
  }

  .card-title {
    font-size: 13px;
  }

  .user-section {
    gap: 12px;
  }
}
</style>
