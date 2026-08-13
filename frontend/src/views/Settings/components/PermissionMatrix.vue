<template>
  <div class="settings-section">
    <div class="permission-section">
      <div class="permission-toolbar">
        <el-select
          v-model="activePermissionRole"
          :placeholder="$t('settings.permission.select_role')"
          class="plain-select"
          popper-class="plain-select-dropdown"
        >
          <el-option
            v-for="role in userStore.permissionMatrix?.roles || []"
            :key="role.name"
            :label="role.display_name"
            :value="role.name"
          />
        </el-select>
        <div class="permission-header-actions">
          <div
            v-if="
              !isEditingPermissions &&
              userStore.hasPermission('users', 'update')
            "
            class="action-btn btn-primary"
            @click="startEditPermissions"
          >
            <el-icon :size="14"><Edit /></el-icon>
            <span>{{ $t("settings.permission.edit") }}</span>
          </div>
          <template v-else>
            <div class="action-btn accent" @click="cancelEditPermissions">
              <el-icon :size="14"><Close /></el-icon>
              <span>{{ $t("common.cancel") }}</span>
            </div>
            <div class="action-btn btn-primary" @click="savePermissions">
              <el-icon :size="14"><Check /></el-icon>
              <span>{{ $t("common.save") }}</span>
            </div>
          </template>
        </div>
      </div>

      <div
        v-if="userStore.permissionMatrix && activePermissionRole"
        class="permission-matrix"
      >
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="resource-header">
                {{ $t("settings.permission.resource_action") }}
              </th>
              <th
                v-for="action in userStore.permissionMatrix.actions"
                :key="action"
                class="action-header"
              >
                {{ ACTION_LABELS[action] || action }}
              </th>
              <th v-if="isEditingPermissions" class="action-header">
                {{ $t("settings.permission.quick_action") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="resource in userStore.permissionMatrix.resources"
              :key="resource"
            >
              <td class="resource-cell">
                {{ RESOURCE_LABELS[resource] || resource }}
              </td>
              <td
                v-for="action in userStore.permissionMatrix.actions"
                :key="`${resource}-${action}`"
                class="permission-cell"
              >
                <template v-if="isEditingPermissions">
                  <el-checkbox
                    :model-value="
                      permissionEditData[resource]?.[action] ?? false
                    "
                    @change="togglePermission(resource, action)"
                  />
                </template>
                <template v-else>
                  <el-icon
                    v-if="
                      currentRolePermissions?.permissions?.[resource]?.[action]
                    "
                    class="perm-allowed"
                    ><Check
                  /></el-icon>
                  <el-icon v-else class="perm-denied"><Close /></el-icon>
                </template>
              </td>
              <td v-if="isEditingPermissions" class="shortcut-cell">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="selectAllForResource(resource)"
                  >{{ $t("settings.permission.select_all") }}</el-button
                >
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="clearAllForResource(resource)"
                  >{{ $t("settings.permission.clear_all") }}</el-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!activePermissionRole && userStore.permissionMatrix"
        class="empty-hint"
      >
        {{ $t("settings.permission.select_role_hint") }}
      </div>

      <div class="permission-legend">
        <span class="legend-item">
          <el-icon class="perm-allowed"><Check /></el-icon>
          {{ $t("settings.permission.allowed") }}
        </span>
        <span class="legend-item">
          <el-icon class="perm-denied"><Close /></el-icon>
          {{ $t("settings.permission.denied") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Check, Close } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/users";
import { usePermissionMatrix } from "../composables/usePermissionMatrix";

const userStore = useUserStore();

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
} = usePermissionMatrix();
</script>

<style scoped>
.permission-section {
  max-width: 100%;
}

.permission-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.permission-header-actions {
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

.action-btn.btn-primary {
  color: #fff;
  background: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.action-btn.accent {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.13);
}

:deep(.el-select.plain-select) {
  width: 200px;
}

:deep(.el-select.plain-select .el-select__wrapper) {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-base, #dcdfe6) !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 8px;
}

:deep(.el-select.plain-select.is-focused .el-select__wrapper) {
  border-bottom-color: var(--color-primary, #409eff) !important;
}

:deep(.el-select.plain-select .el-select__selected-item),
:deep(.el-select.plain-select .el-select__placeholder) {
  background: transparent !important;
  color: var(--text-primary);
  height: 32px;
  line-height: 32px;
  text-align: center;
}

:deep(.el-select.plain-select .el-select__suffix),
:deep(.el-select.plain-select .el-input__suffix) {
  color: var(--text-secondary);
}

.permission-matrix {
  overflow-x: auto;
}

:deep(.el-checkbox .el-checkbox__inner) {
  background-color: var(--bg-container);
  border-color: var(--border-base);
}

:deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background-color: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
  font-size: 14px;
  background: var(--bg-card-s);
}

.matrix-table th,
.matrix-table td {
  border-right: 1px solid var(--border-base);
  border-bottom: 1px solid var(--border-base);
  padding: 10px 16px;
  text-align: center;
}

.matrix-table th:last-child,
.matrix-table td:last-child {
  border-right: none;
}

.matrix-table tr:last-child th,
.matrix-table tr:last-child td {
  border-bottom: none;
}

.resource-header {
  background: transparent;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  min-width: 120px;
}

.action-header {
  background: transparent;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
}

.resource-cell {
  text-align: left;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
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
  background: var(--bg-card-s);
  border-radius: 10px;
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

<style>
.plain-select-dropdown {
  background: var(--bg-card) !important;
}

.plain-select-dropdown .el-select-dropdown__item {
  text-align: center;
}

.permission-matrix .el-checkbox .el-checkbox__inner {
  background-color: var(--bg-container);
  border-color: var(--border-base);
}

.permission-matrix .el-checkbox.is-checked .el-checkbox__inner {
  background-color: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}

[data-theme='dark'] .permission-matrix .el-checkbox .el-checkbox__inner {
  background-color: #2a2a4e;
  border-color: #3a3f5a;
}

[data-theme='dark'] .permission-matrix .el-checkbox.is-checked .el-checkbox__inner {
  background-color: rgba(102, 102, 255, 1);
  border-color: rgba(102, 102, 255, 1);
}
</style>
