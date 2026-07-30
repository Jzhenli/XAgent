<template>
  <div class="project-list-container">
    <div class="header">
      <span class="header-title">{{ $t("scada.title") }}</span>
      <div class="header-actions">
        <div class="btn btn-preview" @click="handleStartSlideshow">
          {{ $t("scada.previewAll") }}
        </div>
        <div class="btn btn-create" @click="openCreateDialog">
          <el-icon :size="16"><Plus /></el-icon>
          <span>{{ $t("scada.newProject") }}</span>
        </div>
        <el-dropdown
          trigger="hover"
          placement="bottom-end"
          popper-class="project-dropdown-popper"
          @command="handleMoreCommand"
        >
          <el-icon class="more-icon" :size="32">
            <svg viewBox="0 0 24 24" width="1em" height="1em">
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="19" r="2" fill="currentColor" />
            </svg>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu class="project-more-menu">
              <el-dropdown-item command="refresh">
                <el-icon :size="16"><Refresh /></el-icon>
                <span style="margin-left: 6px">{{ $t("common.refresh") }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="import">
                <el-icon :size="16"><Upload /></el-icon>
                <span style="margin-left: 6px">{{ $t("common.import") }}</span>
              </el-dropdown-item>
              <el-dropdown-item command="export">
                <el-icon :size="16"><Download /></el-icon>
                <span style="margin-left: 6px">{{ $t("common.export") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-content">
        <el-icon class="is-loading" :size="48"><Loading /></el-icon>
        <span class="loading-text">{{ $t("common.loading") }}</span>
      </div>
    </div>

    <div v-else-if="projects.length === 0" class="scrollable-content">
      <div class="empty-state">
        <el-empty :description="$t('scada.noProjects')"> </el-empty>
      </div>
    </div>

    <div v-else class="scrollable-content">
      <div class="project-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :format-time="formatTime"
          @preview="handlePreview"
          @edit="handleEdit"
          @settings="openEditDialog"
          @delete="handleDelete"
        />
      </div>
    </div>

    <CreateDialog
      v-model="showCreateDialog"
      v-model:name="dialogName"
      v-model:type="dialogType"
      v-model:description="dialogDescription"
      @create="handleCreate"
    />

    <EditDialog
      v-model="showEditDialog"
      v-model:name="dialogName"
      v-model:description="dialogDescription"
      @save="handleSaveEdit"
    />

    <input
      ref="importInputRef"
      type="file"
      accept=".json,application/json"
      style="display: none"
      @change="handleImportFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  VideoPlay,
  Refresh,
  Upload,
  Download,
  Loading,
} from "@element-plus/icons-vue";
import { projectApi } from "@/api/projects";
import type { ProjectCreateRequest } from "@/api/projects";
import type { PanelType } from "@/views/ScadaEditor/types";
import type { Project } from "@/types/project";
import ProjectCard from "./components/ProjectCard.vue";
import CreateDialog from "./components/CreateDialog.vue";
import EditDialog from "./components/EditDialog.vue";

const { t } = useI18n();
const router = useRouter();

// 项目列表
const projects = ref<Project[]>([]);

// 加载状态
const loading = ref(false);

// 对话框状态
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const editingProjectId = ref<string | null>(null);

// 导入文件输入
const importInputRef = ref<HTMLInputElement | null>(null);

// 新建 / 编辑共享表单
const dialogName = ref("");
const dialogType = ref<PanelType>("Dashboard");
const dialogDescription = ref("");

const VALID_PROJECT_TYPES: PanelType[] = ["Dashboard", "Graphic"];

const isValidProjectType = (type: string): type is PanelType =>
  VALID_PROJECT_TYPES.includes(type as PanelType);

onMounted(() => {
  loadProjects();
});

/** 统一解析异常信息 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
};

/** 从后端加载项目列表 */
const loadProjects = async (): Promise<boolean> => {
  if (loading.value) return false;

  loading.value = true;

  try {
    const res = await projectApi.list();
    projects.value = (res?.items ?? []).sort(
      (a, b) => a.createdAt - b.createdAt,
    );

    return true;
  } catch (error) {
    ElMessage.error(getErrorMessage(error, t("common.error")));
    return false;
  } finally {
    loading.value = false;
  }
};

/** 重置对话框表单 */
const resetDialogForm = () => {
  dialogName.value = "";
  dialogType.value = "Dashboard";
  dialogDescription.value = "";
  editingProjectId.value = null;
};

/** 打开新建项目对话框 */
const openCreateDialog = () => {
  resetDialogForm();
  showCreateDialog.value = true;
};

/** 校验创建项目参数 */
const validateCreateParams = (): boolean => {
  if (!dialogName.value.trim()) {
    ElMessage.warning(
      t("common.pleaseEnter", { name: t("scada.projectName") }),
    );
    return false;
  }

  if (!isValidProjectType(dialogType.value)) {
    ElMessage.warning(
      t("common.pleaseSelect", { name: t("scada.projectType") }),
    );
    return false;
  }

  return true;
};

/** 创建项目 */
const handleCreate = async () => {
  if (!validateCreateParams()) return;

  try {
    const now = Date.now();

    const res = await projectApi.create({
      id: `panel-${now}`,
      name: dialogName.value.trim(),
      type: dialogType.value,
      description: dialogDescription.value.trim(),
      data: {},
      createdAt: now,
      updatedAt: now,
    });

    if (res) {
      projects.value.push(res);
      ElMessage.success(t("scada.createSuccess"));
      showCreateDialog.value = false;
      resetDialogForm();
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, t("scada.createFailed")));
  }
};

/** 打开编辑项目对话框 */
const openEditDialog = (project: Project) => {
  editingProjectId.value = project.id;
  dialogName.value = project.name;
  dialogDescription.value = project.description || "";
  showEditDialog.value = true;
};

/** 保存项目编辑 */
const handleSaveEdit = async () => {
  if (!editingProjectId.value) return;

  try {
    const res = await projectApi.update(editingProjectId.value, {
      name: dialogName.value,
      description: dialogDescription.value,
      updatedAt: Date.now(),
    });

    const index = projects.value.findIndex(
      (p) => p.id === editingProjectId.value,
    );
    if (index !== -1) {
      projects.value[index] = res;
    }

    ElMessage.success(t("common.updateSuccess"));
    showEditDialog.value = false;
    resetDialogForm();
  } catch (error) {
    ElMessage.error(getErrorMessage(error, t("common.updateFailed")));
  }
};

/** 删除项目 */
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm(t("common.deleteConfirm"), t("common.tip"), {
      confirmButtonText: t("common.confirm"),
      cancelButtonText: t("common.cancel"),
      type: "warning",
    });
  } catch {
    return;
  }

  try {
    await projectApi.delete(id);
    projects.value = projects.value.filter((p) => p.id !== id);
    ElMessage.success(t("common.deleteSuccess"));
  } catch (error) {
    ElMessage.error(getErrorMessage(error, t("common.deleteFailed")));
  }
};

