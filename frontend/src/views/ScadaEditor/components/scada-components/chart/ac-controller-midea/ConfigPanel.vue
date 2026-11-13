<template>
  <div class="config-section">
    <div class="section-title">
      {{ t("componentConfig.acControllerMideaConfig") }}
    </div>

    <el-collapse v-model="activeItems" class="config-collapse">
      <!-- ① 点位绑定 -->
      <el-collapse-item :name="'bindings'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.bindingsSection")
          }}</span>
        </template>

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

      <!-- ② 画布卡片外观 -->
      <el-collapse-item :name="'card'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.cardSection")
          }}</span>
        </template>

        <div class="form-group">
          <label>{{ t("componentConfig.cardTitle") }}</label>
          <input
            type="text"
            :value="translated.cardTitle"
            @input="
              updateConfig(
                'cardTitle',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.cardTitleFontSize") }}</label>
            <input
              type="number"
              min="1"
              :value="config.cardTitleFontSize"
              @change="
                updateConfig(
                  'cardTitleFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.cardTitleColor") }}</label>
            <el-color-picker
              :model-value="config.cardTitleColor"
              show-alpha
              @change="handleColorChange('cardTitleColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.cardBackgroundColor") }}</label>
            <el-color-picker
              :model-value="config.cardBackgroundColor"
              show-alpha
              @change="handleColorChange('cardBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.borderRadius") }}</label>
            <input
              type="number"
              min="0"
              :value="config.cardBorderRadius"
              @change="
                updateConfig(
                  'cardBorderRadius',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.valueFontSize") }}</label>
            <input
              type="number"
              min="8"
              :value="config.cardValueFontSize"
              @change="
                updateConfig(
                  'cardValueFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.unitFontSizeLabel") }}</label>
            <input
              type="number"
              min="8"
              :value="config.cardUnitFontSize"
              @change="
                updateConfig(
                  'cardUnitFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.activeAccentColor") }}</label>
            <el-color-picker
              :model-value="config.activeAccentColor"
              show-alpha
              @change="handleColorChange('activeAccentColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="12"
              :value="config.cardIconSize"
              @change="
                updateConfig(
                  'cardIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ③ 弹框外观 + 主区域 -->
      <el-collapse-item :name="'dialog'">
        <template #title>
          <span class="collapse-title"
            >{{ t("componentConfig.dialogSection") }} /
            {{ t("componentConfig.mainAreaSection") }}</span
          >
        </template>

        <div class="form-group">
          <label>{{ t("componentConfig.editModeOpenDialog") }}</label>
          <el-switch
            :model-value="config.editModeOpenDialog"
            @update:model-value="updateConfig('editModeOpenDialog', $event)"
          />
        </div>

        <!-- 弹框容器 -->
        <div class="divider-label">
          {{ t("componentConfig.dialogContainerSection") }}
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.width") }}</label>
            <input
              type="number"
              min="200"
              :value="config.dialogWidth"
              @change="
                updateConfig(
                  'dialogWidth',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.borderRadius") }}</label>
            <input
              type="number"
              min="0"
              :value="config.dialogBorderRadius"
              @change="
                updateConfig(
                  'dialogBorderRadius',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-group">
          <label>{{ t("componentConfig.backgroundColor") }}</label>
          <el-color-picker
            :model-value="config.dialogBackgroundColor"
            show-alpha
            @change="handleColorChange('dialogBackgroundColor', $event)"
          />
        </div>

        <!-- 弹框标题 -->
        <div class="divider-label">
          {{ t("componentConfig.dialogTitleSection") }}
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.mainTitle") }}</label>
            <input
              type="text"
              :value="translated.dialogTitle"
              @input="
                updateConfig(
                  'dialogTitle',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.subTitle") }}</label>
            <input
              type="text"
              :value="translated.dialogSubtitle"
              @input="
                updateConfig(
                  'dialogSubtitle',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label
              >{{ t("componentConfig.mainTitle")
              }}{{ t("componentConfig.fontSize") }}</label
            >
            <input
              type="number"
              min="8"
              :value="config.dialogTitleFontSize"
              @change="
                updateConfig(
                  'dialogTitleFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label
              >{{ t("componentConfig.subTitle")
              }}{{ t("componentConfig.fontSize") }}</label
            >
            <input
              type="number"
              min="8"
              :value="config.dialogSubtitleFontSize"
              @change="
                updateConfig(
                  'dialogSubtitleFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label
              >{{ t("componentConfig.mainTitle")
              }}{{ t("componentConfig.fontColor") }}</label
            >
            <el-color-picker
              :model-value="config.dialogTitleColor"
              show-alpha
              @change="handleColorChange('dialogTitleColor', $event)"
            />
          </div>
          <div class="form-group">
            <label
              >{{ t("componentConfig.subTitle")
              }}{{ t("componentConfig.fontColor") }}</label
            >
            <el-color-picker
              :model-value="config.dialogSubtitleColor"
              show-alpha
              @change="handleColorChange('dialogSubtitleColor', $event)"
            />
          </div>
        </div>
        <!-- 主区域 - 渐变背景 -->
        <div class="divider-label">
          {{ t("componentConfig.mainAreaGradientSection") }}
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.gradientStartColor") }}</label>
            <el-color-picker
              :model-value="config.mainAreaGradient[0]"
              show-alpha
              @change="(v) => updateGradient(0, v)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.gradientEndColor") }}</label>
            <el-color-picker
              :model-value="config.mainAreaGradient[1]"
              show-alpha
              @change="(v) => updateGradient(1, v)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.gradientAngle") }}</label>
            <input
              type="number"
              :value="config.mainAreaGradientAngle"
              @change="
                updateConfig(
                  'mainAreaGradientAngle',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.borderRadius") }}</label>
            <input
              type="number"
              min="0"
              :value="config.mainAreaBorderRadius"
              @change="
                updateConfig(
                  'mainAreaBorderRadius',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <!-- 主区域 - 核心显示 + 电源 -->
        <div class="divider-label">
          {{ t("componentConfig.mainAreaCoreSection") }}
        </div>
        <div class="form-row">
          <div class="form-group">
            <label
              >{{ t("componentConfig.mainAreaSection")
              }}{{ t("componentConfig.fontSize") }}</label
            >
            <input
              type="number"
              min="10"
              :value="config.mainAreaFontSize"
              @change="
                updateConfig(
                  'mainAreaFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label
              >{{ t("componentConfig.mainAreaSection")
              }}{{ t("componentConfig.fontColor") }}</label
            >
            <el-color-picker
              :model-value="config.mainAreaTextColor"
              show-alpha
              @change="handleColorChange('mainAreaTextColor', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.decimalPlaces") }}</label>
            <input
              type="number"
              min="0"
              max="6"
              :value="config.cardValueDecimalPlaces"
              @change="
                updateConfig(
                  'cardValueDecimalPlaces',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
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
        </div>

        <div class="form-row">
          <div class="form-group">
            <label
              >{{ t("componentConfig.unit")
              }}{{ t("componentConfig.fontSize") }}</label
            >
            <input
              type="number"
              min="8"
              :value="config.gaugeUnitFontSize"
              @change="
                updateConfig(
                  'gaugeUnitFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label
              >{{ t("componentConfig.unit")
              }}{{ t("componentConfig.fontColor") }}</label
            >
            <el-color-picker
              :model-value="config.gaugeUnitColor"
              show-alpha
              @change="handleColorChange('gaugeUnitColor', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.powerButtonSize") }}</label>
            <input
              type="number"
              min="20"
              :value="config.powerButtonSize"
              @change="
                updateConfig(
                  'powerButtonSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.powerBtnIconColor") }}</label>
            <el-color-picker
              :model-value="config.powerButtonIconColor"
              show-alpha
              @change="handleColorChange('powerButtonIconColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.powerBtnOffBg") }}</label>
            <el-color-picker
              :model-value="config.powerButtonOffColor"
              show-alpha
              @change="handleColorChange('powerButtonOffColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.powerBtnOnBg") }}</label>
            <el-color-picker
              :model-value="config.powerButtonOnColor"
              show-alpha
              @change="handleColorChange('powerButtonOnColor', $event)"
            />
          </div>
        </div>

        <!-- 主区域 - 温度调节 -->
        <div class="divider-label">
          {{ t("componentConfig.mainAreaRangeSection") }}
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
          <div class="form-group">
            <label>{{ t("componentConfig.stepBtnIconSize") }}</label>
            <input
              type="number"
              min="8"
              :value="config.stepButtonIconSize"
              @change="
                updateConfig(
                  'stepButtonIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.stepBtnBgColor") }}</label>
            <el-color-picker
              :model-value="config.stepButtonBackgroundColor"
              show-alpha
              @change="handleColorChange('stepButtonBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.stepBtnIconColor") }}</label>
            <el-color-picker
              :model-value="config.stepButtonColor"
              show-alpha
              @change="handleColorChange('stepButtonColor', $event)"
            />
          </div>
        </div>

        <!-- 当前值行 -->
        <div class="divider-label">{{ t("componentConfig.currentValue") }}</div>
        <div class="form-group">
          <label>{{ t("componentConfig.currentValueLabel") }}</label>
          <input
            type="text"
            :value="translated.currentValueLabel"
            @input="
              updateConfig(
                'currentValueLabel',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.valueFontSize") }}</label>
            <input
              type="number"
              min="8"
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
            <label>{{ t("componentConfig.valueColor") }}</label>
            <el-color-picker
              :model-value="config.currentValueColor"
              show-alpha
              @change="handleColorChange('currentValueColor', $event)"
            />
          </div>
        </div>

        <!-- 状态文字 -->
        <div class="divider-label">
          {{ t("componentConfig.statusTextSection") }}
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.showStatusText") }}</label>
            <el-switch
              :model-value="config.showMainAreaStatusText"
              @update:model-value="
                updateConfig('showMainAreaStatusText', $event)
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.statusTextColor") }}</label>
            <el-color-picker
              :model-value="config.mainAreaStatusTextColor"
              show-alpha
              @change="handleColorChange('mainAreaStatusTextColor', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.statusTextFontSize") }}</label>
            <input
              type="number"
              min="8"
              :value="config.mainAreaStatusTextFontSize"
              @change="
                updateConfig(
                  'mainAreaStatusTextFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ④ 模式配置（5 按钮 + 自动×4 组合） -->
      <el-collapse-item :name="'mode'">
        <template #title>
          <span class="collapse-title">
            {{ t("componentConfig.modeSection") }}
          </span>
        </template>

        <div class="form-group">
          <label>{{ t("componentConfig.sectionTitle") }}</label>
          <input
            type="text"
            :value="translated.modeSectionTitle"
            @input="
              updateConfig(
                'modeSectionTitle',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="12"
              :value="config.modeIconSize"
              @change="
                updateConfig(
                  'modeIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.fontSize") }}</label>
            <input
              type="number"
              min="10"
              :value="config.modeFontSize"
              @change="
                updateConfig(
                  'modeFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.backgroundColor") }}</label>
            <el-color-picker
              :model-value="config.modeBackgroundColor"
              show-alpha
              @change="handleColorChange('modeBackgroundColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.activeBackgroundColor") }}</label>
            <el-color-picker
              :model-value="config.modeActiveBackgroundColor"
              show-alpha
              @change="handleColorChange('modeActiveBackgroundColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconColor") }}</label>
            <el-color-picker
              :model-value="config.modeIconColor"
              show-alpha
              @change="handleColorChange('modeIconColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.activeIconColor") }}</label>
            <el-color-picker
              :model-value="config.modeActiveIconColor"
              show-alpha
              @change="handleColorChange('modeActiveIconColor', $event)"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.fontColor") }}</label>
            <el-color-picker
              :model-value="config.modeFontColor"
              show-alpha
              @change="handleColorChange('modeFontColor', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.activeFontColor") }}</label>
            <el-color-picker
              :model-value="config.modeActiveFontColor"
              show-alpha
              @change="handleColorChange('modeActiveFontColor', $event)"
            />
          </div>
        </div>

        <div class="divider-label">{{ t("componentConfig.modeLevels") }}</div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeAuto') }}</label>
            <input
              type="text"
              :value="config.modeAutoValue"
              @change="parseAndUpdate('modeAutoValue', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeCool') }}</label>
            <input
              type="text"
              :value="config.modeCoolValue"
              @change="parseAndUpdate('modeCoolValue', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeHeat') }}</label>
            <input
              type="text"
              :value="config.modeHeatValue"
              @change="parseAndUpdate('modeHeatValue', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('componentConfig.acModeDehumidifyLabel') }}</label>
            <input
              type="text"
              :value="config.modeDehumidifyValue"
              @change="parseAndUpdate('modeDehumidifyValue', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeFan') }}</label>
            <input
              type="text"
              :value="config.modeFanValue"
              @change="parseAndUpdate('modeFanValue', $event)"
            />
          </div>
          
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeAuto') }}{{ t('scadaComponents.acModeCool') }}</label>
            <input
              type="text"
              :value="config.modeAutoCoolValue"
              @change="parseAndUpdate('modeAutoCoolValue', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeAuto') }}{{ t('scadaComponents.acModeHeat') }}</label>
            <input
              type="text"
              :value="config.modeAutoHeatValue"
              @change="parseAndUpdate('modeAutoHeatValue', $event)"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeAuto') }}{{ t('componentConfig.acModeDehumidifyLabel') }}</label>
            <input
              type="text"
              :value="config.modeAutoDehumidifyValue"
              @change="parseAndUpdate('modeAutoDehumidifyValue', $event)"
            />
          </div>
          <div class="form-group">
            <label>{{ t('scadaComponents.acModeAuto') }}{{ t('scadaComponents.acModeFan') }}</label>
            <input
              type="text"
              :value="config.modeAutoFanValue"
              @change="parseAndUpdate('modeAutoFanValue', $event)"
            />
          </div>
        </div>
      </el-collapse-item>

      <!-- ⑤ 风速配置（自动 + 7 档独立 value） -->
      <el-collapse-item :name="'fan'">
        <template #title>
          <span class="collapse-title">{{
            t("componentConfig.fanSpeedSection")
          }}</span>
        </template>

        <div class="form-group">
          <label>{{ t("componentConfig.sectionTitle") }}</label>
          <input
            type="text"
            :value="translated.fanSectionTitle"
            @input="
              updateConfig(
                'fanSectionTitle',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.iconSize") }}</label>
            <input
              type="number"
              min="12"
              :value="config.fanIconSize"
              @change="
                updateConfig(
                  'fanIconSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.fontSize") }}</label>
            <input
              type="number"
              min="10"
              :value="config.fanFontSize"
              @change="
                updateConfig(
                  'fanFontSize',
                  +($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
        </div>

        <div class="divider-label">{{ t("componentConfig.sliderStyle") }}</div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t("componentConfig.barTrackColor") }}</label>
            <el-color-picker
              :model-value="config.fanLevelsTrackBackgroundColor"
              show-alpha
              @change="
                handleColorChange('fanLevelsTrackBackgroundColor', $event)
              "
            />
          </div>
          <div class="form-group">
            <label>{{ t("componentConfig.activeBackgroundColor") }}</label>
            <el-color-picker
              :model-value="config.fanLevelsActiveBackgroundColor"
              show-alpha
              @change="
                handleColorChange('fanLevelsActiveBackgroundColor', $event)
              "
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t("componentConfig.fontColor") }}</label>
          <el-color-picker
            :model-value="config.fanLevelsTextColor"
            show-alpha
            @change="handleColorChange('fanLevelsTextColor', $event)"
          />
        </div>

        <div class="divider-label">{{ t("componentConfig.fanLevels") }}</div>

        <!-- 自动 -->
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanAutoVisible"
            @update:model-value="updateConfig('fanAutoVisible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanAutoVisible"
            :value="translated.fanAutoLabel"
            @input="
              updateConfig(
                'fanAutoLabel',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanAutoVisible"
            :value="config.fanAutoValue"
            @change="parseAndUpdate('fanAutoValue', $event)"
          />
        </div>

        <!-- 7 档 -->
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel1Visible"
            @update:model-value="updateConfig('fanLevel1Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel1Visible"
            :value="translated.fanLevel1Label"
            @input="
              updateConfig(
                'fanLevel1Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel1Visible"
            :value="config.fanLevel1Value"
            @change="parseAndUpdate('fanLevel1Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel2Visible"
            @update:model-value="updateConfig('fanLevel2Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel2Visible"
            :value="translated.fanLevel2Label"
            @input="
              updateConfig(
                'fanLevel2Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel2Visible"
            :value="config.fanLevel2Value"
            @change="parseAndUpdate('fanLevel2Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel3Visible"
            @update:model-value="updateConfig('fanLevel3Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel3Visible"
            :value="translated.fanLevel3Label"
            @input="
              updateConfig(
                'fanLevel3Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel3Visible"
            :value="config.fanLevel3Value"
            @change="parseAndUpdate('fanLevel3Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel4Visible"
            @update:model-value="updateConfig('fanLevel4Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel4Visible"
            :value="translated.fanLevel4Label"
            @input="
              updateConfig(
                'fanLevel4Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel4Visible"
            :value="config.fanLevel4Value"
            @change="parseAndUpdate('fanLevel4Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel5Visible"
            @update:model-value="updateConfig('fanLevel5Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel5Visible"
            :value="translated.fanLevel5Label"
            @input="
              updateConfig(
                'fanLevel5Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel5Visible"
            :value="config.fanLevel5Value"
            @change="parseAndUpdate('fanLevel5Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel6Visible"
            @update:model-value="updateConfig('fanLevel6Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel6Visible"
            :value="translated.fanLevel6Label"
            @input="
              updateConfig(
                'fanLevel6Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel6Visible"
            :value="config.fanLevel6Value"
            @change="parseAndUpdate('fanLevel6Value', $event)"
          />
        </div>
        <div class="fan-level-row">
          <el-switch
            :model-value="config.fanLevel7Visible"
            @update:model-value="updateConfig('fanLevel7Visible', $event)"
          />
          <input
            type="text"
            class="level-label"
            :disabled="!config.fanLevel7Visible"
            :value="translated.fanLevel7Label"
            @input="
              updateConfig(
                'fanLevel7Label',
                ($event.target as HTMLInputElement).value,
              )
            "
          />
          <input
            type="text"
            class="level-value"
            :disabled="!config.fanLevel7Visible"
            :value="config.fanLevel7Value"
            @change="parseAndUpdate('fanLevel7Value', $event)"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePointStore } from "@/stores/points";
import { useScadaConfig } from "../../../../hooks/useScadaEditor";
import type {
  ScadaComponent,
  AcControllerBindings,
  PointBinding,
} from "../../../../types";

const { t } = useI18n();
const pointStore = usePointStore();

const props = defineProps<{
  component: ScadaComponent;
}>();

const { config, updateConfig } = useScadaConfig(
  props.component as ScadaComponent<"ac-controller-midea">,
);

// ── i18n 默认文本跟随：key 开头翻译，否则直接显示 ──
const resolve = (v: string | undefined) =>
  v?.startsWith("componentConfig.") || v?.startsWith("scadaComponents.")
    ? t(v)
    : v;
const resolveFanLevel = (level: string | undefined) => {
  if (!level) return level;
  if (/^\d+$/.test(level))
    return level + t("componentConfig.acFanLevelUnitLabel");
  return resolve(level);
};
const translated = computed(() => {
  const c = config.value;
  return {
    cardTitle: resolve(c.cardTitle),
    dialogTitle: resolve(c.dialogTitle),
    dialogSubtitle: resolve(c.dialogSubtitle),
    currentValueLabel: resolve(c.currentValueLabel),
    modeSectionTitle: resolve(c.modeSectionTitle),
    fanSectionTitle: resolve(c.fanSectionTitle),
    fanAutoLabel: resolve(c.fanAutoLabel),
    fanLevel1Label: resolveFanLevel(c.fanLevel1Label),
    fanLevel2Label: resolveFanLevel(c.fanLevel2Label),
    fanLevel3Label: resolveFanLevel(c.fanLevel3Label),
    fanLevel4Label: resolveFanLevel(c.fanLevel4Label),
    fanLevel5Label: resolveFanLevel(c.fanLevel5Label),
    fanLevel6Label: resolveFanLevel(c.fanLevel6Label),
    fanLevel7Label: resolveFanLevel(c.fanLevel7Label),
  };
});

const activeItems = ref<string[]>([]);

type BindingKey = keyof AcControllerBindings;

const currentBindings = ref<AcControllerBindings>(
  (config.value.bindings ?? {
    power: null,
    mode: null,
    fanSpeed: null,
    setpoint: null,
    currentValue: null,
  }) as AcControllerBindings,
);

const getBindingPoints = (binding: PointBinding | null | undefined) => {
  if (!binding?.deviceId) return [];
  const device = pointStore.devices.find(
    (d) => d.asset === binding!.deviceId || d.name === binding!.deviceId,
  );
  return device?.points || [];
};

const handleDeviceChange = (key: BindingKey, deviceId: string) => {
  currentBindings.value = {
    ...currentBindings.value,
    [key]: deviceId ? { deviceId, pointName: "" } : null,
  };
  updateConfig("bindings", currentBindings.value);
};

const handlePointChange = (key: BindingKey, pointName: string) => {
  const binding = currentBindings.value[key];
  if (!binding || !pointName) {
    currentBindings.value = { ...currentBindings.value, [key]: null };
    updateConfig("bindings", currentBindings.value);
    return;
  }
  const point = getBindingPoints(binding).find((p) => p.name === pointName);
  const newBinding: PointBinding = {
    ...binding,
    pointName,
    pointDescription: point?.description,
    unit: point?.unit,
  };
  currentBindings.value = { ...currentBindings.value, [key]: newBinding };
  updateConfig("bindings", currentBindings.value);
};

const updateGradient = (index: number, val: string | null) => {
  const current = [...config.value.mainAreaGradient] as [string, string];
  current[index] = val || current[index];
  updateConfig("mainAreaGradient", current);
};

const parseAndUpdate = (key: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  const trimmed = target.value.trim();
  if (trimmed === "") return;
  const num = Number(trimmed);
  updateConfig(key as any, Number.isNaN(num) ? trimmed : num);
};

const handleColorChange = (field: string, val: string | null) => {
  updateConfig(field as any, val || "");
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

.divider-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 8px;
  padding-top: 4px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
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

.mode-block {
  padding: 6px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
}
.mode-block:last-child {
  border-bottom: none;
}

.mode-block-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.mode-label {
  flex: 1.5;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}

.mode-value {
  flex: 0.8;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}

.mode-auto-values {
  margin-top: 6px;
  padding: 6px 10px;
  background: rgba(102, 126, 234, 0.06);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}
.mode-auto-values.disabled {
  opacity: 0.4;
}

.mode-auto-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mode-auto-row label {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 70px;
}
.mode-auto-row input {
  flex: 1;
  padding: 3px 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  font-size: 11px;
}

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
.level-value:disabled,
.mode-label:disabled,
.mode-value:disabled {
  background: rgba(0, 0, 0, 0.02);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}
</style>
