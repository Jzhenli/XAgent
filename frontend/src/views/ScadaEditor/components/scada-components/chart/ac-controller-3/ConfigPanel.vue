<template>
  <div class="config-section">
    <div class="section-title">{{ t('componentConfig.acController3Config') }}</div>

    <el-collapse v-model="activeItems" class="config-collapse">
      <!-- ① 点位绑定 -->
      <el-collapse-item :name="'bindings'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.bindingsSection') }}</span>
        </template>

        <div class="binding-group">
          <div class="binding-label">{{ t('componentConfig.powerBinding') }}</div>
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="currentBindings.power?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleDeviceChange('power', $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="currentBindings.power?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.power?.deviceId"
              @update:model-value="handlePointChange('power', $event as string)"
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.power)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>

        <div class="binding-group">
          <div class="binding-label">{{ t('componentConfig.setpointBinding') }}</div>
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="currentBindings.setpoint?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleDeviceChange('setpoint', $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="currentBindings.setpoint?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.setpoint?.deviceId"
              @update:model-value="handlePointChange('setpoint', $event as string)"
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.setpoint)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>

        <div class="binding-group">
          <div class="binding-label">{{ t('componentConfig.currentValueBindingConfig') }}</div>
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="currentBindings.currentValue?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleDeviceChange('currentValue', $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="currentBindings.currentValue?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.currentValue?.deviceId"
              @update:model-value="handlePointChange('currentValue', $event as string)"
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.currentValue)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>

        <div class="binding-group">
          <div class="binding-label">{{ t('componentConfig.modeBinding') }}</div>
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="currentBindings.mode?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleDeviceChange('mode', $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="currentBindings.mode?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.mode?.deviceId"
              @update:model-value="handlePointChange('mode', $event as string)"
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.mode)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>

        <div class="binding-group binding-group--last">
          <div class="binding-label">{{ t('componentConfig.fanSpeedBinding') }}</div>
          <div class="form-group">
            <label>{{ t('componentConfig.device') }}</label>
            <el-select
              :model-value="currentBindings.fanSpeed?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="handleDeviceChange('fanSpeed', $event as string)"
            >
              <el-option
                v-for="device in pointStore.devices"
                :key="device.asset"
                :value="device.asset"
                :label="device.name"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.point') }}</label>
            <el-select
              :model-value="currentBindings.fanSpeed?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.fanSpeed?.deviceId"
              @update:model-value="handlePointChange('fanSpeed', $event as string)"
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.fanSpeed)"
                :key="point.name"
                :value="point.name"
                :label="point.name + (point.description ? ` (${point.description})` : '')"
              />
            </el-select>
          </div>
        </div>
      </el-collapse-item>

      <!-- ② 画布卡片外观 -->
      <el-collapse-item :name="'button'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.cardSection') }}</span>
        </template>

        <div class="form-group">
          <label>{{ t('componentConfig.editModeOpenDialog') }}</label>
          <el-switch
            :model-value="config.editModeOpenDialog"
            @update:model-value="updateConfig('editModeOpenDialog', $event)"
          />
        </div>

        <div class="form-group">
          <label>{{ t('componentConfig.cardTitle') }}</label>
          <input
            type="text"
            :value="config.cardTitle"
            @input="updateConfig('cardTitle', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.cardTitleFontSize') }}</label>
            <input
              type="number"
              min="1"
              :value="config.cardTitleFontSize"
              @change="updateConfig('cardTitleFontSize', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.borderRadius') }}</label>
            <input
              type="number"
              min="0"
              :value="config.cardBorderRadius"
              @change="updateConfig('cardBorderRadius', +($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.cardBackgroundColor') }}</label>
            <el-color-picker
              :model-value="config.cardBackgroundColor"
              show-alpha
              @change="handleColorChange('cardBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.cardTitleColor') }}</label>
            <el-color-picker
              :model-value="config.cardTitleColor"
              show-alpha
              @change="handleColorChange('cardTitleColor', $event)"
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('componentConfig.activeAccentColor') }}</label>
          <el-color-picker
            :model-value="config.activeAccentColor"
            show-alpha
            @change="handleColorChange('activeAccentColor', $event)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.valueFontSize') }}</label>
            <input
              type="number"
              min="8"
              :value="config.cardValueFontSize"
              @change="updateConfig('cardValueFontSize', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.unitFontSizeLabel') }}</label>
            <input
              type="number"
              min="8"
              :value="config.cardUnitFontSize"
              @change="updateConfig('cardUnitFontSize', +($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('componentConfig.decimalPlaces') }}</label>
          <input
            type="number"
            min="0"
            max="6"
            :value="config.cardValueDecimalPlaces"
            @change="updateConfig('cardValueDecimalPlaces', +($event.target as HTMLInputElement).value)"
          />
        </div>
      </el-collapse-item>

      <!-- ③ 弹框外观 -->
      <el-collapse-item :name="'dialog'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.dialogSection') }}</span>
        </template>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.mainTitle') }}</label>
            <input
              type="text"
              :value="config.dialogTitle"
              @input="updateConfig('dialogTitle', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.subTitle') }}</label>
            <input
              type="text"
              :value="config.dialogSubtitle"
              @input="updateConfig('dialogSubtitle', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.width') }}</label>
            <input
              type="number"
              min="200"
              :value="config.dialogWidth"
              @change="updateConfig('dialogWidth', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.borderRadius') }}</label>
            <input
              type="number"
              min="0"
              :value="config.dialogBorderRadius"
              @change="updateConfig('dialogBorderRadius', +($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.backgroundColor') }}</label>
            <el-color-picker
              :model-value="config.dialogBackgroundColor"
              show-alpha
              @change="handleColorChange('dialogBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.unit') }}</label>
            <input
              type="text"
              :value="config.gaugeUnit"
              @input="updateConfig('gaugeUnit', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.minValue') }}</label>
            <input
              type="number"
              :value="config.gaugeMin"
              @change="updateConfig('gaugeMin', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.maxValue') }}</label>
            <input
              type="number"
              :value="config.gaugeMax"
              @change="updateConfig('gaugeMax', +($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.step') }}</label>
            <input
              type="number"
              :min="0.1"
              :step="0.1"
              :value="config.gaugeStep"
              @change="updateConfig('gaugeStep', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.currentValueLabel') }}</label>
            <input
              type="text"
              :value="config.currentValueLabel"
              @input="updateConfig('currentValueLabel', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ④ 主区域 / 电源 -->
      <el-collapse-item :name="'mainarea'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.mainAreaSection') }}</span>
        </template>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.gradientStartColor') }}</label>
            <el-color-picker
              :model-value="config.mainAreaGradient[0]"
              show-alpha
              @change="(v) => updateGradient(0, v)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.gradientEndColor') }}</label>
            <el-color-picker
              :model-value="config.mainAreaGradient[1]"
              show-alpha
              @change="(v) => updateGradient(1, v)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.gradientAngle') }}</label>
            <input
              type="number"
              :value="config.mainAreaGradientAngle"
              @change="updateConfig('mainAreaGradientAngle', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.fontSize') }}</label>
            <input
              type="number"
              min="10"
              :value="config.mainAreaFontSize"
              @change="updateConfig('mainAreaFontSize', +($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.fontColor') }}</label>
            <el-color-picker
              :model-value="config.mainAreaTextColor"
              show-alpha
              @change="handleColorChange('mainAreaTextColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.powerButtonSize') }}</label>
            <input
              type="number"
              min="20"
              :value="config.powerButtonSize"
              @change="updateConfig('powerButtonSize', +($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.powerOnColor') }}</label>
            <el-color-picker
              :model-value="config.powerButtonOnColor"
              show-alpha
              @change="handleColorChange('powerButtonOnColor', $event)"
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ⑤ 模式配置 -->
      <el-collapse-item :name="'mode'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.modeSection') }}</span>
        </template>

        <div class="form-group">
          <label>{{ t('componentConfig.sectionTitle') }}</label>
          <input
            type="text"
            :value="config.modeSectionTitle"
            @input="updateConfig('modeSectionTitle', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.backgroundColor') }}</label>
            <el-color-picker
              :model-value="config.modeBackgroundColor"
              show-alpha
              @change="handleColorChange('modeBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeBackgroundColor') }}</label>
            <el-color-picker
              :model-value="config.modeActiveBackgroundColor"
              show-alpha
              @change="handleColorChange('modeActiveBackgroundColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.iconColor') }}</label>
            <el-color-picker
              :model-value="config.modeIconColor"
              show-alpha
              @change="handleColorChange('modeIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeIconColor') }}</label>
            <el-color-picker
              :model-value="config.modeActiveIconColor"
              show-alpha
              @change="handleColorChange('modeActiveIconColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.fontColor') }}</label>
            <el-color-picker
              :model-value="config.modeFontColor"
              show-alpha
              @change="handleColorChange('modeFontColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeFontColor') }}</label>
            <el-color-picker
              :model-value="config.modeActiveFontColor"
              show-alpha
              @change="handleColorChange('modeActiveFontColor', $event)"
            />
          </div>
        </div>

        <div class="form-group fan-levels">
          <label>{{ t('componentConfig.modeLevels') }}</label>
          <div class="fan-level-row">
            <el-switch :model-value="config.modeAutoVisible"
              @update:model-value="updateConfig('modeAutoVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.modeAutoVisible"
              :value="config.modeAutoLabel"
              @input="updateConfig('modeAutoLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.modeAutoVisible"
              :value="config.modeAutoValue"
              @change="parseAndUpdate('modeAutoValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.modeCoolVisible"
              @update:model-value="updateConfig('modeCoolVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.modeCoolVisible"
              :value="config.modeCoolLabel"
              @input="updateConfig('modeCoolLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.modeCoolVisible"
              :value="config.modeCoolValue"
              @change="parseAndUpdate('modeCoolValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.modeHeatVisible"
              @update:model-value="updateConfig('modeHeatVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.modeHeatVisible"
              :value="config.modeHeatLabel"
              @input="updateConfig('modeHeatLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.modeHeatVisible"
              :value="config.modeHeatValue"
              @change="parseAndUpdate('modeHeatValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.modeFanVisible"
              @update:model-value="updateConfig('modeFanVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.modeFanVisible"
              :value="config.modeFanLabel"
              @input="updateConfig('modeFanLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.modeFanVisible"
              :value="config.modeFanValue"
              @change="parseAndUpdate('modeFanValue', $event)" />
          </div>
        </div>
      </el-collapse-item>

      <!-- ⑥ 风速配置 -->
      <el-collapse-item :name="'fan'">
        <template #title>
          <span class="collapse-title">{{ t('componentConfig.fanSpeedSection') }}</span>
        </template>

        <div class="form-group">
          <label>{{ t('componentConfig.sectionTitle') }}</label>
          <input
            type="text"
            :value="config.fanSectionTitle"
            @input="updateConfig('fanSectionTitle', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.backgroundColor') }}</label>
            <el-color-picker
              :model-value="config.fanBackgroundColor"
              show-alpha
              @change="handleColorChange('fanBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeBackgroundColor') }}</label>
            <el-color-picker
              :model-value="config.fanActiveBackgroundColor"
              show-alpha
              @change="handleColorChange('fanActiveBackgroundColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.iconColor') }}</label>
            <el-color-picker
              :model-value="config.fanIconColor"
              show-alpha
              @change="handleColorChange('fanIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeIconColor') }}</label>
            <el-color-picker
              :model-value="config.fanActiveIconColor"
              show-alpha
              @change="handleColorChange('fanActiveIconColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.fontColor') }}</label>
            <el-color-picker
              :model-value="config.fanFontColor"
              show-alpha
              @change="handleColorChange('fanFontColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('componentConfig.activeFontColor') }}</label>
            <el-color-picker
              :model-value="config.fanActiveFontColor"
              show-alpha
              @change="handleColorChange('fanActiveFontColor', $event)"
            />
          </div>
        </div>

        <div class="form-group fan-levels">
          <label>{{ t('componentConfig.fanLevels') }}</label>
          <div class="fan-level-row">
            <el-switch :model-value="config.fanAutoVisible"
              @update:model-value="updateConfig('fanAutoVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.fanAutoVisible"
              :value="config.fanAutoLabel"
              @input="updateConfig('fanAutoLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.fanAutoVisible"
              :value="config.fanAutoValue"
              @change="parseAndUpdate('fanAutoValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.fanLowVisible"
              @update:model-value="updateConfig('fanLowVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.fanLowVisible"
              :value="config.fanLowLabel"
              @input="updateConfig('fanLowLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.fanLowVisible"
              :value="config.fanLowValue"
              @change="parseAndUpdate('fanLowValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.fanMediumVisible"
              @update:model-value="updateConfig('fanMediumVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.fanMediumVisible"
              :value="config.fanMediumLabel"
              @input="updateConfig('fanMediumLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.fanMediumVisible"
              :value="config.fanMediumValue"
              @change="parseAndUpdate('fanMediumValue', $event)" />
          </div>
          <div class="fan-level-row">
            <el-switch :model-value="config.fanHighVisible"
              @update:model-value="updateConfig('fanHighVisible', $event)" />
            <input type="text" class="level-label" :disabled="!config.fanHighVisible"
              :value="config.fanHighLabel"
              @input="updateConfig('fanHighLabel', ($event.target as HTMLInputElement).value)" />
            <input type="text" class="level-value" :disabled="!config.fanHighVisible"
              :value="config.fanHighValue"
              @change="parseAndUpdate('fanHighValue', $event)" />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePointStore } from '@/stores/points'
