<template>
  <!-- 空调模式图标切换组件：仅显示当前模式图标，点击循环切换 -->
  <div class="ac-mode-icon-container" @click="handleCycleMode">
    <Icon
      v-if="currentMode"
      :name="currentMode.icon"
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
import type { ScadaComponent, AcModeIconComponentConfig, AcModeKey } from "@/types/scada";
import { useScadaBinding } from "@/views/ScadaEditor/hooks";
import { Icon } from "@/icon/index";

// 组件入参
const props = defineProps<{
  component: ScadaComponent;
  /** 编辑器编辑态，编辑态禁止操作 */
  editing?: boolean;
}>();

// 组件配置 & 绑定变量
const acConfig = computed(() => props.component.config as AcModeIconComponentConfig);
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

// 操作状态：是否正在下发指令
const isOperating = ref(false);

// 图标尺寸 & 颜色
const iconSize = computed(() => acConfig.value?.iconSize ?? 28);
const iconColor = computed(() => acConfig.value?.iconColor ?? "rgb(0,0,0,1)");
const activeIconColor = computed(
  () => acConfig.value?.activeIconColor ?? "rgba(102,102,255,1)",
);

/**
 * 模式项结构
 */
interface ModeItem {
  key: AcModeKey;
  icon: string;
  value: number | string;
}

/**
 * 各模式对应的图标名
 */
const modeIconMap: Record<AcModeKey, string> = {
  auto: "auto",
  cool: "snow",
  heat: "sun",
  fan: "fan2",
};

/**
 * 各模式对应的数值映射
 */
const modeValueMap = computed<Record<AcModeKey, number | string>>(() => ({
  auto: acConfig.value?.autoValue ?? 0,
  cool: acConfig.value?.coolValue ?? 1,
  heat: acConfig.value?.heatValue ?? 2,
  fan: acConfig.value?.fanValue ?? 3,
}));

/**
 * 参与循环切换的模式列表（根据用户自定义 cycleModes）
 */
const cycleModeList = computed<ModeItem[]>(() => {
  const configured = acConfig.value?.cycleModes;
  const keys: AcModeKey[] =
    configured && configured.length > 0
      ? configured
      : (["auto", "cool", "heat", "fan"] as AcModeKey[]);
  const values = modeValueMap.value;

  return keys.map((key) => ({
    key,
    icon: modeIconMap[key],
    value: values[key],
  }));
});

/**
 * 当前值匹配的模式项（用于显示图标）
 */
const currentMode = computed<ModeItem | null>(() => {
  const currVal = currentValue.value;
  if (currVal == null) return null;

  return (
    cycleModeList.value.find(
      (item) => String(item.value) === String(currVal),
    ) ?? null
  );
});

/**
 * 下一个要切换到的模式项
 */
const nextMode = computed<ModeItem | null>(() => {
  const list = cycleModeList.value;
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
 * 点击循环切换空调模式
 */
const handleCycleMode = async () => {
  // 编辑态或下发中直接拦截
  if (props.editing || isOperating.value) return;

  const target = nextMode.value;
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
.ac-mode-icon-container {
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

.ac-mode-icon-container:active {
  opacity: 0.7;
}
</style>
