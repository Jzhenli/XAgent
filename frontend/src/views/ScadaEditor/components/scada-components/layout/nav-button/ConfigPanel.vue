<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.navButtonConfig') }}</div>

    <div class="form-group">
      <label>{{ t('componentConfig.buttonText') }}</label>
      <input
        type="text"
        :value="config.text"
        @input="updateConfig('text', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="subsection-title">{{ t('componentConfig.styleSection') }}</div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.fontSize') }}</label>
        <input
          type="number"
          :value="config.fontSize"
          @input="updateConfig('fontSize', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.fontColor') }}</label>
        <el-color-picker
          :model-value="config.fontColor"
          show-alpha
          @change="updateConfig('fontColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ t('componentConfig.buttonColor') }}</label>
      <el-color-picker
        :model-value="config.backgroundColor"
        show-alpha
        @change="handleBackgroundColorChange"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>{{ t('componentConfig.borderWidth') }}</label>
        <input
          type="number"
          min="0"
          :value="config.borderWidth"
          @input="updateConfig('borderWidth', +($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group">
        <label>{{ t('componentConfig.borderColor') }}</label>
        <el-color-picker
          :model-value="config.borderColor"
          show-alpha
          @change="updateConfig('borderColor', $event as string)"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ t('componentConfig.borderRadius') }}</label>
      <input
        type="number"
        min="0"
        :value="config.borderRadius"
        @input="updateConfig('borderRadius', +($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="subsection-title">{{ t('componentConfig.jumpSection') }}</div>
    <div class="form-group">
      <label>{{ t('componentConfig.jumpMode') }}</label>
      <el-select
        :model-value="config.jumpMode"
        class="scada-select"
        popper-class="scada-select-dropdown"
        @change="handleJumpModeChange"
      >
        <el-option value="url" :label="t('componentConfig.jumpModeUrl')" />
        <el-option value="project" :label="t('componentConfig.jumpModeProject')" />
      </el-select>
    </div>

    <div v-if="config.jumpMode === 'url'" class="form-group">
      <label>{{ t('componentConfig.targetUrl') }}</label>
      <input
        type="text"
        :value="config.targetUrl"
        :placeholder="t('componentConfig.targetUrlPlaceholder')"
        @input="updateConfig('targetUrl', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div v-if="config.jumpMode === 'project'" class="form-group">
      <label>{{ t('componentConfig.targetProject') }}</label>
      <el-select
        :model-value="config.targetProjectId"
        class="scada-select"
        popper-class="scada-select-dropdown"
        :placeholder="t('componentConfig.selectProjectPlaceholder')"
        filterable
        clearable
        @change="handleProjectChange"
      >
        <el-option
          v-for="p in projects"
          :key="p.id"
          :label="p.name"
          :value="p.id"
        >
          <div class="project-option">
            <span class="project-name">{{ p.name }}</span>
            <span class="project-type-tag" :class="p.type === 'Dashboard' ? 'type-dashboard' : 'type-graphic'">
              {{ p.type === 'Dashboard' ? t('scada.dashboardType') : t('scada.graphicType') }}
            </span>
          </div>
        </el-option>
      </el-select>
      <div v-if="projectLoading" class="loading-hint">
        {{ t('common.loading') }}
      </div>
      <div v-else-if="projects.length === 0" class="empty-hint">
        {{ t('componentConfig.noProjects') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import { projectApi } from '@/api/projects'
import type { ScadaComponent, NavButtonComponentConfig } from '../../../../types'
import type { Project } from '@/types/project'

const { t } = useI18n()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'nav-button'>,
)

const projects = ref<Project[]>([])
const projectLoading = ref(false)

const loadProjects = async () => {
  projectLoading.value = true
  try {
    const res = await projectApi.list()
    projects.value = res?.items ?? []
  } catch {
    projects.value = []
  } finally {
    projectLoading.value = false
  }
}

onMounted(() => {
  loadProjects()
})

const handleBackgroundColorChange = (val: string | null) => {
  updateConfig('backgroundColor', val || '')
  updateConfig('borderColor', val || '')
}

const handleJumpModeChange = (val: string) => {
  updateConfig('jumpMode', val as NavButtonComponentConfig['jumpMode'])
}

const handleProjectChange = (val: string) => {
  updateConfig('targetProjectId', val || '')
  const project = projects.value.find(p => p.id === val)
  updateConfig('targetProjectType', project?.type)
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

.form-group input::placeholder {
  color: var(--text-placeholder);
}

.form-group input:focus {
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

.loading-hint,
.empty-hint {
  font-size: 12px;
  color: var(--text-placeholder);
  margin-top: 4px;
}

.project-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.project-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-type-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 8px;
  flex-shrink: 0;
}

.project-type-tag.type-dashboard {
  background: rgba(102, 102, 255, 0.15);
  color: rgba(102, 102, 255, 1);
}

.project-type-tag.type-graphic {
  background: rgba(255, 152, 0, 0.15);
  color: rgba(255, 152, 0, 1);
}
</style>
