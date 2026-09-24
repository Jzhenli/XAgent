<template>
  <div class="config-section">
    <div class="section-title">
      {{ t("componentConfig.acController2Config") }}
    </div>

    <el-collapse v-model="activeItems" class="config-collapse">
      <!-- ═══════════════════ ① 点位绑定 ═══════════════════ -->
      <el-collapse-item :name="'bindings'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.bindingsSection")
          }}</span>
        </template>

        <!-- 开关点位 -->
        <div class="binding-group">
          <div class="binding-label">
            {{ t("componentConfig.powerBinding") }}
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.device") }}</label>
            <el-select
              :model-value="currentBindings.power?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="
                handleDeviceChange('power', $event as string)
              "
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
            <label>{{ t("componentConfig.point") }}</label>
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
                :label="
                  point.name +
                  (point.description ? ` (${point.description})` : '')
                "
              />
            </el-select>
          </div>
        </div>

        <!-- 设定值点位 -->
        <div class="binding-group">
          <div class="binding-label">
            {{ t("componentConfig.setpointBinding") }}
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.device") }}</label>
            <el-select
              :model-value="currentBindings.setpoint?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="
                handleDeviceChange('setpoint', $event as string)
              "
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
            <label>{{ t("componentConfig.point") }}</label>
            <el-select
              :model-value="currentBindings.setpoint?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.setpoint?.deviceId"
              @update:model-value="
                handlePointChange('setpoint', $event as string)
              "
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.setpoint)"
                :key="point.name"
                :value="point.name"
                :label="
                  point.name +
                  (point.description ? ` (${point.description})` : '')
                "
              />
            </el-select>
          </div>
        </div>

        <!-- 当前值点位 -->
        <div class="binding-group">
          <div class="binding-label">
            {{ t("componentConfig.currentValueBindingConfig") }}
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.device") }}</label>
            <el-select
              :model-value="currentBindings.currentValue?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="
                handleDeviceChange('currentValue', $event as string)
              "
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
            <label>{{ t("componentConfig.point") }}</label>
            <el-select
              :model-value="currentBindings.currentValue?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.currentValue?.deviceId"
              @update:model-value="
                handlePointChange('currentValue', $event as string)
              "
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.currentValue)"
                :key="point.name"
                :value="point.name"
                :label="
                  point.name +
                  (point.description ? ` (${point.description})` : '')
                "
              />
            </el-select>
          </div>
        </div>

        <!-- 模式点位 -->
        <div class="binding-group">
          <div class="binding-label">
            {{ t("componentConfig.modeBinding") }}
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.device") }}</label>
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
            <label>{{ t("componentConfig.point") }}</label>
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
                :label="
                  point.name +
                  (point.description ? ` (${point.description})` : '')
                "
              />
            </el-select>
          </div>
        </div>

        <!-- 风速点位 -->
        <div class="binding-group binding-group--last">
          <div class="binding-label">
            {{ t("componentConfig.fanSpeedBinding") }}
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.device") }}</label>
            <el-select
              :model-value="currentBindings.fanSpeed?.deviceId ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectDevice')"
              @update:model-value="
                handleDeviceChange('fanSpeed', $event as string)
              "
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
            <label>{{ t("componentConfig.point") }}</label>
            <el-select
              :model-value="currentBindings.fanSpeed?.pointName ?? ''"
              class="scada-select"
              popper-class="scada-select-dropdown"
              clearable
              :placeholder="t('componentConfig.selectPoint')"
              :disabled="!currentBindings.fanSpeed?.deviceId"
              @update:model-value="
                handlePointChange('fanSpeed', $event as string)
              "
            >
              <el-option
                v-for="point in getBindingPoints(currentBindings.fanSpeed)"
                :key="point.name"
                :value="point.name"
                :label="
                  point.name +
                  (point.description ? ` (${point.description})` : '')
                "
              />
            </el-select>
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ② 面板 ═══════════════════ -->
      <el-collapse-item :name="'panel'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.panelSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.backgroundColor") }}</label>
            <el-color-picker
              :model-value="config.backgroundColor"
              show-alpha
              @active-change="
                handleColorActiveChange('backgroundColor', $event)
              "
              @change="handleColorChange('backgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.borderRadius") }}</label>
            <input
              type="number"
              min="0"
              :value="config.borderRadius"
              @change="
                updateConfig(
                  'borderRadius',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ③ 标题 ═══════════════════ -->
      <el-collapse-item :name="'title'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.titleSection")
          }}</span>
        </template>
        <div class="form-group">
          <label>{{ t("componentConfig.text") }}</label>
          <input
            type="text"
            :value="config.title"
            @input="
              updateConfig('title', ($event.target as HTMLInputElement).value)
            "
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.fontSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.titleFontSize"
              @change="
                updateConfig(
                  'titleFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.fontColor") }}</label>
            <el-color-picker
              :model-value="config.titleFontColor"
              show-alpha
              @active-change="handleColorActiveChange('titleFontColor', $event)"
              @change="handleColorChange('titleFontColor', $event)"
            />
          </div>
        </div>
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.titlePosition.x"
              @change="
                updatePosition(
                  'titlePosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.titlePosition.y"
              @change="
                updatePosition(
                  'titlePosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ④ 电源开关 ═══════════════════ -->
      <el-collapse-item :name="'power'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.powerSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.powerIconSize ?? 18"
              @change="
                updateConfig(
                  'powerIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.powerIconColor") }}</label>
            <el-color-picker
              :model-value="config.powerIconColor"
              show-alpha
              @active-change="handleColorActiveChange('powerIconColor', $event)"
              @change="handleColorChange('powerIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.powerActiveColor") }}</label>
            <el-color-picker
              :model-value="config.powerActiveColor"
              show-alpha
              @active-change="
                handleColorActiveChange('powerActiveColor', $event)
              "
              @change="handleColorChange('powerActiveColor', $event)"
            />
          </div>
        </div>
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.powerPosition.x"
              @change="
                updatePosition(
                  'powerPosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.powerPosition.y"
              @change="
                updatePosition(
                  'powerPosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ⑤ 仪表盘 ═══════════════════ -->
      <el-collapse-item :name="'gauge'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.gaugeSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.gaugeSize") }}</label>
            <input
              type="number"
              min="40"
              step="1"
              :value="config.gaugeSize"
              @change="
                updateConfig(
                  'gaugeSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.minValue") }}</label>
            <input
              type="number"
              :value="config.gaugeMin"
              @change="
                updateConfig(
                  'gaugeMin',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.maxValue") }}</label>
            <input
              type="number"
              :value="config.gaugeMax"
              @change="
                updateConfig(
                  'gaugeMax',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.unit") }}</label>
            <input
              type="text"
              :value="config.gaugeUnit"
              @input="
                updateConfig(
                  'gaugeUnit',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.step") }}</label>
            <input
              type="number"
              :min="0.1"
              :step="0.1"
              :value="config.gaugeStep"
              @change="
                updateConfig(
                  'gaugeStep',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.trackWidth") }}</label>
            <input
              type="number"
              min="1"
              :value="config.gaugeTrackWidth"
              @change="
                updateConfig(
                  'gaugeTrackWidth',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.trackColor") }}</label>
            <el-color-picker
              :model-value="config.gaugeTrackColor"
              show-alpha
              @active-change="
                handleColorActiveChange('gaugeTrackColor', $event)
              "
              @change="handleColorChange('gaugeTrackColor', $event)"
            />
          </div>
        </div>

        <!-- 填充渐变色 -->
        <div class="form-row form-row--gradient-title">
          <div class="form-group form-group--gradient-title">
            <label>{{ t("componentConfig.fillBackgroundColor") }}</label>
          </div>
        </div>
        <div class="form-row form-row--gradient-pickers">
          <div class="form-group form-group--gradient-pickers-inner">
            <el-color-picker
              v-for="(_, index) in gaugeGradientColors"
              :key="index"
              :model-value="gaugeGradientColors[index]"
              show-alpha
              @active-change="handleGaugeGradientActiveChange(index, $event)"
              @change="handleGaugeGradientChange(index, $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.fontSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.gaugeFontSize"
              @change="
                updateConfig(
                  'gaugeFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.fontColor") }}</label>
            <el-color-picker
              :model-value="config.gaugeFontColor"
              show-alpha
              @active-change="handleColorActiveChange('gaugeFontColor', $event)"
              @change="handleColorChange('gaugeFontColor', $event)"
            />
          </div>
        </div>

        <!-- 位置 -->
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.gaugePosition.x"
              @change="
                updatePosition(
                  'gaugePosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.gaugePosition.y"
              @change="
                updatePosition(
                  'gaugePosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ⑥ 当前值 ═══════════════════ -->
      <el-collapse-item :name="'current'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.currentValueSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.label") }}</label>
            <input
              type="text"
              :value="config.currentValueLabel"
              @input="
                updateConfig(
                  'currentValueLabel',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.unit") }}</label>
            <input
              type="text"
              :value="config.currentValueUnit"
              @input="
                updateConfig(
                  'currentValueUnit',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.fontSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.currentValueFontSize"
              @change="
                updateConfig(
                  'currentValueFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.fontColor") }}</label>
            <el-color-picker
              :model-value="config.currentValueFontColor"
              show-alpha
              @active-change="
                handleColorActiveChange('currentValueFontColor', $event)
              "
              @change="handleColorChange('currentValueFontColor', $event)"
            />
          </div>
        </div>
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.currentValuePosition.x"
              @change="
                updatePosition(
                  'currentValuePosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.currentValuePosition.y"
              @change="
                updatePosition(
                  'currentValuePosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ⑦ 模式图标 ═══════════════════ -->
      <el-collapse-item :name="'mode'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.modeIconSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.modeIconSize"
              @change="
                updateConfig(
                  'modeIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconBaseColor") }}</label>
            <el-color-picker
              :model-value="config.modeIconColor"
              show-alpha
              @active-change="handleColorActiveChange('modeIconColor', $event)"
              @change="handleColorChange('modeIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.iconTopColor") }}</label>
            <el-color-picker
              :model-value="config.modeActiveIconColor"
              show-alpha
              @active-change="
                handleColorActiveChange('modeActiveIconColor', $event)
              "
              @change="handleColorChange('modeActiveIconColor', $event)"
            />
          </div>
        </div>

        <!-- 模式值映射 -->
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.acModeAutoValue") }}</label>
            <input
              type="text"
              :value="config.modeAutoValue"
              @change="
                updateConfig(
                  'modeAutoValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.acModeCoolValue") }}</label>
            <input
              type="text"
              :value="config.modeCoolValue"
              @change="
                updateConfig(
                  'modeCoolValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.acModeHeatValue") }}</label>
            <input
              type="text"
              :value="config.modeHeatValue"
              @change="
                updateConfig(
                  'modeHeatValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.acModeFanValue") }}</label>
            <input
              type="text"
              :value="config.modeFanValue"
              @change="
                updateConfig(
                  'modeFanValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
        </div>

        <!-- 自定义循环模式组合 -->
        <label class="cycle-modes-title">{{ t("componentConfig.acModeIconCycleModes") }}</label>
        <div class="cycle-modes">
          <label
            v-for="mode in allModes"
            :key="mode.key"
            class="cycle-mode-item"
          >
            <input
              type="checkbox"
              :checked="isModeInCycle(mode.key)"
              @change="toggleMode(mode.key)"
            />
            <span class="cycle-mode-label">{{ mode.label }}</span>
          </label>
        </div>

        <!-- 位置 -->
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.modePosition.x"
              @change="
                updatePosition(
                  'modePosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.modePosition.y"
              @change="
                updatePosition(
                  'modePosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ═══════════════════ ⑧ 风速图标 ═══════════════════ -->
      <el-collapse-item :name="'fan'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.fanIconSection")
          }}</span>
        </template>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.fanIconSize"
              @change="
                updateConfig(
                  'fanIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconBaseColor") }}</label>
            <el-color-picker
              :model-value="config.fanIconColor"
              show-alpha
              @active-change="handleColorActiveChange('fanIconColor', $event)"
              @change="handleColorChange('fanIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.iconTopColor") }}</label>
            <el-color-picker
              :model-value="config.fanActiveIconColor"
              show-alpha
              @active-change="
                handleColorActiveChange('fanActiveIconColor', $event)
              "
              @change="handleColorChange('fanActiveIconColor', $event)"
            />
          </div>
        </div>

        <!-- 风速值映射 -->
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.acFanSpeedAuto") }}</label>
            <input
              type="text"
              :value="config.fanAutoValue"
              @change="
                updateConfig(
                  'fanAutoValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.acFanSpeedLow") }}</label>
            <input
              type="text"
              :value="config.fanLowValue"
              @change="
                updateConfig(
                  'fanLowValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.acFanSpeedMedium") }}</label>
            <input
              type="text"
              :value="config.fanMediumValue"
              @change="
                updateConfig(
                  'fanMediumValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.acFanSpeedHigh") }}</label>
            <input
              type="text"
              :value="config.fanHighValue"
              @change="
                updateConfig(
                  'fanHighValue',
                  parseValue(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
        </div>

        <!-- 自定义循环风速档位组合 -->
        <label class="cycle-modes-title">{{ t("componentConfig.acFanSpeedIconCycleModes") }}</label>
        <div class="cycle-modes">
          <label
            v-for="speed in allFanSpeeds"
            :key="speed.key"
            class="cycle-mode-item"
          >
            <input
              type="checkbox"
              :checked="isFanInCycle(speed.key)"
              @change="toggleFan(speed.key)"
            />
            <span class="cycle-mode-label">{{ speed.label }}</span>
          </label>
        </div>

        <!-- 位置 -->
        <div class="position-row">
          <div class="form-group">
            <label>{{ t("componentConfig.xPosition") }}</label>
            <input
              type="number"
              :value="config.fanSpeedPosition.x"
              @change="
                updatePosition(
                  'fanSpeedPosition',
                  'x',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.yPosition") }}</label>
            <input
              type="number"
              :value="config.fanSpeedPosition.y"
              @change="
                updatePosition(
                  'fanSpeedPosition',
                  'y',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { usePointStore } from "@/stores/points";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type {
  ScadaComponent,
  AcController2ComponentConfig,
  AcControllerBindings,
  ZonePosition,
  PointBinding,
  AcModeKey,
  AcFanSpeedKey,
} from "../../../../types";

const { t } = useI18n();
const pointStore = usePointStore();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"ac-controller-2">,
);

// ═══════════════════════════════════════════════════════════════════════════════
// 折叠项控制（默认全部收缩）
// ═══════════════════════════════════════════════════════════════════════════════
const activeItems = ref<string[]>([]);

// ═══════════════════════════════════════════════════════════════════════════════
// 点位绑定操作
// ═══════════════════════════════════════════════════════════════════════════════

type BindingKey = keyof AcControllerBindings;

const currentBindings = computed<AcControllerBindings>(
  () =>
    config.value.bindings ?? {
      power: null,
      mode: null,
      fanSpeed: null,
      setpoint: null,
      currentValue: null,
    },
);

const getBindingPoints = (binding: PointBinding | null | undefined) => {
  if (!binding?.deviceId) return [];
  const device = pointStore.devices.find(
    (d) => d.asset === binding!.deviceId || d.name === binding!.deviceId,
  );
  return device?.points || [];
};

const handleDeviceChange = (key: BindingKey, deviceId: string) => {
  updateConfig("bindings", {
    ...currentBindings.value,
    [key]: deviceId ? { deviceId, pointName: "" } : null,
  });
};

const handlePointChange = (key: BindingKey, pointName: string) => {
  const binding = currentBindings.value[key];
  if (!binding || !pointName) {
    updateConfig("bindings", {
      ...currentBindings.value,
      [key]: null,
    });
    return;
  }
  const point = getBindingPoints(binding).find((p) => p.name === pointName);
  updateConfig("bindings", {
    ...currentBindings.value,
    [key]: {
      ...binding,
      pointName,
      pointDescription: point?.description,
      unit: point?.unit,
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 位置更新（x / y）
// ═══════════════════════════════════════════════════════════════════════════════

const updatePosition = (
  positionKey: keyof AcController2ComponentConfig,
  axis: "x" | "y",
  value: number,
) => {
  const position = (config.value as any)[positionKey] as
    | ZonePosition
    | undefined;
  if (!position) return;
  updateConfig(positionKey as any, { ...position, [axis]: value });
};

// ═══════════════════════════════════════════════════════════════════════════════
// 颜色选择器处理
// ═══════════════════════════════════════════════════════════════════════════════

type ColorField =
  | "backgroundColor"
  | "titleFontColor"
  | "powerIconColor"
  | "powerActiveColor"
  | "gaugeTrackColor"
  | "gaugeFontColor"
  | "currentValueFontColor"
  | "modeIconColor"
  | "modeActiveIconColor"
  | "fanIconColor"
  | "fanActiveIconColor";

const colorFields: ColorField[] = [
  "backgroundColor",
  "titleFontColor",
  "powerIconColor",
  "powerActiveColor",
  "gaugeTrackColor",
  "gaugeFontColor",
  "currentValueFontColor",
  "modeIconColor",
  "modeActiveIconColor",
  "fanIconColor",
  "fanActiveIconColor",
];

const latestColor = ref<Record<ColorField, string>>(
  Object.fromEntries(colorFields.map((f) => [f, ""])) as Record<
    ColorField,
    string
  >,
);

watch(
  () => colorFields.map((f) => (config.value as any)[f]),
  (values) => {
    colorFields.forEach((f, i) => {
      latestColor.value[f] = (values[i] as string) || "";
    });
  },
  { immediate: true },
);

const handleColorActiveChange = (field: ColorField, val: string | null) => {
  latestColor.value[field] = val || "";
};

const handleColorChange = (field: ColorField, val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  updateConfig(field, isCleared ? "" : latestColor.value[field]);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 仪表盘渐变色处理
// ═══════════════════════════════════════════════════════════════════════════════

const gaugeGradientColors = computed(() => {
  const gradient = config.value.gaugeFillGradient;
  if (gradient && gradient.length === 3) return gradient;
  const fallback = config.value.gaugeFillColor || "#00d4ff";
  return [fallback, fallback, fallback] as [string, string, string];
});

const latestGaugeGradient = ref<string[]>(["#00d4ff", "#00d4ff", "#00d4ff"]);
watch(
  gaugeGradientColors,
  (vals) => {
    latestGaugeGradient.value = [...vals];
  },
  { immediate: true },
);

const handleGaugeGradientActiveChange = (index: number, val: string | null) => {
  latestGaugeGradient.value[index] = val || "";
};

const handleGaugeGradientChange = (index: number, val: string | null) => {
  const isCleared = val === null || val === undefined || val === "";
  const newColors = [...latestGaugeGradient.value];
  newColors[index] = isCleared ? "" : latestGaugeGradient.value[index];
  updateConfig("gaugeFillGradient", newColors);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 数值映射解析（字符串 → number | string）
// ═══════════════════════════════════════════════════════════════════════════════

const parseValue = (value: string): number | string => {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const num = Number(trimmed);
  return Number.isNaN(num) ? trimmed : num;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 模式循环组合（参考 ac-mode-icon 实现）
// ═══════════════════════════════════════════════════════════════════════════════

/** 所有可选模式（固定顺序） */
const allModes = computed<{ key: AcModeKey; label: string }[]>(() => [
  { key: "auto", label: t("scadaComponents.acModeAuto") },
  { key: "cool", label: t("scadaComponents.acModeCool") },
  { key: "heat", label: t("scadaComponents.acModeHeat") },
  { key: "fan", label: t("scadaComponents.acModeFan") },
]);

/** 判断某模式是否在循环列表中（带向后兼容 fallback） */
const isModeInCycle = (key: AcModeKey): boolean => {
  const list = config.value.modeCycleModes;
  if (!Array.isArray(list)) return true; // 旧数据无此字段，默认全部参与
  return list.includes(key);
};

/** 切换某模式的勾选状态（至少保留一个） */
const toggleMode = (key: AcModeKey) => {
  const list: AcModeKey[] = Array.isArray(config.value.modeCycleModes)
    ? [...config.value.modeCycleModes]
    : ["auto", "cool", "heat", "fan"];

  const index = list.indexOf(key);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(key);
  }

  // 至少保留一个模式参与循环
  const finalList: AcModeKey[] = list.length > 0 ? list : [key];
  updateConfig("modeCycleModes", finalList);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 风速循环组合（参考 ac-fan-speed-icon 实现）
// ═══════════════════════════════════════════════════════════════════════════════

/** 所有可选风速档位（固定顺序） */
const allFanSpeeds = computed<{ key: AcFanSpeedKey; label: string }[]>(() => [
  { key: "auto", label: t("scadaComponents.acFanSpeedAuto") },
  { key: "low", label: t("scadaComponents.acFanSpeedLow") },
  { key: "medium", label: t("scadaComponents.acFanSpeedMedium") },
  { key: "high", label: t("scadaComponents.acFanSpeedHigh") },
]);

/** 判断某档位是否在循环列表中（带向后兼容 fallback） */
const isFanInCycle = (key: AcFanSpeedKey): boolean => {
  const list = config.value.fanCycleModes;
  if (!Array.isArray(list)) return true; // 旧数据无此字段，默认全部参与
  return list.includes(key);
};

/** 切换某档位的勾选状态（至少保留一个） */
const toggleFan = (key: AcFanSpeedKey) => {
  const list: AcFanSpeedKey[] = Array.isArray(config.value.fanCycleModes)
    ? [...config.value.fanCycleModes]
    : ["auto", "low", "medium", "high"];

  const index = list.indexOf(key);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(key);
  }

  // 至少保留一个档位参与循环
  const finalList: AcFanSpeedKey[] = list.length > 0 ? list : [key];
  updateConfig("fanCycleModes", finalList);
};
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
  background: linear-gradient(
    180deg,
    var(--scada-cyan) 0%,
    var(--scada-purple) 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}

/* el-collapse 样式覆盖 */
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

/* 点位绑定组 */
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

/* 表单 */
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
  align-items: center;
  justify-content: space-between;
}

.form-group--switch :deep(.el-switch) {
  margin-top: 4px;
}

.form-row--gradient-title {
  margin-top: 6px;
}

.form-group--gradient-title {
  margin-bottom: 4px;
}

.form-row--gradient-pickers {
  align-items: flex-start;
}

.form-group--gradient-pickers-inner {
  display: flex;
  gap: 4px;
  flex: 1;
}

.form-group--gradient-pickers-inner :deep(.el-color-picker) {
  flex: 1;
}

/* 位置行（两个并排） */
.position-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--border-light);
}

.position-row .form-group {
  flex: 1;
}

/* 循环模式勾选区域 */
.cycle-modes-title {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  margin-top: 8px;
  margin-bottom: 4px;
}

.cycle-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--border-light);
}

.cycle-mode-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.cycle-mode-item input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.cycle-mode-label {
  font-size: 12px;
  color: var(--text-primary);
}
</style>