<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="true"
    :show-close="false"
    :teleported="false"
    :width="dialogWidth"
    :style="{ height: dialogHeight }"
    align-center
    class="config-dialog"
    modal-class="config-overlay"
  >
    <template #header>
      <div class="config-header">
        <span class="config-header__title">{{
          param.popupTitle || "配置弹窗"
        }}</span>
        <el-icon class="config-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="config-body" :style="bodyStyle">
      <div v-for="item in pointBindings" :key="item.id" class="config-item">
        <div class="config-item__row config-item__row--title">
          <span class="config-item__label">{{ item.displayName }}</span>
        </div>
        <div class="config-item__row config-item__row--action">
          <div
            v-if="item.triggerConfig?.mode === 'switch'"
            class="trigger-segmented"
          >
            <button
              class="trigger-btn"
              :class="{
                'trigger-btn--on': getSwitchState(item.id) === 'off',
                'trigger-btn--off': getSwitchState(item.id) !== 'off',
              }"
              @click="handleSwitchClick(item, 'off')"
            >
              {{ item.triggerConfig.offLabel || "关" }}
            </button>
            <button
              class="trigger-btn"
              :class="{
                'trigger-btn--on': getSwitchState(item.id) === 'on',
                'trigger-btn--off': getSwitchState(item.id) !== 'on',
              }"
              @click="handleSwitchClick(item, 'on')"
            >
              {{ item.triggerConfig.onLabel || "开" }}
            </button>
          </div>
          <div v-else class="trigger-input">
            <el-input
              :model-value="getInputValue(item.id)"
              @update:model-value="(val: string) => setInputValue(item.id, val)"
              :placeholder="item.triggerConfig?.label || item.displayName"
            />
          </div>
        </div>
      </div>

      <div v-if="pointBindings.length === 0" class="config-empty">
        暂无配置项
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Close } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { controlApi } from "@/api/control";
import { deviceApi } from "@/api/devices";
import { parseStandardPoints } from "@/utils/pointMapping";
import type { ConfigPopupParam, PopupPointBinding } from "@/types/configPopup";

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  param: ConfigPopupParam | Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const dialogVisible = ref(false);

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 400;

const popupWidth = computed(() => Number(props.param?.popupWidth) || 0);
const popupHeight = computed(() => Number(props.param?.popupHeight) || 0);

const dialogWidth = computed(() => {
  return popupWidth.value > DEFAULT_WIDTH
    ? `${popupWidth.value}px`
    : `${DEFAULT_WIDTH}px`;
});

const dialogHeight = computed(() => {
  return popupHeight.value > DEFAULT_HEIGHT
    ? `${popupHeight.value}px`
    : `${DEFAULT_HEIGHT}px`;
});

const bodyStyle = computed(() => {
  const h =
    popupHeight.value > DEFAULT_HEIGHT ? popupHeight.value : DEFAULT_HEIGHT;
  return { maxHeight: `${h - 48 - 24}px` };
});

const inputValues = ref<Map<string, string>>(new Map());

const pointBindings = computed<PopupPointBinding[]>(() => {
  const list = props.param?.popupPointBindings || [];
  return list.map((item) => {
    if (!inputValues.value.has(item.id)) {
      inputValues.value.set(item.id, "");
    }
    return item;
  });
});

const getInputValue = (id: string) => inputValues.value.get(id) ?? "";
const setInputValue = (id: string, val: string) =>
  inputValues.value.set(id, val);

const switchStates = ref<Map<string, "on" | "off">>(new Map());

const getSwitchState = (id: string) => switchStates.value.get(id) ?? "off";

const buildValueMap = (devices: any[]) => {
  const valueMap = new Map<string, any>();

  for (const device of devices) {
    const { standardPoints } = parseStandardPoints(device.standard_points);

    for (const [pointName, standardPoint] of standardPoints) {
      valueMap.set(`${device.asset}:${pointName}`, standardPoint.value);
    }

    if (device.data) {
      for (const [pointName, rawValue] of Object.entries(device.data)) {
        const key = `${device.asset}:${pointName}`;
        if (!valueMap.has(key)) {
          valueMap.set(key, rawValue);
        }
      }
    }
  }

  return valueMap;
};

const resolveValue = (item: PopupPointBinding, valueMap: Map<string, any>) => {
  const { pointInfo } = item;
  if (!pointInfo) return null;

  const key = `${pointInfo.deviceId}:${pointInfo.pointName || pointInfo.pointId}`;
  const value = valueMap.get(key);

  if (value === undefined || value === null) return null;

  if (item.triggerConfig?.mode === "switch") {
    const numValue = typeof value === "string" ? value.toLowerCase() : value;
    return numValue == 1 || numValue === "true" ? "on" : "off";
  }

  return String(value);
};

