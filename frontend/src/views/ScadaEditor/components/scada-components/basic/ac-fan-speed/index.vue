<template>
  <!-- 空调风速选择组件 -->
  <div
    class="ac-fan-speed-container"
    :style="containerStyle"
  >
    <button
      v-for="mode in fanSpeedList"
      :key="mode.key"
      class="ac-fan-speed-button"
      :class="{ active: mode.isActive, writing: isOperating && pendingValue === mode.value }"
      :style="mode.buttonStyle"
      :disabled="isOperating"
      @click="handleSelectMode(mode)"
    >
      <span class="ac-fan-speed-label" :style="mode.labelStyle">
        {{ mode.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { ScadaComponent, AcFanSpeedComponentConfig } from "@/types/scada";
import { useScadaBinding } from "@/views/ScadaEditor/hooks";

const { t } = useI18n();

// 组件入参
const props = defineProps<{
  config: ScadaComponent;
  /** 编辑器编辑态，编辑态禁止操作 */
  editing?: boolean;
}>();

// 组件配置 & 绑定变量
const acConfig = computed(() => props.config.config as AcFanSpeedComponentConfig);
const bindingInfo = computed(() => props.config.binding);
const defaultVal = computed(
  () => acConfig.value.currentValue ?? props.config.config.value,
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

/**
 * 风速项结构（显式声明，避免 any 导致类型推断自引用）
 */
interface FanSpeedItem {
  key: string;
  label: string;
  value: number | string;
  isActive: boolean;
  buttonStyle: {
    backgroundColor: string;
    borderRadius: string;
  };
  labelStyle: {
    color: string;
    fontSize: string;
  };
}

/**
 * 各风速对应的数值映射
 */
const fanSpeedValueMap = computed(() => ({
  auto: acConfig.value?.autoValue ?? 0,
  high: acConfig.value?.highValue ?? 3,
  medium: acConfig.value?.mediumValue ?? 2,
  low: acConfig.value?.lowValue ?? 1,
}));

/**
 * 构建单个风速项（包含样式）
 */
const buildFanSpeedItem = (
  key: string,
  label: string,
  value: number | string,
  cfg: AcFanSpeedComponentConfig,
  currVal: number | string | null,
): FanSpeedItem => {
  // eslint-disable-next-line eqeqeq
  const active = currVal != null && currVal == value;

  return {
    key,
    label,
    value,
    isActive: active,
    buttonStyle: {
      backgroundColor: active
        ? cfg.activeBackgroundColor
        : "transparent",
      borderRadius: `${cfg.borderRadius ?? 8}px`,
    },
    labelStyle: {
      color: active
        ? cfg.activeFontColor || "#ffffff"
        : cfg.fontColor || "rgba(255,255,255,0.7)",
      fontSize: `${cfg.fontSize ?? 11}px`,
    },
  };
};

/**
 * 容器样式
 */
const containerStyle = computed(() => ({
  backgroundColor:
    acConfig.value?.backgroundColor || "rgba(255, 255, 255, 0.1)",
  borderRadius: `${acConfig.value?.borderRadius ?? 8}px`,
}));

/**
 * 风速列表（整合国际化、数值、激活状态、样式）
 */
const fanSpeedList = computed<FanSpeedItem[]>(() => {
  const cfg = acConfig.value;
  const valueMap = fanSpeedValueMap.value;
  const currVal = currentValue.value;

  return [
    buildFanSpeedItem(
      "auto",
      t("scadaComponents.acFanSpeedAuto"),
      valueMap.auto,
      cfg,
      currVal,
    ),
    buildFanSpeedItem(
      "low",
      t("scadaComponents.acFanSpeedLow"),
      valueMap.low,
      cfg,
      currVal,
    ),
    buildFanSpeedItem(
      "medium",
      t("scadaComponents.acFanSpeedMedium"),
      valueMap.medium,
      cfg,
      currVal,
    ),
    buildFanSpeedItem(
      "high",
      t("scadaComponents.acFanSpeedHigh"),
      valueMap.high,
      cfg,
      currVal,
    ),
  ];
});

/**
 * 点击切换空调风速
 * @param mode 选中的风速项
 */
const handleSelectMode = async (mode: FanSpeedItem) => {
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
.ac-fan-speed-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 4px;
  box-sizing: border-box;
  gap: 4px;
}

.ac-fan-speed-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  padding: 4px 2px;
  background: transparent;
}

.ac-fan-speed-button:hover:not(:disabled) {
  opacity: 0.85;
}

.ac-fan-speed-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ac-fan-speed-button.writing {
  opacity: 0.7;
}

.ac-fan-speed-label {
  line-height: 1;
  font-weight: 400;
  white-space: nowrap;
}
</style>
