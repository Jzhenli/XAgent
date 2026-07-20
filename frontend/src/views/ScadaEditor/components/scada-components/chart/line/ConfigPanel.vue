<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.chartConfig') }}</div>

    <!-- 数据相关 -->
    <div class="subsection-title">{{ t('componentConfig.dataSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.timeRange') }}</label>
      <select
        :value="config.timeRange"
        @change="updateConfig('timeRange', ($event.target as HTMLSelectElement).value as LineChartComponentConfig['timeRange'])"
      >
        <option value="1h">{{ t('dashboard.timeRange1h') }}</option>
        <option value="6h">{{ t('pointTrend.timeRange6h') }}</option>
        <option value="24h">{{ t('dashboard.timeRange24h') }}</option>
        <option value="7d">{{ t('dashboard.timeRange7d') }}</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showXAxisLabel') }}</label>
        <el-switch
          :model-value="config.showXAxisLabel"
          @change="updateConfig('showXAxisLabel', $event as boolean)"
        />
      </div>
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showYAxisLabel') }}</label>
        <el-switch
          :model-value="config.showYAxisLabel"
          @change="updateConfig('showYAxisLabel', $event as boolean)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.showYAxisLine') }}</label>
        <el-switch
          :model-value="config.showYAxisLine"
          @change="updateConfig('showYAxisLine', $event as boolean)"
        />
      </div>
    </div>

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
        <label>{{ t('componentConfig.xAxisLabelColor') }}</label>
        <el-color-picker
          :model-value="config.xAxisLabelColor"
          show-alpha
          @active-change="handleColorActiveChange('xAxisLabelColor', $event)"
          @change="handleColorChange('xAxisLabelColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.xAxisLabelFontSize') }}</label>
        <input
          type="number"
          min="1"
          :value="config.xAxisLabelFontSize"
          @change="updateConfig('xAxisLabelFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.yAxisLabelColor') }}</label>
        <el-color-picker
          :model-value="config.yAxisLabelColor"
          show-alpha
          @active-change="handleColorActiveChange('yAxisLabelColor', $event)"
          @change="handleColorChange('yAxisLabelColor', $event)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.yAxisLabelFontSize') }}</label>
        <input
          type="number"
          min="1"
          :value="config.yAxisLabelFontSize"
          @change="updateConfig('yAxisLabelFontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.lineWidth') }}</label>
        <input
          type="number"
          min="1"
          :value="config.lineWidth"
          @change="updateConfig('lineWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.lineColor') }}</label>
        <el-color-picker
          :model-value="config.lineColor"
          show-alpha
          @active-change="handleColorActiveChange('lineColor', $event)"
          @change="handleColorChange('lineColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.nodeSize') }}</label>
        <input
          type="number"
          min="0"
          :value="config.nodeSize"
          @change="updateConfig('nodeSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.nodeFillColor') }}</label>
        <el-color-picker
          :model-value="config.nodeFillColor"
          show-alpha
          @active-change="handleColorActiveChange('nodeFillColor', $event)"
          @change="handleColorChange('nodeFillColor', $event)"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.smoothLine') }}</label>
        <el-switch
          :model-value="config.smooth"
          @change="updateConfig('smooth', $event as boolean)"
        />
      </div>
      <div class="form-group form-group--switch">
        <label>{{ t('componentConfig.areaFill') }}</label>
        <el-switch
          :model-value="config.areaFill"
          @change="updateConfig('areaFill', $event as boolean)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type { ScadaComponent, LineChartComponentConfig } from '../../../../types'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(props.component as ScadaComponent<'chart-line'>)

// ═══════════════════════════════════════════════════════════════════════════════
// 颜色选择器字段
// ═══════════════════════════════════════════════════════════════════════════════

type ColorField = keyof Pick<
  LineChartComponentConfig,
  'backgroundColor' | 'lineColor' | 'nodeFillColor' | 'xAxisLabelColor' | 'yAxisLabelColor'
>

const colorFields: ColorField[] = [
  'backgroundColor',
  'lineColor',
  'nodeFillColor',
  'xAxisLabelColor',
  'yAxisLabelColor',
]

const latestColor = ref<Record<ColorField, string>>({
  backgroundColor: '',
  lineColor: '',
  nodeFillColor: '',
  xAxisLabelColor: '',
  yAxisLabelColor: '',
})

watch(
  () => colorFields.map((field) => config.value[field]),
  (values) => {
    colorFields.forEach((field, index) => {
      latestColor.value[field] = (values[index] as string) || ''
    })
  },
  { immediate: true },
)

const handleColorActiveChange = (field: ColorField, val: string | null) => {
  latestColor.value[field] = val || ''
}

const handleColorChange = (field: ColorField, val: string | null) => {
  const isCleared = val === null || val === undefined || val === ''
  updateConfig(field, isCleared ? '' : latestColor.value[field])
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  font-size: 13px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group :deep(.el-color-picker__trigger) {
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
</style>
