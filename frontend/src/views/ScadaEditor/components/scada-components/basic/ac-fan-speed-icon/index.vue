<template>
  <!-- 空调风速图标切换组件：仅显示当前档位图标，点击循环切换 -->
  <div class="ac-fan-speed-icon-container" @click="handleCycleSpeed">
    <Icon
      v-if="currentSpeed"
      :name="currentSpeed.icon"
      :size="iconSize"
      type="dual-color"
      :color="{ normal: iconColor, active: activeIconColor }"
    />
    <Icon
      v-else
      name="unknownCircle"
      :size="iconSize"
      type="mono-line"
      :color="{ normal: iconColor }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import type { ScadaComponent, AcFanSpeedIconComponentConfig, AcFanSpeedKey } from "@/types/scada";
import { useScadaBinding } from "@/views/ScadaEditor/hooks";
import { Icon } from "@/icon/index";

// 组件入参
const props = defineProps<{
  component: ScadaComponent;
  /** 编辑器编辑态，编辑态禁止操作 */
  editing?: boolean;
}>();

// 组件配置 & 绑定变量
const speedConfig = computed(() => props.component.config as AcFanSpeedIconComponentConfig);
const bindingInfo = computed(() => props.component.binding);
const defaultVal = computed(
  () => speedConfig.value.currentValue ?? props.component.config.value,
);

// SCADA 读写钩子
const { currentValue, writeValue } = useScadaBinding(
  bindingInfo,
  {},
  defaultVal,
);

// 操作状态：是否正在下发指令
const isOperating = ref(false);

// 图标尺寸 & 颜色
const iconSize = computed(() => speedConfig.value?.iconSize ?? 28);
const iconColor = computed(() => speedConfig.value?.iconColor ?? "rgb(0,0,0,1)");
const activeIconColor = computed(
  () => speedConfig.value?.activeIconColor ?? "rgba(102,102,255,1)",
);

/**
 * 风速档位项结构
 */
interface SpeedItem {
  key: AcFanSpeedKey;
  icon: string;
  value: number | string;
}

/**
 * 各档位对应的图标名
 */
const speedIconMap: Record<AcFanSpeedKey, string> = {
  auto: "fanSpeedAuto",
  low: "fanSpeed1",
  medium: "fanSpeed2",
  high: "fanSpeed3",
};

/**
 * 各档位对应的数值映射
 */
const speedValueMap = computed<Record<AcFanSpeedKey, number | string>>(() => ({
  auto: speedConfig.value?.autoValue ?? 0,
  low: speedConfig.value?.lowValue ?? 1,
  medium: speedConfig.value?.mediumValue ?? 2,
  high: speedConfig.value?.highValue ?? 3,
}));

/**
 * 参与循环切换的档位列表（根据用户自定义 cycleModes）
 */
const cycleSpeedList = computed<SpeedItem[]>(() => {
  const configured = speedConfig.value?.cycleModes;
  const keys: AcFanSpeedKey[] =
    configured && configured.length > 0
      ? configured
      : (["auto", "low", "medium", "high"] as AcFanSpeedKey[]);
  const values = speedValueMap.value;

  return keys.map((key) => ({
    key,
    icon: speedIconMap[key],
    value: values[key],
  }));
});

/**
 * 当前值匹配的档位项（用于显示图标）
 */
const currentSpeed = computed<SpeedItem | null>(() => {
  const currVal = currentValue.value;
  if (currVal == null) return null;

  return (
    cycleSpeedList.value.find(
      (item) => String(item.value) === String(currVal),
    ) ?? null
  );
});

/**
 * 下一个要切换到的档位项
 */
const nextSpeed = computed<SpeedItem | null>(() => {
  const list = cycleSpeedList.value;
  if (list.length === 0) return null;

  const currVal = currentValue.value;
  // 找到当前值在列表中的索引
  const currIndex = list.findIndex(
    (item) => currVal != null && String(item.value) === String(currVal),
  );

  // 如果当前值匹配到列表项，取下一个；否则取列表第一项
  const nextIndex = currIndex >= 0 ? (currIndex + 1) % list.length : 0;
  return list[nextIndex];
});

/**
 * 点击循环切换空调风速
 */
const handleCycleSpeed = async () => {
  // 编辑态或下发中直接拦截
  if (props.editing || isOperating.value) return;

  const target = nextSpeed.value;
  if (!target) return;

  // 无绑定点位，仅本地更新值
  if (!bindingInfo.value) {
    currentValue.value = target.value;
    return;
  }

  isOperating.value = true;
  try {
    const res = await writeValue(target.value);
    if (!res.success) {
      ElMessage.error(res.message);
    }
  } catch (err) {
    const errorMsg =
      (err as any)?.response?.data?.detail ||
      (err instanceof Error
        ? err.message
        : "操作失败");
    ElMessage.error(errorMsg);
  } finally {
    isOperating.value = false;
  }
};
</script>

<style scoped>
.ac-fan-speed-icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.ac-fan-speed-icon-container:active {
  opacity: 0.7;
}
</style>
