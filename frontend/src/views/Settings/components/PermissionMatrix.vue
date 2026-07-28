<template>
  <div class="settings-section">
    <h3>{{ $t('settings.menu.permissions') }}</h3>
    <div class="permission-section">
      <div class="permission-toolbar">
        <el-select v-model="activePermissionRole" :placeholder="$t('settings.permission.select_role')" style="width: 200px">
          <el-option
            v-for="role in userStore.permissionMatrix?.roles || []"
            :key="role.name"
            :label="role.display_name"
            :value="role.name"
          />
        </el-select>
        <div v-if="!isEditingPermissions && userStore.hasPermission('users', 'update')" class="permission-actions">
          <el-button type="primary" :icon="Edit" @click="startEditPermissions">{{ $t('settings.permission.edit') }}</el-button>
        </div>
        <div v-else class="permission-actions">
          <el-button type="success" :icon="Check" @click="savePermissions">{{ $t('common.save') }}</el-button>
          <el-button :icon="Close" @click="cancelEditPermissions">{{ $t('common.cancel') }}</el-button>
        </div>
      </div>

      <div v-if="userStore.permissionMatrix && activePermissionRole" class="permission-matrix">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="resource-header">{{ $t('settings.permission.resource_action') }}</th>
              <th v-for="action in userStore.permissionMatrix.actions" :key="action" class="action-header">
                {{ ACTION_LABELS[action] || action }}
              </th>
              <th v-if="isEditingPermissions" class="action-header">{{ $t('settings.permission.quick_action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in userStore.permissionMatrix.resources" :key="resource">
              <td class="resource-cell">{{ RESOURCE_LABELS[resource] || resource }}</td>
              <td v-for="action in userStore.permissionMatrix.actions" :key="`${resource}-${action}`" class="permission-cell">
                <template v-if="isEditingPermissions">
                  <el-checkbox
                    :model-value="permissionEditData[resource]?.[action] ?? false"
                    @change="togglePermission(resource, action)"
                  />
                </template>
                <template v-else>
                  <el-icon v-if="currentRolePermissions?.permissions?.[resource]?.[action]" class="perm-allowed"><Check /></el-icon>
                  <el-icon v-else class="perm-denied"><Close /></el-icon>
                </template>
              </td>
              <td v-if="isEditingPermissions" class="shortcut-cell">
                <el-button link type="primary" size="small" @click="selectAllForResource(resource)">{{ $t('settings.permission.select_all') }}</el-button>
                <el-button link type="danger" size="small" @click="clearAllForResource(resource)">{{ $t('settings.permission.clear_all') }}</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!activePermissionRole && userStore.permissionMatrix" class="empty-hint">
        {{ $t('settings.permission.select_role_hint') }}
      </div>

      <div class="permission-legend">
        <span class="legend-item"><el-icon class="perm-allowed"><Check /></el-icon> {{ $t('settings.permission.allowed') }}</span>
        <span class="legend-item"><el-icon class="perm-denied"><Close /></el-icon> {{ $t('settings.permission.denied') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Check, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users'
import { usePermissionMatrix } from '../composables/usePermissionMatrix'

const userStore = useUserStore()

const {
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
} = usePermissionMatrix()
</script>

<style scoped>
.permission-section {
  max-width: 100%;
}

.permission-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.permission-actions {
  display: flex;
  gap: 8px;
}

.permission-matrix {
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.matrix-table th,
.matrix-table td {
  border: 1px solid var(--border-base);
  padding: 10px 16px;
  text-align: center;
}

.resource-header {
  background: var(--bg-hover);
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  min-width: 120px;
}

.action-header {
  background: var(--bg-hover);
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
}

.resource-cell {
  text-align: left;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-hover);
}

.permission-cell {
  vertical-align: middle;
}

.shortcut-cell {
  vertical-align: middle;
  white-space: nowrap;
}

.perm-allowed {
  color: var(--color-success);
  font-size: 18px;
}

.perm-denied {
  color: var(--color-danger);
  font-size: 18px;
}

.permission-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-hover);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-hint {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 14px;
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

  .matrix-table {
    font-size: 13px;
  }

  .matrix-table th,
  .matrix-table td {
    padding: 8px 12px;
  }

  .resource-header,
  .action-header {
    min-width: 80px;
  }

  .resource-header {
    min-width: 100px;
  }

  .permission-matrix {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>