import { useScadaConfig } from '../../../../hooks/useScadaEditor'
import type {
  ScadaComponent,
  AcController3ComponentConfig,
  AcControllerBindings,
  PointBinding,
} from '../../../../types'

const { t } = useI18n()
const pointStore = usePointStore()

const props = defineProps<{
  component: ScadaComponent
}>()

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<'ac-controller-3'>,
)

// 折叠项
const activeItems = ref<string[]>([])

// 绑定相关
type BindingKey = keyof AcControllerBindings

const currentBindings = ref<AcControllerBindings>(
  (config.value.bindings ?? {
    power: null, mode: null, fanSpeed: null, setpoint: null, currentValue: null,
  }) as AcControllerBindings,
)

const getBindingPoints = (binding: PointBinding | null | undefined) => {
  if (!binding?.deviceId) return []
  const device = pointStore.devices.find(
    (d) => d.asset === binding!.deviceId || d.name === binding!.deviceId,
  )
  return device?.points || []
}

const handleDeviceChange = (key: BindingKey, deviceId: string) => {
  currentBindings.value = {
    ...currentBindings.value,
    [key]: deviceId ? { deviceId, pointName: '' } : null,
  }
  updateConfig('bindings', currentBindings.value)
}

const handlePointChange = (key: BindingKey, pointName: string) => {
  const binding = currentBindings.value[key]
  if (!binding || !pointName) {
    currentBindings.value = { ...currentBindings.value, [key]: null }
    updateConfig('bindings', currentBindings.value)
    return
  }
  const point = getBindingPoints(binding).find((p) => p.name === pointName)
  const newBinding: PointBinding = {
    ...binding,
    pointName,
    pointDescription: point?.description,
    unit: point?.unit,
  }
  currentBindings.value = { ...currentBindings.value, [key]: newBinding }
  updateConfig('bindings', currentBindings.value)
}