const loadPointValues = async () => {
  const bindings = props.param?.popupPointBindings;
  if (!bindings || bindings.length === 0) return;

  try {
    const res = await deviceApi.getLatest(false);
    if (!res.devices || !Array.isArray(res.devices)) return;

    const valueMap = buildValueMap(res.devices);

    for (const item of bindings) {
      const resolved = resolveValue(item, valueMap);
      if (resolved === null) continue;

      if (item.triggerConfig?.mode === "switch") {
        switchStates.value.set(item.id, resolved as "on" | "off");
      } else {
        inputValues.value.set(item.id, resolved as string);
      }
    }
  } catch (err) {
    console.error("Failed to load point values:", err);
  }
};

const handleSwitchClick = async (
  item: PopupPointBinding,
  state: 'on' | 'off'
) => {
  switchStates.value.set(item.id, state)

  const { pointInfo } = item
  if (!pointInfo) return

  const value = state === 'on' ? 1 : 0
  const targetService = pointInfo.service || pointInfo.deviceId
  const targetAsset = pointInfo.deviceId
  const point = pointInfo.pointName || pointInfo.pointId

  try {
    const result = await controlApi.writeSetpoint(
      targetService,
      targetAsset,
      point,
      value
    )

    if (result.status === "ACCEPTED" || result.status === "COMPLETED") {
      ElMessage.success(t("scada.writeValueDialog.success"));
    } else {
      ElMessage.warning(
        `${t("scada.writeValueDialog.result")} ${result.message}`,
      );
    }
  } catch (error) {
    console.error("Write value failed:", error);
    ElMessage.error(t("scada.writeValueDialog.failed"));
  }
};

watch(
  () => props.visible,
  async (val) => {
    dialogVisible.value = val;
    if (val) {
      await loadPointValues();
    }
  },
);

watch(dialogVisible, (val) => {
  emit("update:visible", val);
});

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss">
/* ==================== 遮罩层 ==================== */
.config-overlay {
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ==================== 弹窗容器 ==================== */
.config-dialog.el-dialog {
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--bg-modal);
  border: 1px solid var(--border-base);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
}

/* ==================== 头部 ==================== */
.config-dialog .el-dialog__header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 0;
  height: 48px;
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.config-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.config-header__close {
  font-size: 32px !important;
  color: var(--text-regular) !important;
  cursor: pointer;
  transition: color 0.2s;
  padding: 6px;
  border-radius: 4px;
}

.config-header__close:hover {
  color: var(--text-primary);
  background-color: var(--bg-base);
}

/* ==================== 主体 ==================== */
.config-dialog .el-dialog__body {
  padding: 8px 24px 16px;
}

.config-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.config-body::-webkit-scrollbar {
  width: 6px;
}

.config-body::-webkit-scrollbar-track {
  background: transparent;
}

.config-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.config-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.35);
}

/* ==================== 配置项 ==================== */
.config-item {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background-color 0.2s;
  background: rgba(255, 255, 255, 0.07);
}

.config-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.config-item__row {
  width: 100%;
}

.config-item__row--title {
  margin-bottom: 8px;
}

.config-item__row--action {
  display: flex;
}

.config-item__label {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
}

.trigger-segmented {
  display: inline-flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-base);
}

.trigger-btn {
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  background-color: var(--bg-base);
  color: var(--text-regular);
  cursor: pointer;
  transition: all 0.2s;
}

.trigger-btn:first-child {
  border-right: 1px solid var(--border-base);
}

.trigger-btn:hover {
  color: var(--text-primary);
}

.trigger-btn--on {
  background-color: var(--color-primary);
  color: #ffffff;
}

.trigger-btn--on:hover {
  background-color: var(--color-primary-hover);
  color: #ffffff;
}

.trigger-btn--off {
  background-color: var(--bg-base);
  color: var(--text-regular);
}

.trigger-btn--off:hover {
  background-color: var(--bg-base);
  color: var(--text-primary);
}

.trigger-input {
  width: 100%;
}

.trigger-input .el-input__wrapper {
  background-color: var(--bg-base);
  box-shadow: 0 0 0 1px var(--border-base) inset;
}

.trigger-input .el-input__inner {
  color: inherit;
}

.config-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  font-size: 14px;
  color: var(--text-placeholder);
}
</style>
