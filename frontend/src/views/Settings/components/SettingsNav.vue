<template>
  <!-- 桌面端侧边栏导航 -->
  <div v-if="!compact" class="settings-sidebar">
    <el-menu :default-active="activeMenu" @select="handleSelect">
      <el-menu-item
        v-for="item in visibleMenuItems"
        :key="item.key"
        :index="item.key"
      >
        <el-icon>
          <Icon
            :name="item.icon"
            :size="24"
            type="mono-line"
            :color="{ normal: '--text-primary' }"
          />
        </el-icon>
        <span>{{ $t(item.i18nKey) }}</span>
      </el-menu-item>
    </el-menu>
  </div>

  <!-- 移动端/紧凑布局顶部选项卡导航 -->
  <div v-else class="settings-tabs">
    <div
      v-for="item in visibleMenuItems"
      :key="item.key"
      class="settings-tab"
      :class="{ active: activeMenu === item.key }"
      @click="handleSelect(item.key)"
    >
      <el-icon>
        <Icon
          :name="item.icon"
          :size="18"
          type="mono-line"
          :color="{ normal: '--text-primary' }"
        />
      </el-icon>
      <span>{{ $t(item.i18nKey) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@/icon/index";
import { useUserStore } from "@/stores/users";

/** 导航项元数据 */
interface MenuItem {
  /** 菜单唯一标识 */
  key: string;
  /** 自定义图标名称（对应 src/icon 字体图标） */
  icon: string;
  /** i18n 键名 */
  i18nKey: string;
  /** 查看所需权限，无则默认可见 */
  permission?: { resource: string; action: string };
}

const props = defineProps<{
  /** 当前激活的菜单项 */
  activeMenu: string;
  /** 是否使用紧凑选项卡布局 */
  compact: boolean;
}>();

const emit = defineEmits<{
  (e: "update:activeMenu", value: string): void;
}>();

const userStore = useUserStore();

/** 完整菜单配置列表 */
const menuItems: MenuItem[] = [
  { key: "general", icon: "setting", i18nKey: "settings.menu.general" },
  {
    key: "logs",
    icon: "file",
    i18nKey: "settings.menu.logs",
    permission: { resource: "logs", action: "view" },
  },
  {
    key: "backup",
    icon: "refresh",
    i18nKey: "settings.menu.backup",
    permission: { resource: "backup", action: "view" },
  },
  {
    key: "users",
    icon: "users",
    i18nKey: "settings.menu.users",
    permission: { resource: "users", action: "view" },
  },
  {
    key: "permissions",
    icon: "lock",
    i18nKey: "settings.menu.permissions",
    permission: { resource: "users", action: "view" },
  },
  {
    key: "visualization",
    icon: "dashboard",
    i18nKey: "settings.menu.visualization",
  },
];

/** 根据当前用户权限过滤后的可见菜单项 */
const visibleMenuItems = computed(() =>
  menuItems.filter((item) => {
    if (!item.permission) return true;
    return userStore.hasPermission(
      item.permission.resource,
      item.permission.action,
    );
  }),
);

/** 切换当前激活菜单 */
function handleSelect(key: string) {
  emit("update:activeMenu", key);
}
</script>

<style scoped>
.settings-sidebar {
  padding-top: 12px;
  width: 313px;
  border-right: 1px solid var(--border-base);
  flex-shrink: 0;
  background: var(--bg-card);
  border-radius: 16px;
}

.settings-sidebar .el-menu {
  border-right: none;
  background: transparent;
  color: var(--text-primary);
  --el-menu-text-color: var(--text-primary);
  --el-menu-hover-text-color: var(--text-primary);
  --el-menu-active-color: #ffffff;
}

.settings-sidebar .el-menu-item {
  height: 44px;
  line-height: 44px;
}

.settings-sidebar .el-menu-item:hover,
.settings-sidebar .el-menu-item.is-active {
  background: rgba(102, 102, 255, 1);
  color: #ffffff;
}

.settings-tabs {
  display: flex;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 4px;
  gap: 4px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-base);
  overflow-x: auto;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.settings-tab:hover {
  background: var(--bg-hover);
}

.settings-tab.active {
  background: var(--color-primary);
  color: var(--text-white);
}

.settings-tab .el-icon {
  font-size: 16px;
}

@media (max-height: 700px) {
  .settings-tabs {
    padding: 2px;
    gap: 2px;
  }

  .settings-tab {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .settings-tabs {
    padding: 6px;
    gap: 6px;
  }

  .settings-tab {
    padding: 10px 14px;
    font-size: 14px;
  }
}
</style>
