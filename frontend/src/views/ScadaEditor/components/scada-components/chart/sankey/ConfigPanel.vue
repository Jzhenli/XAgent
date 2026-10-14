<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.sankeyConfig') }}</div>

    <!-- 基础样式 -->
    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.backgroundColor') }}</label>
      <el-color-picker
        :model-value="config.backgroundColor"
        show-alpha
        @active-change="handleColorActiveChange('backgroundColor', $event)"
        @change="handleColorChange('backgroundColor', $event)"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.sankeyNodeWidth') }}</label>
        <input
          type="number"
          min="5"
          max="60"
          :value="localNodeWidth"
          @input="(e) => localNodeWidth = +(e.target as HTMLInputElement).value"
          @change="commitNodeWidth"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.sankeyNodeGap') }}</label>
        <input
          type="number"
          min="2"
          max="50"
          :value="localNodeGap"
          @input="(e) => localNodeGap = +(e.target as HTMLInputElement).value"
          @change="commitNodeGap"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.sankeyNodeRadius') }}</label>
        <input
          type="number"
          min="0"
          max="30"
          :value="localNodeBorderRadius"
          @input="(e) => localNodeBorderRadius = +(e.target as HTMLInputElement).value"
          @change="commitNodeBorderRadius"
        />
      </div>
    </div>

    <!-- 连线样式 -->
    <div class="subsection-title">{{ t('componentConfig.sankeyLinkConfig') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.sankeyLinkColorMode') }}</label>
        <el-select
          :model-value="config.linkColorMode ?? 'gradient'"
          class="scada-select"
          popper-class="scada-select-dropdown"
          @update:model-value="(val) => updateConfig('linkColorMode', val)"
        >
          <el-option value="gradient" :label="t('componentConfig.sankeyLinkGradient')" />
          <el-option value="source" :label="t('componentConfig.sankeyLinkSourceColor')" />
          <el-option value="target" :label="t('componentConfig.sankeyLinkTargetColor')" />
        </el-select>
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.sankeyLinkOpacity') }}</label>
        <input
          type="number"
          min="0.1"
          max="1"
          step="0.05"
          :value="localLinkOpacity"
          @input="(e) => localLinkOpacity = +(e.target as HTMLInputElement).value"
          @change="commitLinkOpacity"
        />
      </div>
    </div>

    <!-- 交互设置 -->
    <div class="subsection-title">{{ t('componentConfig.interactionSection') }}</div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.sankeyHoverHighlight') }}</label>
        <el-switch
          :model-value="config.hoverHighlight !== false"
          @change="updateConfig('hoverHighlight', $event as boolean)"
        />
      </div>
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.sankeyAutoRefresh') }}</label>
        <el-switch
          :model-value="config.autoRefresh !== false"
          @change="updateConfig('autoRefresh', $event as boolean)"
        />
      </div>
    </div>

    <!-- 节点列表 -->
    <div class="subsection-title">{{ t('componentConfig.sankeyNodes') }}</div>
    <div class="items-list">
      <div
        v-for="(node, index) in config.nodes"
        :key="index"
        class="item-row"
      >
        <el-color-picker
          :model-value="node.color"
          :key="'node-color-' + index + '-' + node.color"
          @active-change="(val) => handleNodeColorActiveChange(index, val)"
          @change="(val) => handleNodeColorChange(index, val)"
          class="item-color"
        />
        <input
          type="text"
          class="item-name"
          :value="node.name"
          @input="(e) => updateNodeName(index, (e.target as HTMLInputElement).value)"
        />
        <div class="item-delete" @click="removeNode(index)">
          ✕
        </div>
      </div>
      <div class="item-add" @click="addNode">
        + {{ t('componentConfig.sankeyAddNode') }}
      </div>
    </div>

    <!-- 连线列表 -->
    <div class="subsection-title">{{ t('componentConfig.sankeyLinks') }}</div>
    <div class="items-list">
      <div
        v-for="(link, index) in config.links"
        :key="index"
        class="link-row"
      >
        <el-select
          :model-value="link.source"
          class="scada-select link-select"
          popper-class="scada-select-dropdown"
          :placeholder="t('componentConfig.sankeyLinkSource')"
          @update:model-value="(val) => updateLinkField(index, 'source', val as string)"
        >
          <el-option
            v-for="n in config.nodes"
            :key="n.name"
            :value="n.name"
            :label="n.name"
          />
        </el-select>
        <span class="link-arrow">→</span>
        <el-select
          :model-value="link.target"
          class="scada-select link-select"
          popper-class="scada-select-dropdown"
          :placeholder="t('componentConfig.sankeyLinkTarget')"
          @update:model-value="(val) => updateLinkField(index, 'target', val as string)"
        >
          <el-option
            v-for="n in config.nodes"
            :key="n.name"
            :value="n.name"
            :label="n.name"
          />
        </el-select>
        <input
          type="number"
          min="1"
          class="link-value"
          :value="link.value"
          @input="(e) => updateLinkField(index, 'value', +(e.target as HTMLInputElement).value)"
        />
        <div class="item-delete" @click="removeLink(index)">
          ✕
        </div>
      </div>
      <div class="item-add" @click="addLink">
        + {{ t('componentConfig.sankeyAddLink') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type {
  ScadaComponent,
  SankeyChartComponentConfig,
  SankeyNodeConfig,
  SankeyLinkConfig,
} from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(props.component as ScadaComponent<'chart-sankey'>)

// ═══════════════════════════════════════════════════════════════════════════════
// 本地 ref buffer：隔离 config 重渲染对输入框的回写干扰
// ═══════════════════════════════════════════════════════════════════════════════

const localNodeWidth = ref(20)
const localNodeGap = ref(14)
const localNodeBorderRadius = ref(4)
const localLinkOpacity = ref(0.45)

watch(
  () => config.value.nodeWidth,
  (v) => { localNodeWidth.value = v ?? 20 },
  { immediate: true },
)
watch(
  () => config.value.nodeGap,
  (v) => { localNodeGap.value = v ?? 14 },
  { immediate: true },
)
watch(
  () => config.value.nodeBorderRadius,
  (v) => { localNodeBorderRadius.value = v ?? 4 },
  { immediate: true },
)
watch(
  () => config.value.linkOpacity,
  (v) => { localLinkOpacity.value = v ?? 0.45 },
  { immediate: true },
)

const commitNodeWidth = () => updateConfig('nodeWidth', localNodeWidth.value)
const commitNodeGap = () => updateConfig('nodeGap', localNodeGap.value)
const commitNodeBorderRadius = () => updateConfig('nodeBorderRadius', localNodeBorderRadius.value)
const commitLinkOpacity = () => updateConfig('linkOpacity', localLinkOpacity.value)

// ═══════════════════════════════════════════════════════════════════════════════
// 颜色选择器
// ═══════════════════════════════════════════════════════════════════════════════

type ColorField = keyof Pick<SankeyChartComponentConfig, 'backgroundColor'>

const latestColor = ref<Record<ColorField, string>>({
  backgroundColor: '',
})

watch(
  () => config.value.backgroundColor,
  (v) => { latestColor.value.backgroundColor = v || '' },
  { immediate: true },
)

const handleColorActiveChange = (field: ColorField, val: string | null) => {
  latestColor.value[field] = val || ''
}

const handleColorChange = (field: ColorField, val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig(field, isCleared ? '' : latestColor.value[field])
}

// ═══════════════════════════════════════════════════════════════════════════════
// 节点列表操作
// ═══════════════════════════════════════════════════════════════════════════════

const latestNodeColors = ref<Record<number, string>>({})

watch(
  () => config.value.nodes?.map((n) => n.color),
  (colors) => {
    if (!colors) return
    colors.forEach((c, idx) => {
      latestNodeColors.value[idx] = c || ''
    })
  },
  { immediate: true },
)

const handleNodeColorActiveChange = (index: number, val: string | null) => {
  latestNodeColors.value[index] = val || ''
}

const handleNodeColorChange = (index: number, val: string | null) => {
  const nodes = [...(config.value.nodes || [])]
  if (nodes[index]) {
    const isCleared = val === null || val === undefined || val === ''
    nodes[index] = { ...nodes[index], color: isCleared ? '' : latestNodeColors.value[index] }
    updateConfig('nodes', nodes)
  }
}

const updateNodeName = (index: number, name: string) => {
  const nodes = [...(config.value.nodes || [])]
  if (nodes[index]) {
    const oldName = nodes[index].name
    nodes[index] = { ...nodes[index], name }
    // 同步更新 links 中引用的旧节点名
    const links = (config.value.links || []).map((link) => ({
      ...link,
      source: link.source === oldName ? name : link.source,
      target: link.target === oldName ? name : link.target,
    }))
    updateConfig('nodes', nodes)
    updateConfig('links', links)
  }
}

/** 默认节点配色循环 */
const NODE_COLORS = [
  '#22D3EE', '#A78BFA', '#34D399', '#FBBF24',
  '#F472B6', '#60A5FA', '#FB7185', '#2DD4BF',
]

const addNode = () => {
  const nodes = [...(config.value.nodes || [])]
  const newNode: SankeyNodeConfig = {
    name: `${t('componentConfig.sankeyNode')} ${nodes.length + 1}`,
    color: NODE_COLORS[nodes.length % NODE_COLORS.length],
  }
  nodes.push(newNode)
  updateConfig('nodes', nodes)
}

const removeNode = (index: number) => {
  const nodes = [...(config.value.nodes || [])]
  if (nodes.length <= 2) return // 至少保留 2 个节点
  const removedName = nodes[index].name
  nodes.splice(index, 1)
  // 同时移除引用该节点的连线
  const links = (config.value.links || []).filter(
    (link) => link.source !== removedName && link.target !== removedName,
  )
  updateConfig('nodes', nodes)
  updateConfig('links', links)
}

// ═══════════════════════════════════════════════════════════════════════════════
// 连线列表操作
// ═══════════════════════════════════════════════════════════════════════════════

const updateLinkField = (index: number, field: keyof SankeyLinkConfig, value: string | number) => {
  const links = [...(config.value.links || [])]
  if (links[index]) {
    links[index] = { ...links[index], [field]: value }
    updateConfig('links', links)
  }
}

const addLink = () => {
  const links = [...(config.value.links || [])]
  const nodes = config.value.nodes || []
  const sourceName = nodes[0]?.name || ''
  const targetName = nodes[Math.min(1, nodes.length - 1)]?.name || ''
  const newLink: SankeyLinkConfig = {
    source: sourceName,
    target: targetName,
    value: Math.round(Math.random() * 50 + 10),
  }
  links.push(newLink)
  updateConfig('links', links)
}

const removeLink = (index: number) => {
  const links = [...(config.value.links || [])]
  links.splice(index, 1)
  updateConfig('links', links)
}
</script>

<style scoped>
.config-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.config-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.subsection-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--border-light);
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
  width: 100%;
}

.form-group :deep(.el-select) {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 8px;
}

.form-row .form-group {
  flex: 1;
}

.form-group--switch {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group--switch :deep(.el-switch) {
  margin-top: 6px;
}

/* 通用 items 列表 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-color {
  flex-shrink: 0;
}

.item-color :deep(.el-color-picker__trigger) {
  width: 28px;
  height: 28px;
  padding: 2px;
}

.item-name {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}

.item-delete {
  width: 24px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-placeholder);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  user-select: none;
}

.item-delete:hover {
  background-color: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.item-add {
  padding: 8px;
  text-align: center;
  border: 1px dashed rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.item-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(34, 211, 238, 0.08);
}

/* 连线行 */
.link-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-select {
  flex: 1;
  min-width: 0;
}

.link-arrow {
  color: var(--text-tertiary);
  font-size: 14px;
  flex-shrink: 0;
  padding: 0 2px;
}

.link-value {
  width: 55px;
  flex-shrink: 0;
  padding: 6px 6px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  background-color: var(--scada-bg-elevated);
  color: var(--text-primary);
}
</style>
