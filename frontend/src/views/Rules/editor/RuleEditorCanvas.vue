<template>
  <div class="rule-editor-canvas">
    <!-- 顶部工具栏：规则名称/描述输入 + 节点统计 + 清除/保存按钮 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <div class="toolbar-glow" aria-hidden="true"></div>
        <el-input
          v-model="ruleName"
          :placeholder="t('ruleEditor.ruleName')"
          class="rule-input"
          style="width: 200px"
        />
        <el-input
          v-model="ruleDescription"
          :placeholder="t('ruleEditor.ruleDescription')"
          class="rule-input"
          style="width: 300px"
        />
      </div>
      <div class="toolbar-right">
        <div class="node-count">
          <span class="count-item">
            <span class="count-value">{{ nodes.length }}</span>
            <span class="count-label">{{ t('ruleEditor.nodeCount') }}</span>
          </span>
          <span class="count-divider"></span>
          <span class="count-item">
            <span class="count-value">{{ edges.length }}</span>
            <span class="count-label">{{ t('ruleEditor.edgeCount') }}</span>
          </span>
        </div>
        <el-button class="clear-btn" @click="handleClear" :disabled="loading || saving">{{ t('ruleEditor.clear') }}</el-button>
        <el-button class="save-btn" type="primary" :disabled="saving" :loading="saving" @click="handleSave">
          {{ saving ? t('ruleEditor.saving') : t('ruleEditor.save') }}
        </el-button>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <div v-if="loading" class="editor-loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>{{ t('ruleEditor.loadingRule') }}</span>
    </div>

    <!-- 编辑器主体：左侧节点面板 + 中间画布 + 右侧配置面板 -->
    <div v-else class="editor-main">
      <NodePalette @drag-start="onDragStart" />

      <div ref="canvasContainerRef" class="editor-canvas" @drop="onDrop" @dragover="onDragOver" @click="onCanvasClick">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-edge-options="{ type: 'smoothstep', animated: true }"
          :initial-viewport="{ x: 0, y: 0, zoom: 1 }"
          :snap-to-grid="true"
          :snap-grid="[15, 15]"
          class="vue-flow-container"
          @nodes-change="onNodesChange"
          @edges-change="onEdgesChange"
          @connect="onConnect"
          @node-click="onNodeClick"
          @node-context-menu="onNodeContextMenu"
          @edge-context-menu="onEdgeContextMenu"
        >
          <Background :pattern-color="isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'" :gap="25" />
          <Controls />
          <MiniMap />
        </VueFlow>

        <!-- 右键菜单 -->
        <Teleport to="body">
          <div
            v-if="contextMenuVisible"
            class="context-menu"
            :style="{ left: contextMenuPos.x + 'px', top: contextMenuPos.y + 'px' }"
            @click.stop
          >
            <template v-if="contextMenuType === 'node'">
              <div class="context-menu-item" @click="handleContextDeleteNode">
                <Icon type="mono-line" name="delete" :size="20" :color="{ normal: 'var(--el-text-color-primary)' }"/>
                <span>{{ t('ruleEditor.deleteNode') }}</span>
              </div>
            </template>
            <template v-else-if="contextMenuType === 'edge'">
              <div class="context-menu-item" @click="handleContextDeleteEdge">
                <Icon type="mono-line" name="delete" :size="20" :color="{ normal: 'var(--el-text-color-primary)' }"/>
                <span>{{ t('ruleEditor.deleteEdge') }}</span>
              </div>
            </template>
          </div>
        </Teleport>
      </div>

      <!-- 选中节点时显示配置面板 -->
      <div v-if="selectedNode" class="config-panel">
        <div class="config-panel-header">
          <div class="panel-header-left">
            <span class="panel-title">{{ t('ruleEditor.nodeConfig') }}</span>
            <div class="panel-accent-bar"></div>
          </div>
          <el-button type="danger" link size="small" @click="handleResetNodeData">
            {{ t('ruleEditor.resetData') }}
          </el-button>
        </div>
        <NodeConfigPanel
          :key="selectedNode.id"
          :node-id="selectedNode.id"
          :node-type="selectedNode.type as NodeType"
          :node-data="selectedNode.data ?? {}"
          @update="handleNodeUpdate"
        />
      </div>

      <!-- 未选中节点时显示提示 -->
      <div v-else class="empty-panel">
        <div class="empty-content">
          <span class="empty-icon">📝</span>
          <p>{{ t('ruleEditor.selectNodeHint') }}</p>
          <p class="hint">{{ t('ruleEditor.dragHint') }}</p>
        </div>
      </div>
    </div>

    <!-- 校验失败弹框 -->
    <Teleport to="body">
      <Transition name="validation-fade">
        <div v-if="validationDialog.visible" class="validation-overlay" @click.self="validationDialog.visible = false">
          <div class="validation-dialog">
            <div class="vd-glow" aria-hidden="true"></div>
            <div class="vd-header">
              <div class="vd-icon-wrap">
                <span class="vd-icon">⚠️</span>
              </div>
              <div class="vd-title">{{ t('ruleEditor.validationTitle') }}</div>
            </div>
            <div class="vd-body">
              <p class="vd-hint">{{ t('ruleEditor.validationHint') }}</p>
              <ul class="vd-list">
                <li v-for="(msg, idx) in validationDialog.messages" :key="idx" class="vd-item">
                  <span class="vd-item-dot"></span>
                  <span class="vd-item-text">{{ msg }}</span>
                </li>
              </ul>
            </div>
            <div class="vd-footer">
              <el-button class="vd-confirm-btn" @click="validationDialog.visible = false">
                {{ t('common.confirm') }}
              </el-button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, markRaw, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueFlow, useVueFlow, type Connection, type NodeChange, type EdgeChange } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

