<template>
  <!-- 空调模式选择组件 -->
  <div class="ac-mode-container">
    <div
      v-for="mode in modeList"
      :key="mode.key"
      class="ac-mode-item"
      @click="handleSelectMode(mode)"
    >
      <!-- 图标容器 -->
      <div
        class="ac-mode-icon-wrapper"
        :class="{ active: mode.isActive }"
        :style="mode.wrapperStyle"
      >
        <Icon
          v-if="mode.isActive"
          :name="mode.icon"
          :size="iconSize"
          :color="{ normal: mode.activeIconColor }"
        />
        <Icon
          v-else
          :name="mode.icon"
          :size="iconSize"
          type="mono-line"
          :color="{ normal: mode.iconColor }"
        />
      </div>
      <!-- 模式文字标签 -->
      <span class="ac-mode-label" :style="mode.labelStyle">
        {{ mode.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { ScadaComponent, AcModeComponentConfig } from "@/types/scada";
import { useScadaBinding } from "@/views/ScadaEditor/hooks";
import { Icon } from "@/icon/index";

const { t } = useI18n();

// 组件入参
const props = defineProps<{
  component: ScadaComponent;
  /** 编辑器编辑态，编辑态禁止操作 */
  editing?: boolean;
}>();

// 组件配置 & 绑定变量
const acConfig = computed(() => props.component.config as AcModeComponentConfig);
const bindingInfo = computed(() => props.component.binding);
const defaultVal = computed(
  () => acConfig.value.currentValue ?? props.component.config.value,
);

// SCADA 读写钩子
const { currentValue, writeValue } = useScadaBinding(
  bindingInfo,
  {},
  defaultVal,
);

// 操作状态：是否正在下发指令、待下发值
const isOperating = ref(false);
const pendingValue = ref<number | string | null>(null);

// 图标尺寸
const iconSize = computed(() => acConfig.value?.iconSize ?? 24);

/**
 * 模式项结构（显式声明，避免 any 导致类型推断自引用）
 */
interface ModeItem {
  key: string;
  label: string;
  icon: string;
  value: number | string;
  isActive: boolean;
  wrapperStyle: {
    width: string;
    height: string;
    backgroundColor: string;
    borderColor: string;
  };
  iconColor: string;
  activeIconColor: string;
  labelStyle: {
    color: string;
    fontSize: string;
  };
}

/**
 * 各模式对应的数值映射
 */
const modeValueMap = computed(() => ({
  auto: acConfig.value?.autoValue ?? 0,
  cool: acConfig.value?.coolValue ?? 1,
  heat: acConfig.value?.heatValue ?? 2,
  fan: acConfig.value?.fanValue ?? 3,
}));

/**
 * 构建单个模式项（包含样式）
 */
const buildModeItem = (
  key: string,
  label: string,
  icon: string,
  value: number | string,
  cfg: AcModeComponentConfig,
  currVal: number | string | null,
  size: number,
): ModeItem => {
  // eslint-disable-next-line eqeqeq
  const active = currVal != null && currVal == value;

  return {
    key,
    label,
    icon,
    value,
    isActive: active,
    wrapperStyle: {
      width: `${size + 20}px`,
      height: `${size + 20}px`,
      backgroundColor:
        cfg.backgroundColor || "rgba(255, 255, 255, 0)",
      borderColor: active ? cfg.activeIconColor : cfg.iconColor,
    },
    iconColor: cfg.iconColor,
    activeIconColor: cfg.activeIconColor,
    labelStyle: {
      color: active
        ? cfg.activeFontColor || "#ffffff"
        : cfg.fontColor || "rgba(255,255,255,0.7)",
      fontSize: `${cfg.fontSize ?? 11}px`,
    },
  };
};

/**
 * 模式列表（整合国际化、图标、数值、激活状态、样式）
 */
const modeList = computed<ModeItem[]>(() => {
  const cfg = acConfig.value;
  const valueMap = modeValueMap.value;
  const currVal = currentValue.value;
  const size = iconSize.value;

  return [
    buildModeItem(
      "auto",
      t("scadaComponents.acModeAuto"),
      "auto",
      valueMap.auto,
      cfg,
      currVal,
      size,
    ),
    buildModeItem(
      "cool",
      t("scadaComponents.acModeCool"),
      "snow",
      valueMap.cool,
      cfg,
      currVal,
      size,
    ),
    buildModeItem(
      "heat",
      t("scadaComponents.acModeHeat"),
      "sun",
      valueMap.heat,
      cfg,
      currVal,
      size,
    ),
    buildModeItem(
      "fan",
      t("scadaComponents.acModeFan"),
      "fan2",
      valueMap.fan,
      cfg,
      currVal,
      size,
    ),
  ];
});

/**
 * 点击切换空调模式
 * @param mode 选中的模式项
 */
const handleSelectMode = async (mode: ModeItem) => {
  // 编辑态直接拦截
  if (props.editing) return;

  // 无绑定点位，仅本地更新值
  if (!bindingInfo.value) {
    currentValue.value = mode.value;
    return;
  }

  pendingValue.value = mode.value;
  isOperating.value = true;

  try {
    const res = await writeValue(mode.value);
    if (res.success) {
      ElMessage.success(t("scadaComponents.commandSent"));
    } else {
      ElMessage.error(res.message);
    }
  } catch (err) {
    // 捕获异常并提取错误信息
    const errorMsg =
      (err as any)?.response?.data?.detail ||
      (err instanceof Error
        ? err.message
        : t("scadaComponents.operationFailed"));
    ElMessage.error(errorMsg);
  } finally {
    // 重置操作状态
    isOperating.value = false;
    pendingValue.value = null;
  }
};
</script>

<style scoped>
.ac-mode-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
}

.ac-mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ac-mode-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.13);
}

.ac-mode-label {
  line-height: 1;
  font-weight: 400;
  white-space: nowrap;
}
</style>
