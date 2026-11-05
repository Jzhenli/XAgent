<template>
  <div class="preview-page">
    <div v-if="loading" class="loading-state" v-loading="true" :element-loading-text="$t('common.loading')" :element-loading-spinner-size="48">
    </div>

    <div v-else-if="error" class="error-state">
      <el-empty :description="error">
        <el-button type="primary" @click="loadPanelData">{{
          $t("common.retry")
        }}</el-button>
      </el-empty>
    </div>

    <div v-else-if="currentPanel" class="preview-content">
      <div class="canvas-wrapper">
        <GraphicSingle ref="graphicSingle" :project="currentPanel" />
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty :description="$t('scada.projectNotExist')">
        <el-button type="primary" @click="handleGoBack">
          {{ $t("scada.backToProjectList") }}
        </el-button>
      </el-empty>
    </div>

    <div v-if="currentPanel" class="floating-tools">
      <div class="floating-back" @click="handleGoBack">
        <el-icon :size="20"><ArrowLeft /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { projectApi } from "@/api/projects";
import { ArrowLeft } from "@element-plus/icons-vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import type { Project } from "@/types/project";
import { useScadaEditor } from "@/views/ScadaEditor/hooks/useScadaEditor";
import { useScadaPolling } from "@/views/ScadaEditor/hooks/useScadaBinding";
import { useScadaPointReader, ScadaPointReaderKey } from "@/utils/scadaPointReader";
import { useSystemStore } from "@/stores/system";
import { panelStore } from "@/utils/panelStore";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const scada = useScadaEditor();
const systemStore = useSystemStore();

const pointReader = useScadaPointReader();
provide(ScadaPointReaderKey, pointReader);

// graphic 面板无 scada 组件，boundAssets 恒为空；轮询目标实际来自
// DataHandleManager 向 reader 注册的需求设备（useScadaPolling 内部取并集）
const { stop: stopPolling } = useScadaPolling({
  interval: systemStore.visualizationConfig.pollingInterval,
  reader: pointReader,
});

const loading = ref(false);
const error = ref("");
const currentPanel = ref<Project | null>(null);

onMounted(async () => {
  // isEditing 默认 true 会短路 refreshBoundDevices，预览态需显式关闭
  scada.isEditing.value = false;
  await loadPanelData();

  // 🆕 首屏加载完后，后台预加载所有项目进 IndexedDB（不阻塞遮罩）
  panelStore.preloadAll();
});

onUnmounted(() => {
  scada.isEditing.value = true;
  stopPolling();
  pointReader.clearDevices();
});

/** 加载路由参数指定 id 的 Graphic 面板数据 —— IndexedDB 优先，miss 走网络 + 回填 */
const loadPanelData = async () => {
  const panelId = route.params.id as string;
  if (!panelId) {
    error.value = t("scada.invalidPanelId");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    let project: Project | null = null;

    // 1️⃣ 优先从 IndexedDB 读 —— 绕开 base64 图片导致的 ~1s 网络+JSON 序列化瓶颈
    project = await panelStore.get(panelId);

    // 2️⃣ 未命中 → 走网络，成功后回填 IndexedDB
    if (!project) {
      project = await projectApi.get(panelId);
      if (project) {
        await panelStore.set(project);
      }
    }

    if (!project || !project.data) {
      error.value = t("scada.loadPanelFailed");
      ElMessage.error(t("scada.loadPanelFailed"));
      return;
    }
    currentPanel.value = project;
  } catch (err) {
    error.value = t("common.error");
    console.error("Failed to load panel:", err);
    ElMessage.error(t("common.error"));
  } finally {
    loading.value = false;
  }
};

const handleGoBack = () => {
  pointReader.clearAll();   // 用户主动退出预览态 → 彻底清空所有数据缓存
  panelStore.clear();       // 🆕 清空 IndexedDB（退出预览会话）
  router.push({ name: "ScadaList" });
};
</script>

<style scoped>
.preview-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a2e;
}

.loading-state,
.error-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-content {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-tools {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
}

.floating-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.floating-back:hover {
  background: rgba(255, 255, 255, 0.22);
}
</style>