import NodePalette from './NodePalette.vue'
import NodeConfigPanel from './NodeConfigPanel.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import ScheduleTriggerNode from './nodes/ScheduleTriggerNode.vue'
import ConditionNode from './nodes/ConditionNode.vue'
import LogicNode from './nodes/LogicNode.vue'
import ActionNode from './nodes/ActionNode.vue'
import NotificationNode from './nodes/NotificationNode.vue'

import type { RuleNode, RuleEdge, RuleNodeData, NodeType } from '@/types/rule'
import { NODE_TEMPLATES } from '@/types/rule'
import { createNode, validateGraph } from '@/utils/ruleConverter'
import { graphToBackendCreate, graphToBackendUpdate, backendToGraph } from '@/utils/ruleBridge'
import { useRuleStore } from '@/stores/rules'
import { useThemeStore } from '@/stores/theme'
import { Icon } from '@/icon'

const { t } = useI18n()

const props = defineProps<{
  /** 规则 ID，传入时表示编辑已有规则 */
  ruleId?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', ruleId?: string): void
}>()

const ruleStore = useRuleStore()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

/** VueFlow 核心 hooks */
const {
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  updateNodeData,
  findNode,
  project,
  fitView,
  onInit: onVueFlowInit,
} = useVueFlow()

// ==================== 响应式状态 ====================
const nodes = ref<RuleNode[]>([])
const edges = ref<RuleEdge[]>([])
const selectedNodeId = ref<string | null>(null)
const ruleName = ref(t('ruleEditor.defaultRuleName'))
const ruleDescription = ref('')
const saving = ref(false)
const loading = ref(false)

/** 画布容器 DOM 引用（用于拖放坐标计算） */
const canvasContainerRef = ref<HTMLElement | null>(null)

/** 画布视口是否已初始化（VueFlow viewport ready） */
const viewportReady = ref(false)

/** 右键菜单状态 */
const contextMenuVisible = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const contextMenuType = ref<'node' | 'edge'>('node')
const contextMenuTargetId = ref<string>('')

/** 校验失败弹框状态 */
const validationDialog = reactive({
  visible: false,
  messages: [] as string[]
})

/** 关闭右键菜单 */
const closeContextMenu = () => {
  contextMenuVisible.value = false
}

/** 画布点击空白处关闭右键菜单 */
const onCanvasClick = () => {
  closeContextMenu()
}

