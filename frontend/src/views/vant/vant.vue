<template>
  <div class="vant-container">
    <!-- 退出按钮 -->
    <div class="exit-button">
      <el-button :icon="ArrowLeft" circle size="small" @click="exit" />
    </div>

    <!-- 悬浮Tab栏 -->
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

    <!-- 内容区域 -->
    <div
      class="slides-container"
      :style="{ transform: `translateX(-${activeTab * 50}%)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- Dashboard：原始尺寸居中，四周黑色 -->
      <div class="slide-page dashboard-page">
        <ScadaCanvas />
      </div>

      <!-- Graphic：等比缩放全屏 -->
      <div class="slide-page graphic-page">
        <GraphicSingle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useScadaStore } from "@/stores/scada";
import { ArrowLeft } from "@element-plus/icons-vue";
import ScadaCanvas from "@/components/ScadaCanvas.vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import { listenTo } from "./utils/events";
import { useSwipe } from "./composables/useSwipe";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";

const router = useRouter();
const scadaStore = useScadaStore();

// --- 状态管理 ---
const activeTab = ref(0);
const scale = ref(1);
const dashboardIndex = ref(0);
const graphicIndex = ref(0);

// --- 计算属性 ---
const dashboardPanels = computed(() =>
  scadaStore.panels.filter((p) => p.type === "Dashboard"),
);
const graphicPanels = computed(() =>
  scadaStore.panels.filter((p) => p.type === "Graphic"),
);
const currentPanelIndex = computed(() =>
  activeTab.value === 0 ? dashboardIndex.value : graphicIndex.value,
);
const currentPanels = computed(() =>
  activeTab.value === 0 ? dashboardPanels.value : graphicPanels.value,
);

const tabs = computed(() => [
  {
    key: "dashboard",
    name: dashboardPanels.value[dashboardIndex.value]?.name || "无面板",
  },
  {
    key: "graphic",
    name: graphicPanels.value[graphicIndex.value]?.name || "无面板",
  },
]);

// --- 工具函数 ---
/** 计算缩放比例 */
const calcScale = () => {
  scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
};

/** 面板导航 */
const navigate = (dir: -1 | 1) => {
  const panels = currentPanels.value;
  const idx = currentPanelIndex.value + dir;
  if (idx < 0 || idx >= panels.length) return;

  if (activeTab.value === 0) {
    dashboardIndex.value = idx;
  } else {
    graphicIndex.value = idx;
  }
  scadaStore.selectPanel(panels[idx].id);
};

/** 退出预览 */
const exit = () => router.push({ name: "ScadaList" });

/** 切换 Tab */
const switchTab = (dir: -1 | 1) => {
  const next = activeTab.value + dir;
  if (next >= 0 && next < tabs.value.length) {
    activeTab.value = next;
  }
};

// --- 组合式函数 ---
// 滑动手势
const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
  50,
  () => switchTab(1),
  () => switchTab(-1),
);

// 键盘快捷键
useKeyboardShortcuts({
  Escape: exit,
  ArrowLeft: () => navigate(-1),
  ArrowRight: () => navigate(1),
});

// --- 生命周期 ---
let resizeCleanup: (() => void) | undefined;

onMounted(() => {
  // 初始化 Store 状态
  scadaStore.isEditing = false;
  scadaStore.isFullscreenPreview = true;
  scadaStore.zoom = 1;
  document.body.classList.add("vant-fullscreen");

  // 选中第一个 Dashboard 面板
  if (dashboardPanels.value.length > 0) {
    scadaStore.selectPanel(dashboardPanels.value[0].id);
  }

  // 初始化缩放并监听窗口变化
  calcScale();
  let resizeTimer: ReturnType<typeof setTimeout>;
  resizeCleanup = listenTo(window, "resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calcScale, 100);
  });
});

onUnmounted(() => {
  // 恢复 Store 状态
  scadaStore.isEditing = true;
  scadaStore.isFullscreenPreview = false;
  document.body.classList.remove("vant-fullscreen");

  // 清理事件监听
  resizeCleanup?.();
});

// Tab 切换或面板索引变化时重新计算缩放
watch([activeTab, graphicIndex], () => nextTick(calcScale));
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
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
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

.slides-container {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  display: flex;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-page {
  width: 50%;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  background: #000;
}

.dashboard-page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.graphic-page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.graphic-scaler {
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
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
