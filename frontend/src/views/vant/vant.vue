<template>
  <div class="vant-container">
    <div class="floating-back" @click="exit">
      <el-icon :size="20"><ArrowLeft /></el-icon>
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

    <div v-if="isInitializing" class="loading-state">
      <el-icon class="loading-spin" :size="28"><Loading /></el-icon>
      <span>{{ t('common.loading') }}</span>
    </div>

    <div
      v-else-if="panels.length > 0"
      class="slide-wrapper"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend.passive="handleTouchEnd"
      @touchcancel.passive="handleTouchCancel"
    >
      <div
        ref="adaptContainerRef"
        class="slide-page"
        :style="currentPanel?.type === 'Dashboard' ? adaptContainerStyle : undefined"
      >
        <template v-if="isPanelRendered">
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
        </template>
      </div>
    </div>

    <div v-else class="empty-state">
      <span>{{ t('vant.noPanel') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, provide, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useScadaEditor } from "@/views/ScadaEditor/hooks/useScadaEditor";
import { useScadaAdapt } from "@/views/ScadaEditor/hooks/useScadaAdapt";
import { useScadaPolling } from "@/views/ScadaEditor/hooks/useScadaBinding";
import { useScadaPointReader, ScadaPointReaderKey } from "@/utils/scadaPointReader";
import { projectApi } from "@/api/projects";
import type { Project } from "@/types/project";
import { useSystemStore } from "@/stores/system";
import { ArrowLeft, Loading } from "@element-plus/icons-vue";
import ScadaCanvas from "@/views/ScadaEditor/components/ScadaCanvas.vue";
import GraphicSingle from "@/views/GraphicPreview/GraphicSingle.vue";
import { useSwipe } from "./composables/useSwipe";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";

const router = useRouter();
const { t } = useI18n();
const scada = useScadaEditor();
const systemStore = useSystemStore();

/** ScadaPointReader：provide 给子组件（折线图/柱状图等）统一使用，历史缓存按 asset 隔离 */
const pointReader = useScadaPointReader();
provide(ScadaPointReaderKey, pointReader);

/** 启动当前面板绑定设备的周期性数据刷新，返回 stop 用于组件卸载时清理 */
const { stop: stopPolling, pause: pausePolling, resume: resumePolling } = useScadaPolling({
  interval: systemStore.visualizationConfig.pollingInterval,
  reader: pointReader,
});

const activeTab = ref(0);
const panels = ref<Project[]>([]);
const isInitializing = ref(true);

/** 面板缓存：panelId → Project（含 data 字段），进入页面时一次 list 全部存入，离开时随组件回收 */
const panelCache = new Map<string, Project>();

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
    name: panel.name || t('vant.noPanel'),
  })),
);

const currentPanel = computed(() => panels.value[activeTab.value] ?? null);

/** 已渲染（挂载）的面板 ID：切换时先卸载旧面板内容，下一帧再挂载新面板 */
const renderedPanelId = ref<string | null>(null);

/** 面板内容渲染条件：目标面板已加载完成才挂载，切换期间保持卸载态 */
const isPanelRendered = computed(
  () => currentPanel.value !== null && currentPanel.value.id === renderedPanelId.value,
);

/** 等待下一帧：把"卸载旧面板"与"挂载新面板"拆到不同帧，避免单帧长任务造成滑动卡顿 */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const fetchPanels = async () => {
  try {
    const res = await projectApi.list();
    const sorted = (res.items ?? []).sort((a, b) => a.createdAt - b.createdAt);
    panels.value = sorted;

    // 把 list 返回的所有项目存入缓存，后续 loadCurrentPanel 直接从缓存取
    panelCache.clear();
    for (const p of sorted) {
      panelCache.set(p.id, p);
    }
  } catch {
    ElMessage.error(t('vant.loadPanelsFailed'));
  }
};