/** 节点右键菜单 */
const onNodeContextMenu = ({ node, event }: any) => {
  event.preventDefault()
  selectedNodeId.value = node.id
  contextMenuType.value = 'node'
  contextMenuTargetId.value = node.id
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

/** 连线右键菜单 */
const onEdgeContextMenu = ({ edge, event }: any) => {
  event.preventDefault()
  contextMenuType.value = 'edge'
  contextMenuTargetId.value = edge.id
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

/** 删除节点（右键菜单） */
const handleContextDeleteNode = () => {
  const nodeId = contextMenuTargetId.value
  if (nodeId) {
    removeNodes([nodeId])
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
  }
  closeContextMenu()
}

/** 删除连线（右键菜单） */
const handleContextDeleteEdge = () => {
  const edgeId = contextMenuTargetId.value
  if (edgeId) {
    removeEdges([edgeId])
  }
  closeContextMenu()
}

/** 重置节点数据为默认值 */
const handleResetNodeData = () => {
  if (!selectedNodeId.value) return
  const node = findNode(selectedNodeId.value)
  if (!node) return
  const template = NODE_TEMPLATES.find(t => t.type === node.type)
  if (template) {
    updateNodeData(selectedNodeId.value, JSON.parse(JSON.stringify(template.defaultData)))
  }
}

/** 竞态控制：当前正在加载的规则 ID */
let loadingRuleId: string | null = null

// ==================== 节点类型注册 ====================
const nodeTypes: Record<string, any> = {
  trigger: markRaw(TriggerNode),
  'schedule-trigger': markRaw(ScheduleTriggerNode),
  condition: markRaw(ConditionNode),
  logic: markRaw(LogicNode),
  action: markRaw(ActionNode),
  notification: markRaw(NotificationNode)
}

/** 当前选中的节点信息（供配置面板使用） */
const selectedNode = computed<RuleNode | null>(() => {
  if (!selectedNodeId.value) return null
  const node = findNode(selectedNodeId.value)
  if (!node) return null
  return {
    id: node.id,
    type: node.type as NodeType,
    data: (node.data ?? {}) as RuleNodeData,
    position: node.position,
  }
})

// ==================== 拖拽事件处理 ====================

/** VueFlow 视口初始化完成回调 */
onVueFlowInit(() => {
  viewportReady.value = true
  if (nodes.value.length > 0) {
    fitView()
  }
})

/** 拖拽悬停时阻止默认行为并设置放置效果 */
const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

/**
 * 节点从面板拖入画布时创建新节点
 * 使用 currentTarget（画布容器）计算坐标，避免 target 为子元素时的偏移
 */
const onDrop = (event: DragEvent) => {
  if (!viewportReady.value) return

  const type = event.dataTransfer?.getData('application/vueflow') as NodeType
  if (!type) return

  const container = canvasContainerRef.value
  if (!container) return

  const { left, top } = container.getBoundingClientRect()
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top
  })

  const newNode = createNode(type, position)
  addNodes([newNode])
}

/** 开始拖拽时在 dataTransfer 中写入节点类型 */
const onDragStart = (type: NodeType, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }
}

// ==================== VueFlow 事件监听（仅处理 v-model 无法覆盖的副作用） ====================

/** 连线创建时默认设置为平滑动画连线 */
const onConnect = (params: Connection) => {
  addEdges([{
    ...params,
    type: 'smoothstep',
    animated: true
  }])
}

/**
 * 节点变更回调
 * v-model:nodes 已自动同步增删改，此处仅处理选中状态清除等副作用
 */
const onNodesChange = (changes: NodeChange[]) => {
  for (const change of changes) {
    if (change.type === 'remove' && selectedNodeId.value === change.id) {
      selectedNodeId.value = null
    }
  }
}

/**
 * 边变更回调
 * v-model:edges 已自动同步，此处仅做额外处理（如有需要）
 */
const onEdgesChange = (_changes: EdgeChange[]) => {
  // v-model:edges 已自动处理边的增删改
}

/** 节点点击时设置选中状态 */
const onNodeClick = ({ node }: { node: { id: string } }) => {
  selectedNodeId.value = node.id
}

// ==================== 节点操作 ====================

/**
 * 配置面板更新时同步节点数据
 * 使用 updateNodeData 同时更新 VueFlow 内部状态和 v-model 绑定的 nodes ref
 */
const handleNodeUpdate = (data: RuleNodeData) => {
  if (!selectedNodeId.value) return
  updateNodeData(selectedNodeId.value, data)
}

