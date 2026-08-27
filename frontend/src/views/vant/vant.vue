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
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div
        ref="adaptContainerRef"
        class="slide-page"
        :style="currentPanel?.type === 'Dashboard' ? adaptContainerStyle : undefined"
      >
        <div
          v-if="currentPanel?.type === 'Dashboard'"
          class="adapt-canvas-frame"
          :style="adaptFrameStyle"
        >
          <div class="adapt-canvas-scale" :style="adaptScaleStyle">
            <ScadaCanvas :key="`dashboard-${currentPanel.id}`" />
          </div>
        </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useScadaEditor } from "@/views/ScadaEditor/hooks/useScadaEditor";
import { useScadaAdapt } from "@/views/ScadaEditor/hooks/useScadaAdapt";
import { useScadaPolling } from "@/views/ScadaEditor/hooks/useScadaBinding";
import { projectApi } from "@/api/projects";
import type { Project } from "@/types/project";
import { ArrowLeft } from "@element-plus/icons-vue";
import ScadaCanvas from "@/views/ScadaEditor/components/ScadaCanvas.vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import { useSwipe } from "./composables/useSwipe";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";

const router = useRouter();
const scada = useScadaEditor();

/** 启动当前面板绑定设备的周期性数据刷新，返回 stop 用于组件卸载时清理 */
const { stop: stopPolling } = useScadaPolling({ interval: 5000 });

const activeTab = ref(0);
const panels = ref<Project[]>([]);

/** 预览适配容器：按面板适配模式计算容器、布局框、缩放层样式 */
const adaptContainerRef = ref<HTMLElement | null>(null);
const {
  containerStyle: adaptContainerStyle,
  frameStyle: adaptFrameStyle,
  scaleStyle: adaptScaleStyle,
} = useScadaAdapt(adaptContainerRef);

const tabs = computed(() =>
  panels.value.map((panel) => ({
    key: panel.id,
    name: panel.name || "无面板",
  })),
);

const currentPanel = computed(() => panels.value[activeTab.value] ?? null);

const fetchPanels = async () => {
  try {
    const res = await projectApi.list();
    panels.value = (res.items ?? []).sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    ElMessage.error("加载面板列表失败");
  }
};

/** 待加载的最新面板 id：加载进行中时仅记录目标，加载完成后接着加载最新值 */
let pendingPanelId: string | null = null;
/** 加载锁：串行化面板加载，防止快速滑动时并发请求乱序覆盖 */
let isLoadingPanel = false;

const loadCurrentPanel = async () => {
  const panel = currentPanel.value;
  if (!panel) return;
  pendingPanelId = panel.id;
  if (isLoadingPanel) return;

  isLoadingPanel = true;
  try {
    // 串行加载并合并连续切换：保证最后一次加载最终生效
    while (pendingPanelId !== null) {
      const id = pendingPanelId;
      pendingPanelId = null;
      if (scada.currentPanelId.value !== id) {
        await scada.loadPanel(id);
      }
    }
  } finally {
    isLoadingPanel = false;
  }
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
});

onUnmounted(() => {
  scada.isEditing.value = true;
  scada.isFullscreenPreview.value = false;
  document.body.classList.remove("vant-fullscreen");

  stopPolling();
});

watch(activeTab, async () => {
  // 适配缩放由 useScadaAdapt 响应面板变化自动重算
  await loadCurrentPanel();
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

/* 适配画布布局框：禁止 flex 收缩，保证滚动模式下的布局尺寸正确 */
.adapt-canvas-frame {
  flex-shrink: 0;
}

.adapt-canvas-scale {
  transform-origin: top left;
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