/** 待加载的最新面板 id：加载进行中时仅记录目标，加载完成后接着加载最新值 */
let pendingPanelId: string | null = null;
/** 加载锁：串行化面板加载，防止快速滑动时并发请求乱序覆盖 */
let isLoadingPanel = false;
/** 卸载标记：组件销毁后中止挂起中的异步加载，避免离开页面后污染 scada 全局状态 */
let isUnmounted = false;

const loadCurrentPanel = async () => {
  const panel = currentPanel.value;
  if (!panel) return;
  pendingPanelId = panel.id;
  if (isLoadingPanel) return;

  isLoadingPanel = true;
  // 切换期间暂停轮询：挂载过程中数据回包触发的整页重渲染会加剧掉帧
  pausePolling();
  try {
    // 串行加载并合并连续切换：保证最后一次加载最终生效
    while (pendingPanelId !== null && !isUnmounted) {
      const id = pendingPanelId;
      pendingPanelId = null;
      if (renderedPanelId.value !== id) {
        // 第一帧：卸载旧面板内容（快）
        renderedPanelId.value = null;
        await nextFrame();
        // 卸载竞态防护：滑动后立即退出页面时，中止后续挂载与 store 写入
        if (isUnmounted) break;
        const cached = panelCache.get(id);
        // 缓存未命中（面板被并发删除）：跳过本次加载，避免空引用崩溃白屏
        if (!cached) continue;
        // 下一帧：list 接口保证返回完整 data，直接从缓存加载，零网络延迟
        scada.loadPanelFromProject(cached);
        renderedPanelId.value = id;
        // 等待 Vue 完成 DOM 更新，确保面板完全挂载后再恢复轮询
        await nextTick();
      }
    }
  } finally {
    isLoadingPanel = false;
    resumePolling();
  }
};

const switchTab = (dir: -1 | 1) => {
  const next = activeTab.value + dir;
  if (next >= 0 && next < panels.value.length) {
    activeTab.value = next;
  }
};

const exit = () => router.push({ name: "ScadaList" });

// ============== 滑动手势检测 ==============
const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } = useSwipe(
  50,
  () => switchTab(1),
  () => switchTab(-1),
);

// ============== 触摸事件入口 ==============
/** 手势开始：暂停轮询，避免数据回包触发的重渲染与手势检测争抢主线程 */
const handleTouchStart = (e: TouchEvent) => {
  pausePolling();
  onTouchStart(e);
};

/** 手势移动：更新手势检测状态 */
const handleTouchMove = (e: TouchEvent) => {
  onTouchMove(e);
};

/** 手势结束：由 useSwipe 判定是否切换；未切换时恢复轮询，切换时由 loadCurrentPanel 完成后恢复 */
const handleTouchEnd = (e: TouchEvent) => {
  const prevTab = activeTab.value;
  onTouchEnd(e);
  if (activeTab.value === prevTab) {
    resumePolling();
  }
};

/** 手势被系统接管（如滚动打断）时不判定滑动，恢复轮询 */
const handleTouchCancel = () => {
  onTouchCancel();
  resumePolling();
};

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

  try {
    await fetchPanels();
  } finally {
    isInitializing.value = false;
  }

  if (panels.value.length > 0) {
    activeTab.value = 0;
    await loadCurrentPanel();
  }
});

onUnmounted(() => {
  isUnmounted = true;
  scada.isEditing.value = true;
  scada.isFullscreenPreview.value = false;
  document.body.classList.remove("vant-fullscreen");

  stopPolling();
  pointReader.clearDevices(); // 离开 vant 页面时清空读值中枢全部缓存（实时值/历史/骨架/去重表）
  panelCache.clear(); // 离开 vant 页面时清空面板缓存，释放内存
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

.floating-back {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
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

.floating-tab-bar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
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
  /* 只过渡实际变化的属性，避免 all 触发不必要的合成开销 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
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
  touch-action: pan-y;
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

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.loading-spin {
  animation: vant-loading-spin 1s linear infinite;
}

@keyframes vant-loading-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