/** 节点操作 */

// ==================== 保存 & 清除 ====================

/** 保存当前规则（新增或更新） */
const handleSave = async () => {
  // 收集最新节点数据（从 VueFlow 内部 store 同步获取最新 data）
  const currentNodes: RuleNode[] = nodes.value.map(n => {
    const vfNode = findNode(n.id)
    if (!vfNode) return n
    return {
      id: n.id,
      type: n.type,
      position: n.position,
      data: vfNode.data as RuleNodeData,
    }
  })

  // 表单校验
  const result = validateGraph(currentNodes, edges.value, { ruleName: ruleName.value })
  if (!result.valid) {
    validationDialog.messages = result.errors.map(err => t(err.key, err.params ?? {}))
    validationDialog.visible = true
    return
  }

  saving.value = true
  try {
    if (props.ruleId) {
      // 更新已有规则
      const currentRule = ruleStore.rules.find(r => r.id === props.ruleId)
      const updateData = graphToBackendUpdate(
        ruleName.value,
        ruleDescription.value,
        currentNodes,
        edges.value,
        currentRule?.enabled ?? true
      )
      await ruleStore.updateRule(props.ruleId, updateData)
      ElMessage.success(t('ruleEditor.ruleSaved'))
      emit('saved', props.ruleId)
    } else {
      // 创建新规则
      const createData = graphToBackendCreate(
        ruleName.value,
        ruleDescription.value,
        currentNodes,
        edges.value
      )
      const response = await ruleStore.createRule(createData)
      ElMessage.success(t('ruleEditor.ruleCreated'))
      emit('saved', response.rule_id)
    }
  } catch (e: any) {
    const detail = e.response?.data?.detail
    const msg = detail
      ? (Array.isArray(detail) ? detail.map((d: any) => d.msg || d).join('; ') : String(detail))
      : t('ruleEditor.saveFailed')
    ElMessage.error(msg)
  } finally {
    saving.value = false
  }
}

/** 清空画布上的所有节点、连线、名称和描述 */
const handleClear = () => {
  nodes.value = []
  edges.value = []
  selectedNodeId.value = null
  ruleName.value = t('ruleEditor.defaultRuleName')
  ruleDescription.value = ''
}

// ==================== 数据加载 ====================

/** 根据规则 ID 加载规则数据（含竞态控制） */
const loadRule = async (ruleId: string) => {
  // 竞态控制：记录当前加载的 ID，回调中比对
  const requestId = ruleId
  loadingRuleId = requestId

  loading.value = true
  try {
    const ruleResponse = await ruleStore.getRule(ruleId)

    // 竞态检查：如果请求期间 ruleId 已变更，丢弃本次结果
    if (loadingRuleId !== requestId) return

    if (!ruleResponse) {
      ElMessage.error(t('ruleEditor.ruleNotFound'))
      return
    }

    const graphData = backendToGraph(ruleResponse)
    if (graphData) {
      nodes.value = graphData.nodes
      edges.value = graphData.edges
      ruleName.value = graphData.name
      ruleDescription.value = graphData.description
      if (viewportReady.value) {
        nextTick(() => fitView())
      }
    } else {
      ElMessage.warning(t('ruleEditor.parseFailed'))
    }
  } catch (e: any) {
    // 竞态检查
    if (loadingRuleId !== requestId) return
    ElMessage.error(t('ruleEditor.loadFailed') + '：' + (e.message || t('common.unknownError')))
  } finally {
    if (loadingRuleId === requestId) {
      loading.value = false
    }
  }
}

// ==================== 生命周期 ====================

/** 组件挂载时根据 ruleId 初始化 */
onMounted(() => {
  if (props.ruleId) {
    loadRule(props.ruleId)
  }
  document.addEventListener('click', onDocumentClick)
})

/** 全局点击关闭右键菜单 */
const onDocumentClick = (e: MouseEvent) => {
  if (contextMenuVisible.value) {
    closeContextMenu()
  }
}

/** ruleId 变化时重新加载或重置 */
watch(() => props.ruleId, (newId) => {
  if (newId) {
    loadRule(newId)
  } else {
    nodes.value = []
    edges.value = []
    ruleName.value = t('ruleEditor.defaultRuleName')
    ruleDescription.value = ''
    selectedNodeId.value = null
  }
})

