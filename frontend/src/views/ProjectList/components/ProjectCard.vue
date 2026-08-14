<template>
  <el-card class="project-card" shadow="hover">
    <div class="project-info">
      <div class="project-title-row">
        <span class="project-name">{{ project.name }}</span>
        <el-tag
          :type="project.type === 'Dashboard' ? 'info' : 'warning'"
          size="small"
          class="type-tag"
        >
          {{
            project.type === "Dashboard"
              ? $t("scada.dashboardType")
              : $t("scada.graphicType")
          }}
        </el-tag>
        <Icon
          name="show"
          type="mono-line"
          :size="24"
          :color="{ normal: themeStore.isDark() ? 'white' : 'black' }"
          @click="$emit('preview', project)"
          class="preview-btn"
        />
      </div>
      <p class="project-desc">
        {{ project.description || $t("scada.noDescription") }}
      </p>
      <div class="project-meta">
        <span
          >{{ $t("scada.createTime") }}:
          {{ formatTime(project.createdAt) }}</span
        >
        <span
          >{{ $t("scada.updateTime") }}:
          {{ formatTime(project.updatedAt) }}</span
        >
      </div>
    </div>
    <div class="project-actions">
      <Icon
        name="edit"
        type="mono-line"
        :size="24"
        :color="{ normal: themeStore.isDark() ? 'white' : 'black' }"
        @click="$emit('edit', project)"
      />
      <Icon
        name="setting"
        type="mono-line"
        :size="24"
        :color="{ normal: themeStore.isDark() ? 'white' : 'black' }"
        @click="$emit('settings', project)"
      />
      <Icon
        name="delete"
        type="mono-line"
        :size="24"
        :color="{ normal: 'rgba(247, 111, 131, 1)' }"
        @click="$emit('delete', project.id)"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Icon } from "@/icon/index";
import type { Project } from "@/types/project";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();

defineProps<{
  project: Project;
  formatTime: (timestamp: number) => string;
}>();

defineEmits<{
  (e: "preview", project: Project): void;
  (e: "edit", project: Project): void;
  (e: "settings", project: Project): void;
  (e: "delete", id: string): void;
}>();
</script>

<style scoped>
.project-card {
  transition: all 0.3s;
  background: var(--bg-card-s);
  border-radius: 10px;
  padding: 16px;
}

.project-info {
  margin-bottom: 16px;
}

.project-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.project-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.type-tag {
  flex-shrink: 0;
}

.preview-btn {
  margin-left: auto;
  flex-shrink: 0;
}

.project-desc {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
}

.project-card :deep(.el-card__body) {
  padding: 0 !important;
}
</style>