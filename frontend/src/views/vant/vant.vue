<template>
  <div class="vant-container">
    <div class="exit-button">
      <el-button :icon="ArrowLeft" circle size="small" @click="exit" />
    </div>

    <div class="floating-tab-bar">
      <div
        v-for="(tab, i) in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === i }"
        @click="activeTab = i"
      >
        <span class="tab-name">{{ tab.name }}</span>
      </div>
    </div>

    <div
      v-if="panels.length > 0"
      class="slide-wrapper"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="slide-page">
        <ScadaCanvas
          v-if="currentPanel?.type === 'Dashboard'"
          :key="`dashboard-${currentPanel.id}`"
        />
        <GraphicSingle
          v-else
          :project="currentPanel"
          :key="`graphic-${currentPanel.id}`"
        />
      </div>
    </div>

    <div v-else class="empty-state">
      <span>无面板</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useScadaEditor } from "@/views/ScadaEditor/hooks/useScadaEditor";
import { useScadaPolling } from "@/views/ScadaEditor/hooks/useScadaBinding";
import { projectApi } from "@/api/projects";
import type { Project } from "@/types/project";
import { ArrowLeft } from "@element-plus/icons-vue";
import ScadaCanvas from "@/views/ScadaEditor/components/ScadaCanvas.vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import { listenTo } from "./utils/events";
import { useSwipe } from "./composables/useSwipe";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";

const router = useRouter();
const scada = useScadaEditor();

/** 启动当前面板绑定设备的周期性数据刷新，返回 stop 用于组件卸载时清理 */
const { stop: stopPolling } = useScadaPolling({ interval: 5000 });

const activeTab = ref(0);
const panels = ref<Project[]>([]);
const scale = ref(1);

/** 面板切换版本号，防止竞态条件 */
let tabSwitchVersion = 0;

const tabs = computed(() =>
  panels.value.map((panel) => ({
    key: panel.id,
    name: panel.name || "无面板",
  })),
);

const currentPanel = computed(() => panels.value[activeTab.value] ?? null);

const calcScale = () => {
  scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
};

const fetchPanels = async () => {
  try {
    const res = await projectApi.list();
    panels.value = (res.items ?? []).sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    ElMessage.error("加载面板列表失败");
  }
};

const loadCurrentPanel = async () => {
  const panel = currentPanel.value;
  if (!panel) return;
  await scada.loadPanel(panel.id);
};

const switchTab = (dir: -1 | 1) => {
  const next = activeTab.value + dir;
  if (next >= 0 && next < panels.value.length) {
    activeTab.value = next;
  }
};

const exit = () => router.push({ name: "ScadaList" });

const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
  50,
  () => switchTab(1),
  () => switchTab(-1),
);

useKeyboardShortcuts({
  Escape: exit,
  ArrowLeft: () => switchTab(-1),
  ArrowRight: () => switchTab(1),
});

let resizeCleanup: (() => void) | undefined;

onMounted(async () => {
  scada.isEditing.value = false;
  scada.isFullscreenPreview.value = true;
  scada.zoom.value = 1;
  document.body.classList.add("vant-fullscreen");

  await fetchPanels();

  if (panels.value.length > 0) {
    activeTab.value = 0;
    await loadCurrentPanel();
  }

  calcScale();
  let resizeTimer: ReturnType<typeof setTimeout>;
  resizeCleanup = listenTo(window, "resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calcScale, 100);
  });
});

onUnmounted(() => {
  scada.isEditing.value = true;
  scada.isFullscreenPreview.value = false;
  document.body.classList.remove("vant-fullscreen");

  resizeCleanup?.();
  stopPolling();
});

watch(activeTab, async () => {
  const version = ++tabSwitchVersion;
  await loadCurrentPanel();
  // 竞态防护：仅当请求版本号仍为最新时才应用结果
  if (version === tabSwitchVersion) {
    nextTick(calcScale);
  }
});
</script>

<style scoped>
.vant-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000;
}

.exit-button {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 10001;
}

.floating-tab-bar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 4px;
  background: #1a1a2e;
  border-radius: 24px;
  z-index: 10000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  max-width: calc(100% - 80px);
  overflow-x: auto;
}

.floating-tab-bar::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  flex-shrink: 0;
}

.tab-item.active {
  background: linear-gradient(135deg, #409eff, #36cfc9);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
}

.tab-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-item.active .tab-name {
  color: #fff;
}

.slide-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}

.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

@media (max-width: 768px) {
  .floating-tab-bar {
    width: calc(100% - 24px);
    height: 44px;
  }
  .tab-item {
    padding: 6px 16px;
    font-size: 13px;
  }
}
</style>

<style>
body.vant-fullscreen,
body.vant-fullscreen #app,
body.vant-fullscreen .app-layout,
body.vant-fullscreen .app-main,
body.vant-fullscreen .fullscreen-main {
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
</style>