/** 组件卸载时清理竞态标记和事件监听 */
onBeforeUnmount(() => {
  loadingRuleId = null
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.rule-editor-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--re-canvas-bg);
  position: relative;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--re-toolbar-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-bottom: 1px solid var(--re-panel-border);
  position: relative;
  overflow: hidden;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  position: relative;
}

.toolbar-glow {
  position: absolute;
  top: -20px;
  left: -10px;
  width: 120px;
  height: 60px;
  background: radial-gradient(circle, var(--re-accent) 0%, transparent 70%);
  opacity: 0.18;
  filter: blur(24px);
  pointer-events: none;
}

.rule-input :deep(.el-input__wrapper) {
  background: var(--re-input-bg) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 0 1px var(--re-panel-border) inset !important;
  transition: box-shadow 0.2s !important;
}

.rule-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--re-accent) inset !important;
}

.rule-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--re-accent) inset, 0 0 0 3px color-mix(in srgb, var(--re-accent) 18%, transparent) !important;
}

.rule-input :deep(.el-input__inner) {
  color: var(--text-primary) !important;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.node-count {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 10px;
}

.count-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-value {
  font-size: 16px;
  font-weight: 700;
  background: var(--re-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

.count-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-divider {
  width: 1px;
  height: 16px;
  background: var(--re-panel-border);
}

.clear-btn {
  background-color: transparent !important;
  border: 1px solid var(--re-panel-border) !important;
  color: var(--text-primary) !important;
  border-radius: 10px !important;
  transition: all 0.25s !important;
}

.clear-btn:hover {
  background-color: var(--re-chip-bg) !important;
  border-color: var(--re-accent) !important;
  color: var(--re-accent) !important;
  box-shadow: 0 0 12px color-mix(in srgb, var(--re-accent) 25%, transparent) !important;
}

.save-btn {
  border-radius: 10px !important;
  background: linear-gradient(135deg, var(--re-accent), var(--re-accent-2)) !important;
  border: none !important;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--re-accent) 40%, transparent) !important;
  transition: all 0.25s !important;
}

.save-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--re-accent) 50%, transparent) !important;
}

.editor-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-canvas {
  flex: 1;
  position: relative;
  background: var(--re-canvas-bg);
}

.vue-flow-container {
  width: 100%;
  height: 100%;
}

.config-panel {
  width: 340px;
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-left: 1px solid var(--re-panel-border);
  display: flex;
  flex-direction: column;
}

.config-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--re-toolbar-bg);
  border-bottom: 1px solid var(--re-panel-border);
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  background: var(--re-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.panel-accent-bar {
  width: 3px;
  height: 16px;
  background: linear-gradient(180deg, var(--re-accent), var(--re-accent-2));
  border-radius: 2px;
}

.empty-panel {
  width: 340px;
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border-left: 1px solid var(--re-panel-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  padding: 24px 20px;
}

.empty-icon {
  font-size: 56px;
  display: block;
  margin-bottom: 14px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
}

.empty-content p {
  margin: 4px 0;
  color: var(--text-primary);
  font-weight: 500;
}

.empty-content .hint {
  font-size: 12px;
  color: var(--text-secondary);
}

.editor-canvas :deep(.vue-flow__background) {
  background: transparent !important;
}

.editor-canvas :deep(.vue-flow__controls) {
  background: var(--re-panel-bg) !important;
  backdrop-filter: var(--re-panel-blur);
  border: 1px solid var(--re-panel-border) !important;
  border-radius: 12px !important;
  box-shadow: var(--re-shadow-soft) !important;
  padding: 4px !important;
}

.editor-canvas :deep(.vue-flow__controls-button) {
  background: transparent !important;
  border: none !important;
  border-radius: 8px !important;
  color: var(--text-primary) !important;
  width: 28px !important;
  height: 28px !important;
  transition: all 0.2s !important;
}

.editor-canvas :deep(.vue-flow__controls-button:hover) {
  background: var(--re-chip-bg) !important;
  color: var(--re-accent) !important;
}

.editor-canvas :deep(.vue-flow__controls-button svg) {
  fill: currentColor !important;
}

.editor-canvas :deep(.vue-flow__minimap) {
  background: var(--re-panel-bg) !important;
  backdrop-filter: var(--re-panel-blur);
  border: 1px solid var(--re-panel-border) !important;
  border-radius: 10px !important;
  box-shadow: var(--re-shadow-soft) !important;
  overflow: hidden !important;
}

.editor-canvas :deep(.vue-flow__edge-path) {
  stroke: var(--re-edge-color) !important;
  stroke-width: 2.5 !important;
  filter: drop-shadow(0 0 6px var(--re-edge-glow));
}

.editor-canvas :deep(.vue-flow__edge.animated .vue-flow__edge-path) {
  stroke-dasharray: 6 3 !important;
}

.editor-canvas :deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--re-accent) !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--re-accent) 60%, transparent));
}

