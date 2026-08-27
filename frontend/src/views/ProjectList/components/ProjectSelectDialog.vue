<template>
  <el-dialog v-model="visible" :title="title" width="520px" class="x-dialog project-select-dialog">
    <div class="select-dialog-content">
      <div class="select-header">
        <el-checkbox
          :model-value="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          <span class="select-all-label">{{ $t("scada.selectAll") }}</span>
        </el-checkbox>
        <div class="selected-count">
          <span class="count-num">{{ selected.size }}</span>
          <span class="count-sep">/</span>
          <span class="count-total">{{ items.length }}</span>
          <span class="count-unit">{{ $t("scada.selectedCount", { count: "" }) }}</span>
        </div>
      </div>

      <div class="project-list">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="project-row"
          :class="{ 'is-checked': selected.has(index) }"
          @click="handleRowClick(index)"
        >
          <el-checkbox
            :model-value="selected.has(index)"
            @click.stop
            @change="(checked) => handleToggle(index, checked)"
          />
          <div class="project-info">
            <span class="project-name" :title="item.name">{{ item.name }}</span>
            <el-tag
              :type="item.type === 'Dashboard' ? 'info' : 'warning'"
              size="small"
              effect="light"
              class="type-tag"
            >
              {{
                item.type === "Dashboard"
                  ? $t("scada.dashboardType")
                  : $t("scada.graphicType")
              }}
            </el-tag>
          </div>
        </div>

        <div v-if="items.length === 0" class="empty-tip">
          <div class="empty-icon">📂</div>
          <div class="empty-text">{{ emptyText }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ $t("common.cancel") }}</el-button>
      <el-button
        type="primary"
        :disabled="selected.size === 0"
        @click="handleConfirm"
      >
        {{ confirmText }}<span v-if="selected.size > 0" class="confirm-count">({{ selected.size }})</span>
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PanelType } from "@/views/ScadaEditor/types";

interface ProjectSelectItem {
  name: string;
  type: PanelType;
}

const props = defineProps<{
  title: string;
  items: ProjectSelectItem[];
  confirmText: string;
  emptyText: string;
}>();

const visible = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  (e: "confirm", indices: number[]): void;
}>();

const selected = ref(new Set<number>());

const isAllSelected = computed(
  () => props.items.length > 0 && selected.value.size === props.items.length,
);

const isIndeterminate = computed(
  () => selected.value.size > 0 && selected.value.size < props.items.length,
);

watch(visible, (val) => {
  if (val) {
    selected.value = new Set(props.items.map((_, index) => index));
  }
});

watch(
  () => props.items,
  () => {
    const validIndices = new Set(props.items.map((_, index) => index));
    const next = new Set<number>();
    selected.value.forEach((i) => {
      if (validIndices.has(i)) next.add(i);
    });
    selected.value = next;
  },
);

const handleSelectAll = (checked: boolean) => {
  selected.value = checked
    ? new Set(props.items.map((_, index) => index))
    : new Set();
};

const handleToggle = (index: number, checked: boolean) => {
  const next = new Set(selected.value);
  if (checked) {
    next.add(index);
  } else {
    next.delete(index);
  }
  selected.value = next;
};

const handleRowClick = (index: number) => {
  handleToggle(index, !selected.value.has(index));
};

const handleConfirm = () => {
  emit("confirm", [...selected.value]);
  visible.value = false;
};
</script>

<style>
@import "../DialogCommon.css";
</style>

<style scoped>
.select-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--bg-card-s);
  border: 1px solid var(--border-base);
  border-radius: 10px;
}

.select-all-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.selected-count {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-size: 13px;
  color: var(--text-secondary);
}

.count-num {
  font-size: 18px;
  font-weight: 600;
  color: rgba(102, 102, 255, 1);
  font-variant-numeric: tabular-nums;
}

.count-sep {
  margin: 0 2px;
  color: var(--text-placeholder);
}

.count-total {
  font-weight: 500;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.count-unit {
  margin-left: 4px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.project-list::-webkit-scrollbar {
  width: 6px;
}

.project-list::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.project-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--border-base);
  border-radius: 10px;
  background: var(--bg-card);
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.15s;
  user-select: none;
}

.project-row:hover {
  background: var(--bg-card-s);
  border-color: rgba(102, 102, 255, 0.5);
}

.project-row.is-checked {
  background: rgba(102, 102, 255, 0.08);
  border-color: rgba(102, 102, 255, 1);
  box-shadow: 0 0 0 1px rgba(102, 102, 255, 0.2);
}

.project-row :deep(.el-checkbox) {
  margin-right: 0;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.project-name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-tag {
  flex-shrink: 0;
  border-radius: 6px;
  font-weight: 500;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 36px;
  opacity: 0.6;
}

.empty-text {
  font-size: 14px;
}

.confirm-count {
  margin-left: 4px;
  font-weight: 500;
}

.project-select-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid var(--border-base);
}
</style>