/** 跳转预览 */
const handlePreview = (project: Project) => {
  router.push({
    name: project.type === "Dashboard" ? "ScadaPreview" : "GraphicPreview",
    params: { id: project.id },
  });
};

/** 跳转编辑器 */
const handleEdit = (project: Project) => {
  const routeName = project.type === "Dashboard" ? "ScadaEdit" : "GraphicEdit";
  router.push({ name: routeName, params: { id: project.id } });
};

/** 进入全屏轮播预览 */
const handleStartSlideshow = () => {
  router.push({ name: "VantPreview" });
};

/** 下拉菜单命令处理 */
const handleMoreCommand = (command: string) => {
  switch (command) {
    case "refresh":
      handleRefresh();
      break;
    case "import":
      triggerImport();
      break;
    case "export":
      handleExport();
      break;
  }
};

/** 刷新项目列表 */
const handleRefresh = async () => {
  const success = await loadProjects();
  if (success) {
    ElMessage.success(t("scada.refreshSuccess"));
  }
};

/** 触发导入文件选择 */
const triggerImport = () => {
  importInputRef.value?.click();
};

/** 解析并校验导入的项目数据 */
const normalizeImportedProject = (
  item: unknown,
): ProjectCreateRequest | null => {
  if (!item || typeof item !== "object") return null;
  const project = item as Partial<Project>;
  if (!project.name || !project.type) return null;
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    description: project.description,
    data: project.data,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

/** 导入项目文件 */
const handleImportFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const rawProjects = Array.isArray(parsed)
      ? parsed
      : parsed.projects || parsed.data;

    if (!Array.isArray(rawProjects)) {
      ElMessage.error(t("scada.invalidProjectsFile"));
      return;
    }

    const requests = rawProjects
      .map(normalizeImportedProject)
      .filter((item): item is ProjectCreateRequest => item !== null);

    if (requests.length === 0) {
      ElMessage.warning(t("scada.invalidProjectsFile"));
      return;
    }

    const confirmMessage = t("scada.importConfirm", { count: requests.length });
    try {
      await ElMessageBox.confirm(
        confirmMessage,
        t("scada.importConfirmTitle"),
        {
          confirmButtonText: t("common.confirm"),
          cancelButtonText: t("common.cancel"),
          type: "warning",
        },
      );
    } catch {
      return;
    }

    let success = 0;
    let failed = 0;
    for (const request of requests) {
      try {
        await projectApi.create(request);
        success++;
      } catch {
        failed++;
      }
    }

    await loadProjects();

    if (failed === 0) {
      ElMessage.success(t("scada.projectsImported", { count: success }));
    } else {
      ElMessage.warning(t("scada.projectsImportPartial", { success, failed }));
    }
  } catch {
    ElMessage.error(t("scada.invalidProjectsFile"));
  } finally {
    input.value = "";
  }
};

