<template>
  <div class="config-modal-root">
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
          param.popupTitle || t("scada.configPopup.defaultTitle")
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
              {{ item.triggerConfig.offLabel || t("scada.configPopup.off") }}
            </button>
            <button
              class="trigger-btn"
              :class="{
                'trigger-btn--on': getSwitchState(item.id) === 'on',
                'trigger-btn--off': getSwitchState(item.id) !== 'on',
              }"
              @click="handleSwitchClick(item, 'on')"
            >
              {{ item.triggerConfig.onLabel || t("scada.configPopup.on") }}
            </button>
          </div>
          <div v-else class="trigger-input">
            <span class="trigger-input__label">
              {{ item.triggerConfig?.label || item.displayName }}
            </span>
            <div
              class="trigger-input__field"
              :class="{ 'is-placeholder': !getInputValue(item.id) }"
              @click="openKeypad(item)"
            >
              {{ getInputValue(item.id) || item.triggerConfig?.label || item.displayName }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="pointBindings.length === 0" class="config-empty">
        {{ t("scada.configPopup.empty") }}
      </div>
    </div>
    </el-dialog>
  </div>

  <teleport to="body">
    <div v-if="showKeypad" class="keypad-mask" @click.self="closeKeypad">
      <div class="keypad-panel">
        <div class="keypad-header">
          <span class="keypad-title">
            {{ keypadTargetItem?.triggerConfig?.label || keypadTargetItem?.displayName || t("scada.configPopup.keypadTitle") }}
          </span>
          <span class="keypad-display">{{ keypadValue || "0" }}</span>
        </div>

        <div class="keypad-grid">
          <div class="keypad-row">
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('1')">1</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('2')">2</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('3')">3</button>
            <button class="keypad-btn keypad-btn--action keypad-btn--del" @click="handleKeypadInput('del')">⌫</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('4')">4</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('5')">5</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('6')">6</button>
            <button class="keypad-btn keypad-btn--action keypad-btn--clear" @click="handleKeypadInput('clear')">C</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('7')">7</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('8')">8</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('9')">9</button>
            <button class="keypad-btn keypad-btn--toggle" @click="handleKeypadInput('negate')">+/-</button>
          </div>
          <div class="keypad-row">
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('0')">0</button>
            <button class="keypad-btn keypad-btn--num" @click="handleKeypadInput('.')">.</button>
            <button class="keypad-btn keypad-btn--cancel" @click="closeKeypad">{{ t("scada.configPopup.cancel") }}</button>
            <button class="keypad-btn keypad-btn--confirm" @click="handleKeypadConfirm">{{ t("scada.configPopup.confirm") }}</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
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

const activeInputId = ref<string | null>(null);
const keypadValue = ref<string>("");
const showKeypad = ref(false);

const keypadTargetItem = computed<PopupPointBinding | null>(() => {
  if (!activeInputId.value) return null;
  const list = props.param?.popupPointBindings || [];
  return list.find((item) => item.id === activeInputId.value) || null;
});

const openKeypad = (item: PopupPointBinding) => {
  activeInputId.value = item.id;
  keypadValue.value = "";
  showKeypad.value = true;
};

const closeKeypad = () => {
  showKeypad.value = false;
  activeInputId.value = null;
  keypadValue.value = "";
};

const handleKeypadInput = (key: string) => {
  if (key === "del") {
    keypadValue.value = keypadValue.value.slice(0, -1);
  } else if (key === "clear") {
    keypadValue.value = "";
  } else if (key === "negate") {
    if (keypadValue.value === "" || keypadValue.value === "0") return;
    if (keypadValue.value.startsWith("-")) {
      keypadValue.value = keypadValue.value.slice(1);
    } else {
      keypadValue.value = "-" + keypadValue.value;
    }
  } else if (key === ".") {
    if (!keypadValue.value.includes(".")) {
      keypadValue.value += ".";
    }
  } else {
    if (keypadValue.value === "0" && key === "0") return;
    if (keypadValue.value === "0") {
      keypadValue.value = key;
    } else {
      keypadValue.value += key;
    }
  }
};

const handleKeypadConfirm = async () => {
  const item = keypadTargetItem.value;
  if (!item) return;

  const numValue = Number(keypadValue.value);
  if (keypadValue.value === "" || isNaN(numValue)) {
    ElMessage.warning(t("scada.configPopup.invalidValue"));
    return;
  }

  setInputValue(item.id, keypadValue.value);

  const { pointInfo } = item;
  if (!pointInfo) return;

  const targetService = pointInfo.service || pointInfo.deviceId;
  const targetAsset = pointInfo.deviceId;
  const point = pointInfo.pointName || pointInfo.pointId;

  try {
    const result = await controlApi.writeSetpoint(
      targetService,
      targetAsset,
      point,
      numValue
    );

    if (result.status === "ACCEPTED" || result.status === "COMPLETED") {
      ElMessage.success(t("scada.writeValueDialog.success"));
    } else {
      ElMessage.warning(`${t("scada.writeValueDialog.result")} ${result.message}`);
    }
  } catch (error) {
    console.error("Write value failed:", error);
    ElMessage.error(t("scada.writeValueDialog.failed"));
  }

  closeKeypad();
};
</script>

<style lang="scss" scoped>
/* ==================== 弹窗容器 ==================== */
/* teleported=false 时弹窗 DOM 保留在 .config-modal-root 内，通过 :deep() 穿透 */
.config-modal-root :deep(.config-dialog.el-dialog) {
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
.config-modal-root :deep(.config-dialog .el-dialog__header) {
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
.config-modal-root :deep(.config-dialog .el-dialog__body) {
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
  display: flex;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-base);
}

.trigger-btn {
  flex: 1;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.trigger-input__label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-regular);
  min-width: 60px;
}

.trigger-input__field {
  width: 200px;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background-color: var(--bg-base);
  border: 1px solid var(--border-base);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  user-select: none;
  box-sizing: border-box;
}

.trigger-input__field:hover {
  border-color: rgba(102, 102, 255, 1);
  box-shadow: 0 0 0 1px rgba(102, 102, 255, 1) inset;
}

.trigger-input__field.is-placeholder {
  color: var(--text-placeholder);
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

<style lang="scss">
/* ==================== 遮罩层 ==================== */
.config-overlay {
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ==================== 数字键盘遮罩 ==================== */
.keypad-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: keypad-fade-in 0.15s ease-out;
}

@keyframes keypad-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ==================== 数字键盘面板 ==================== */
.keypad-panel {
  width: 320px;
  background: var(--bg-modal);
  border: 1px solid var(--border-base);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  animation: keypad-slide-up 0.2s ease-out;
}

@keyframes keypad-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 键盘头部 ==================== */
.keypad-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 16px;
  border-bottom: 1px solid var(--border-base);
  margin-bottom: 12px;
}

.keypad-title {
  font-size: 13px;
  color: var(--text-regular);
  margin-bottom: 8px;
}

.keypad-display {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: "SF Mono", "Monaco", "Consolas", monospace;
  min-height: 36px;
  letter-spacing: 2px;
}

/* ==================== 键盘按钮网格 ==================== */
.keypad-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keypad-row {
  display: flex;
  gap: 8px;
}

.keypad-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  background: var(--bg-base);
  color: var(--text-primary);
}

.keypad-btn:hover {
  filter: brightness(1.15);
}

.keypad-btn:active {
  transform: scale(0.95);
  filter: brightness(0.9);
}

/* 数字按钮 */
.keypad-btn--num {
  background: var(--bg-base);
  color: var(--text-primary);
  font-size: 20px;
}

/* 删除按钮 */
.keypad-btn--del {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-regular);
  font-size: 18px;
}

/* 清除按钮 */
.keypad-btn--clear {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-regular);
  font-size: 18px;
}

/* 正负切换按钮 */
.keypad-btn--toggle {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-primary);
  font-size: 15px;
}

/* 取消按钮 */
.keypad-btn--cancel {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-regular);
  font-size: 13px;
}

/* 确认按钮 */
.keypad-btn--confirm {
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
}

.keypad-btn--confirm:hover {
  background: var(--color-primary-hover);
}
</style>
