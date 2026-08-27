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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { projectApi } from "@/api/projects";
import { ArrowLeft } from "@element-plus/icons-vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import type { Project } from "@/types/project";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const loading = ref(false);
const error = ref("");
const currentPanel = ref<Project | null>(null);

onMounted(async () => {
  await loadPanelData();
});

const loadPanelData = async () => {
  const panelId = route.params.id as string;
  if (!panelId) {
    error.value = t("scada.invalidPanelId");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const project = await projectApi.get(panelId);
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