.editor-canvas :deep(.vue-flow__attribution) {
  display: none !important;
}
</style>

<style>
.context-menu {
  position: fixed;
  z-index: 9999;
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border: 1px solid var(--re-panel-border);
  border-radius: 12px;
  box-shadow: var(--re-shadow-glow);
  padding: 6px;
  min-width: 160px;
  user-select: none;
  overflow: hidden;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  border-radius: 8px;
}

.context-menu-item:hover {
  background: var(--re-chip-bg);
  color: var(--re-accent);
}

/* ===== 校验失败弹框 ===== */
.validation-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.validation-dialog {
  position: relative;
  width: 420px;
  max-width: 92vw;
  background: var(--re-panel-bg);
  backdrop-filter: var(--re-panel-blur);
  -webkit-backdrop-filter: var(--re-panel-blur);
  border: 1px solid var(--re-panel-border);
  border-radius: 18px;
  box-shadow:
    0 0 40px color-mix(in srgb, var(--re-accent) 20%, transparent),
    0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: vd-pop-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.vd-glow {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 200px;
  height: 160px;
  background: radial-gradient(circle, rgba(231, 76, 60, 0.4) 0%, transparent 70%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 0;
}

.vd-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
}

.vd-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.2));
  border: 1.5px solid rgba(231, 76, 60, 0.5);
  border-radius: 14px;
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.3);
  animation: vd-icon-pulse 2s ease-in-out infinite;
}

.vd-icon {
  font-size: 26px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-2px);
}

.vd-title {
  font-size: 18px;
  font-weight: 700;
  background: var(--re-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.3px;
}

.vd-body {
  position: relative;
  z-index: 1;
  padding: 8px 24px 16px;
}

.vd-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.vd-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vd-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  background: var(--re-chip-bg);
  border: 1px solid var(--re-chip-border);
  border-radius: 12px;
  transition: all 0.2s;
}

.vd-item:hover {
  background: color-mix(in srgb, var(--re-accent) 12%, transparent);
  border-color: var(--re-accent);
  transform: translateX(4px);
}

.vd-item-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
}

.vd-item-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.vd-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  padding: 14px 24px 20px;
  border-top: 1px solid var(--re-panel-border);
}

.vd-confirm-btn {
  border-radius: 10px !important;
  background: linear-gradient(135deg, var(--re-accent), var(--re-accent-2)) !important;
  border: none !important;
  color: #fff !important;
  font-weight: 600 !important;
  padding: 10px 28px !important;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--re-accent) 40%, transparent) !important;
  transition: all 0.25s !important;
}

.vd-confirm-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--re-accent) 50%, transparent) !important;
}

/* 动画 */
@keyframes vd-pop-in {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes vd-icon-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(231, 76, 60, 0.3); }
  50% { box-shadow: 0 0 30px rgba(231, 76, 60, 0.6); }
}

.validation-fade-enter-active,
.validation-fade-leave-active {
  transition: opacity 0.25s ease;
}

.validation-fade-enter-active .validation-dialog,
.validation-fade-leave-active .validation-dialog {
  animation: vd-pop-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.validation-fade-leave-active .validation-dialog {
  animation: vd-pop-in 0.25s cubic-bezier(0.4, 0, 1, 1) reverse;
}

.validation-fade-enter-from,
.validation-fade-leave-to {
  opacity: 0;
}
</style>