<template>
  <template v-if="!compact">
    <div class="settings-sidebar">
      <el-menu :default-active="activeMenu" @select="(key: string) => emit('update:activeMenu', key)">
        <el-menu-item index="general">
          <el-icon><Setting /></el-icon>
          <span>{{ $t('settings.menu.general') }}</span>
        </el-menu-item>
        <el-menu-item v-if="userStore.hasPermission('logs', 'view')" index="logs">
          <el-icon><Document /></el-icon>
          <span>{{ $t('settings.menu.logs') }}</span>
        </el-menu-item>
        <el-menu-item v-if="userStore.hasPermission('backup', 'view')" index="backup">
          <el-icon><Refresh /></el-icon>
          <span>{{ $t('settings.menu.backup') }}</span>
        </el-menu-item>
        <el-menu-item v-if="userStore.hasPermission('users', 'view')" index="users">
          <el-icon><User /></el-icon>
          <span>{{ $t('settings.menu.users') }}</span>
        </el-menu-item>
        <el-menu-item v-if="userStore.hasPermission('users', 'view')" index="permissions">
          <el-icon><Lock /></el-icon>
          <span>{{ $t('settings.menu.permissions') }}</span>
        </el-menu-item>
        <el-menu-item index="visualization">
          <el-icon><Document /></el-icon>
          <span>{{ $t('settings.menu.visualization') }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </template>

  <template v-else>
    <div class="settings-tabs">
      <div
        class="settings-tab"
        :class="{ active: activeMenu === 'general' }"
        @click="emit('update:activeMenu', 'general')"
      >
        <el-icon><Setting /></el-icon>
        <span>{{ $t('settings.menu.general') }}</span>
      </div>
      <div
        v-if="userStore.hasPermission('logs', 'view')"
        class="settings-tab"
        :class="{ active: activeMenu === 'logs' }"
        @click="emit('update:activeMenu', 'logs')"
      >
        <el-icon><Document /></el-icon>
        <span>{{ $t('settings.menu.logs') }}</span>
      </div>
      <div
        v-if="userStore.hasPermission('backup', 'view')"
        class="settings-tab"
        :class="{ active: activeMenu === 'backup' }"
        @click="emit('update:activeMenu', 'backup')"
      >
        <el-icon><Refresh /></el-icon>
        <span>{{ $t('settings.menu.backup') }}</span>
      </div>
      <div
        v-if="userStore.hasPermission('users', 'view')"
        class="settings-tab"
        :class="{ active: activeMenu === 'users' }"
        @click="emit('update:activeMenu', 'users')"
      >
        <el-icon><User /></el-icon>
        <span>{{ $t('settings.menu.users') }}</span>
      </div>
      <div
        v-if="userStore.hasPermission('users', 'view')"
        class="settings-tab"
        :class="{ active: activeMenu === 'permissions' }"
        @click="emit('update:activeMenu', 'permissions')"
      >
        <el-icon><Lock /></el-icon>
        <span>{{ $t('settings.menu.permissions') }}</span>
      </div>
      <div
        class="settings-tab"
        :class="{ active: activeMenu === 'visualization' }"
        @click="emit('update:activeMenu', 'visualization')"
      >
        <el-icon><Document /></el-icon>
        <span>{{ $t('settings.menu.visualization') }}</span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import {
  Setting,
  Document,
  Refresh,
  User,
  Lock,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users'

defineProps<{
  activeMenu: string
  compact: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activeMenu', value: string): void
}>()

const userStore = useUserStore()
</script>