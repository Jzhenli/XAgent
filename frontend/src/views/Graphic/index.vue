<template>
  <div class="graphic-editor-container">
    <GraphicEditor
      class="graphic-editor"
      v-if="graphicData !== null && showEditor"
      :graphicData="graphicData"
      @onExit="onExit"
      @onSave="onSave"
      @showPreview="showPreview"
    ></GraphicEditor>

    <SaveConfirmModal
      :visible="showSaveConfirm"
      @save="handleConfirmSave"
      @discard="handleConfirmDiscard"
      @cancel="handleCancelConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { GraphicEditor } from "@x-plateform/graphic-editor";
import { projectApi } from "@/api/projects";
import { useThemeStore } from "@/stores/theme";
import { useScadaNavigationGuard } from "../ScadaEditor/hooks/useScadaNavigationGuard";
import SaveConfirmModal from "./modal/SaveConfirmModal.vue";

declare global {
  interface Window {
    graphicItemManager: any;
  }

  type Recordable<T = any> = Record<string, T>;
}

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const themeStore = useThemeStore();

const panelId = computed(() => route.params.id as string);
const isDark = computed(() => themeStore.theme === "dark");

const graphicData = ref<any | null>(null);
const showEditor = ref(true);
const lastSavedData = ref<string>("");
let remountTimer: number | null = null;

const getCurrentGraphicData = (): any | null => {
  if (!window.graphicItemManager) return null;
  try {
    return window.graphicItemManager.exportData();
  } catch (error) {
    console.error("Failed to export graphic data:", error);
    return null;
  }
};

const checkIsDirty = (): boolean => {
  const current = getCurrentGraphicData();
  const currentString = current === null ? "" : JSON.stringify(current);
  return currentString !== lastSavedData.value;
};

const {
  showSaveConfirm,
  startLeaveConfirmation,
  confirmSave: handleConfirmSave,
  confirmDiscard: handleConfirmDiscard,
  cancelConfirm: handleCancelConfirm,
} = useScadaNavigationGuard({
  isDirty: checkIsDirty,
  routeName: "GraphicEdit",
  onSave: async () => {
    const current = getCurrentGraphicData();
    if (current === null) {
      ElMessage.error(t("common.operationFailed"));
      return;
    }

    if (!panelId.value) return;

    try {
      const dataToSave = {
        ...graphicData.value,
        data: JSON.stringify(current),
        lastUpdateTime: new Date().toLocaleString(),
      };
      await projectApi.update(panelId.value, {
        data: dataToSave,
        updatedAt: Date.now(),
      });
      lastSavedData.value = JSON.stringify(current);
      ElMessage.success(t("scada.savePanelSuccess"));
      router.push({ name: "ScadaList" });
    } catch (error) {
      console.error("Failed to save graphic project:", error);
      ElMessage.error(t("common.updateFailed"));
    }
  },
  onDiscard: () => {
    return router.push({ name: "ScadaList" });
  },
});

onMounted(() => {
  loadProject();
  setLang();
  setTheme();
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  if (remountTimer !== null) {
    clearTimeout(remountTimer);
    remountTimer = null;
  }
});

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (checkIsDirty()) {
    event.preventDefault();
    event.returnValue = "";
  }
};

/**
 * project.data 数据结构（仅 data / lastUpdateTime / previewImage 有效）：
 * {
 *   id, name, type, description,
 *   data: { width, height, grid, backgroundColor, backgroundImage, components, metadata, tags, data: string, previewImage, lastUpdateTime },
 *   enabled, createdAt, updatedAt
 * }
 */
const loadProject = async () => {
  if (!panelId.value) return;

  try {
    const project = await projectApi.get(panelId.value);
    if (!project.data) return;

    graphicData.value = project.data;
    lastSavedData.value = extractDataString(graphicData.value);
  } catch (error) {
    console.error("Failed to load graphic project:", error);
    ElMessage.error(t("common.error"));
    graphicData.value = {};
    lastSavedData.value = "";
  }
};

const extractDataString = (data: any): string => {
  if (!data || typeof data !== "object") return "";
  return typeof data.data === "string"
    ? data.data
    : JSON.stringify(data.data ?? {});
};

const onExit = () => {
  if (checkIsDirty()) {
    startLeaveConfirmation();
  } else {
    router.push({ name: "ScadaList" });
  }
};

const onSave = async (data: any, callback?: (success: boolean) => void) => {
  if (!panelId.value) {
    callback?.(false);
    return;
  }

  try {
    await projectApi.update(panelId.value, {
      data,
      updatedAt: Date.now(),
    });
    lastSavedData.value = extractDataString(data);
    callback?.(true);
  } catch (error) {
    console.error("Failed to save graphic project:", error);
    callback?.(false);
  }
};

const showPreview = () => {
  // 预留预览入口
};

watch(locale, async () => {
  await nextTick();
  setLang();
});

watch(isDark, async () => {
  await nextTick();
  setTheme();
});

const setTheme = () => {
  const body = document.body;
  body.classList.remove("x-theme-1", "x-theme-2");
  body.classList.add(isDark.value ? "x-theme-1" : "x-theme-2");
};

const setLang = () => {
  const langMap: Record<string, string> = {
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    en: "en-US",
  };
  const targetLang = langMap[locale.value] || "zh-CN";

  // 隐藏编辑器后切换语言，再重新挂载以触发完整重建
  showEditor.value = false;
  window.graphicItemManager?.switchLanguage(targetLang);
  if (remountTimer !== null) {
    clearTimeout(remountTimer);
  }
  remountTimer = window.setTimeout(() => {
    showEditor.value = true;
    remountTimer = null;
  }, 50);
};
</script>

<style scoped>
.graphic-editor-container {
  height: calc(100vh - 100px - 32px);
  display: flex;
  flex-direction: column;
  /* background-color: var(--bg-secondary); */
}
</style>