/** 导出所有项目 */
const handleExport = () => {
  if (projects.value.length === 0) {
    ElMessage.warning(t("scada.noExportableProjects"));
    return;
  }

  const data = JSON.stringify(projects.value, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `projects-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  ElMessage.success(
    t("scada.projectsExported", { count: projects.value.length }),
  );
};

/** 格式化时间戳为本地时间字符串 */
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};
</script>

<style scoped>
.project-list-container {
  height: calc(100vh - 100px);
  background-color: var(--bg-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  backdrop-filter: blur(48px);
}

.header {
  height: 60px;
  padding: 0 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  font-style: normal;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  background: var(--bg-container);
  border-radius: 8px;
  padding: 60px 20px;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 18px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--el-color-primary);
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.more-icon {
  cursor: pointer;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 8px;
  transition:
    color 0.2s,
    background-color 0.2s;
  outline: none;
}

.more-icon:hover {
  color: var(--el-color-primary);
  background-color: var(--el-fill-color-light);
}

:deep(.project-more-menu) {
  padding: 6px;
  border-radius: 12px;
  min-width: 140px;
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-light);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.16),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

:deep(.project-more-menu .el-dropdown__item) {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
  transition:
    background-color 0.15s,
    color 0.15s;
}

:deep(.project-more-menu .el-dropdown__item:hover) {
  background-color: var(--el-fill-color-light) !important;
  color: var(--el-color-primary) !important;
}

:deep(.project-more-menu .el-dropdown__item .el-icon) {
  color: var(--text-secondary);
}

:deep(.project-more-menu .el-dropdown__item:hover .el-icon) {
  color: var(--el-color-primary);
}

:deep(.project-more-menu .el-dropdown-menu__item.is-disabled) {
  color: var(--text-disabled);
}

:deep(.project-more-menu .el-dropdown-menu__item.is-divider) {
  height: 1px;
  margin: 4px 0;
  padding: 0;
  background-color: var(--border-light);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-preview {
  background-color: rgba(0, 206, 209, 1);
  color: white;
}

.btn-preview:hover {
  background-color: rgba(0, 206, 209, 1);
}

.btn-create {
  background-color: rgba(102, 102, 255, 1);
  color: white;
}

.btn-create:hover {
  background-color: rgba(102, 102, 255, 0.9);
}
</style>

<style>
.project-dropdown-popper {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.project-dropdown-popper .el-popper__arrow {
  display: none !important;
}
</style>