// 渐变色更新
const updateGradient = (index: number, val: string | null) => {
  const current = [...config.value.mainAreaGradient] as [string, string]
  current[index] = val || current[index]
  updateConfig('mainAreaGradient', current)
}

// 数值/字符串解析
const parseAndUpdate = (key: string, e: Event) => {
  const target = e.target as HTMLInputElement
  const trimmed = target.value.trim()
  if (trimmed === '') return
  const num = Number(trimmed)
  updateConfig(key as any, Number.isNaN(num) ? trimmed : num)
}

// 颜色更新
const handleColorChange = (field: string, val: string | null) => {
  updateConfig(field as any, val || '')
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
  color: var(--scada-cyan);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: "";
  width: 4px;
  height: 14px;
  background: linear-gradient(180deg, var(--scada-cyan) 0%, var(--scada-purple) 100%);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}

:deep(.el-collapse) {
  border: none !important;
}

.config-collapse :deep(.el-collapse-item__header) {
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  border: none !important;
  background: transparent;
  font-size: 12px;
  color: var(--text-secondary);
}

.config-collapse :deep(.el-collapse-item__wrap) {
  background: transparent;
  border: none !important;
}

.config-collapse :deep(.el-collapse-item__content) {
  padding: 10px;
}

.config-collapse :deep(.el-collapse-item__arrow) {
  color: var(--text-tertiary);
}

.config-collapse :deep(.el-collapse-item__arrow.is-active) {
  transform: rotate(90deg);
}

.collapse-title {
  font-weight: 500;
}

.binding-group {
  padding: 10px;
  border: 1px solid rgba(34, 211, 238, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.015);
  margin-bottom: 8px;
}

.binding-group--last {
  margin-bottom: 0;
}

.binding-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
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
  box-sizing: border-box;
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

/* 模式/风速档次行 */
.fan-levels {
  margin-top: 4px;
}

.fan-level-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
}

.fan-level-row:last-child {
  border-bottom: none;
}

.level-label {
  flex: 1.2;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}

.level-value {
  flex: 0.8;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}

.level-label:disabled,
.level-value:disabled {
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}
</style>
