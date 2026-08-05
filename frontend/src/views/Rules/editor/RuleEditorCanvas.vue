<template>
  <div class="rule-editor-canvas">
    <!-- 顶部工具栏：规则名称/描述输入 + 节点统计 + 清除/保存按钮 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="ruleName"
          :placeholder="t('ruleEditor.ruleName')"
          style="width: 200px"
        />
        <el-input
          v-model="ruleDescription"
          :placeholder="t('ruleEditor.ruleDescription')"
          style="width: 300px"
        />
      </div>
      <div class="toolbar-right">
        <span class="node-count">{{ t('ruleEditor.nodeCount') }}: {{ nodes.length }} | {{ t('ruleEditor.edgeCount') }}: {{ edges.length }}</span>
        <el-button @click="handleClear" :disabled="loading || saving">{{ t('ruleEditor.clear') }}</el-button>
        <el-button type="primary" :disabled="saving" :loading="saving" @click="handleSave">
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

      <div ref="canvasContainerRef" class="editor-canvas" @drop="onDrop" @dragover="onDragOver">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-edge-options="{ type: 'smoothstep', animated: true }"
          :fit-view-on-init="true"
          :snap-to-grid="true"
          :snap-grid="[15, 15]"
          class="vue-flow-container"
          @nodes-change="onNodesChange"
          @edges-change="onEdgesChange"
          @connect="onConnect"
          @node-click="onNodeClick"
        >
          <Background pattern-color="#aaa" :gap="20" />
          <Controls />
          <MiniMap />
        </VueFlow>
      </div>

      <!-- 选中节点时显示配置面板 -->
      <div v-if="selectedNode" class="config-panel">
        <div class="panel-header">
          <span>{{ t('ruleEditor.nodeConfig') }}</span>
          <el-button type="danger" link size="small" @click="handleNodeDelete(selectedNode.id)">
            {{ t('ruleEditor.deleteNode') }}
          </el-button>
        </div>
        <NodeConfigPanel
          :key="selectedNode.id"
          :node-id="selectedNode.id"
          :node-type="selectedNode.type as NodeType"
          :node-data="selectedNode.data ?? {}"
          @update="handleNodeUpdate"
          @delete="handleNodeDelete"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, markRaw, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueFlow, useVueFlow, type Connection, type NodeChange, type EdgeChange } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ElMessage, ElMessageBox } from 'element-plus'
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
import { createNode, validateGraph } from '@/utils/ruleConverter'
import { graphToBackendCreate, graphToBackendUpdate, backendToGraph } from '@/utils/ruleBridge'
import { useRuleStore } from '@/stores/rules'

const { t } = useI18n()

const props = defineProps<{
  /** 规则 ID，传入时表示编辑已有规则 */
  ruleId?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const ruleStore = useRuleStore()

/** VueFlow 核心 hooks */
const {
  addNodes,
  addEdges,
  removeNodes,
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

/** 删除指定节点 */
const handleNodeDelete = (nodeId: string) => {
  removeNodes([nodeId])
  if (selectedNodeId.value === nodeId) {
    selectedNodeId.value = null
  }
}

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
    const messages = result.errors.map(err => t(err.key, err.params ?? {}))
    const html = `<div style="margin-bottom:8px">${t('ruleEditor.validationHint')}</div><ul style="padding-left:18px;margin:0">${messages.map(m => `<li style="margin-bottom:4px">${m}</li>`).join('')}</ul>`
    ElMessageBox.alert(html, t('ruleEditor.validationTitle'), {
      confirmButtonText: t('common.confirm'),
      dangerouslyUseHTMLString: true,
      type: 'warning'
    })
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
    } else {
      // 创建新规则
      const createData = graphToBackendCreate(
        ruleName.value,
        ruleDescription.value,
        currentNodes,
        edges.value
      )
      await ruleStore.createRule(createData)
      ElMessage.success(t('ruleEditor.ruleCreated'))
    }
    emit('saved')
    emit('close')
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
})

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

/** 组件卸载时清理竞态标记 */
onBeforeUnmount(() => {
  loadingRuleId = null
})
</script>

<style scoped>
.rule-editor-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-container);
  border-bottom: 1px solid var(--border-base);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.node-count {
  font-size: 13px;
  color: var(--text-secondary);
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
}

.vue-flow-container {
  width: 100%;
  height: 100%;
}

.config-panel {
  width: 320px;
  background: var(--bg-container);
  border-left: 1px solid var(--border-base);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-base);
  font-weight: 600;
  color: var(--text-primary);
}

.empty-panel {
  width: 320px;
  background: var(--bg-container);
  border-left: 1px solid var(--border-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.empty-content p {
  margin: 4px 0;
  color: var(--text-primary);
}

.empty-content .hint {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>