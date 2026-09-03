<template>
  <GraphicRender
    v-if="graphicData != null"
    :manager="dataHandleManager"
    :graphicData="parsedGraphics"
    @itemClick="itemclick"
  ></GraphicRender>

  <WriteValueModal
    v-model:visible="isShowModal"
    @confirm="handleConfirm"
  />

  <ConfigModal
    v-model:visible="isShowConfigModal"
    :param="configParam"
  />
</template>

<script setup lang="ts">
import { GraphicRender } from '@x-plateform/graphic-editor'
import { ref, computed, watch, onUnmounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { controlApi } from '@/api/control'
import DataHandleManager from './DataHandleManager'
import WriteValueModal from './modal/WriteValueModal.vue'
import ConfigModal from './modal/ConfigModal.vue'
import { useScadaPointReader, ScadaPointReaderKey } from '@/utils/scadaPointReader'

const { t } = useI18n()

const props = defineProps<{
  project?: any
}>()

const graphicData = ref<any | null>(null)

const isShowModal = ref(false)
const clickParam = ref<Record<string, any>>({})
const isShowConfigModal = ref(false)
const configParam = ref<Record<string, any>>({})

// inject 优先（页面 provide），fallback 直连读值中枢单例（独立使用场景）
const reader = inject(ScadaPointReaderKey, null) ?? useScadaPointReader()
const dataHandleManager = new DataHandleManager(reader);

watch(
  () => props.project,
  (project) => {
    if (!project || !project.data) return;

    graphicData.value = project.data ?? {};
  },
  { immediate: true },
);

onUnmounted(() => {
  // 停止点位订阅并注销设备需求，防止页面离开后回调残留导致内存泄漏
  dataHandleManager.dispose()
})

const parsedGraphics = computed(() => {
  let ret = {};
  try {
    if (graphicData.value) {
      ret = JSON.parse(graphicData.value.data || "{}");
    }
  } catch (e) {
    console.error(e);
  }
  return ret;
});

const itemclick = (params: any) => {
  if (params.action === 'setValue') {
    clickParam.value = params
    isShowModal.value = true
  } else if (params.action === 'configPopup') {
    configParam.value = params.param || {}
    isShowConfigModal.value = true
  }
};

const handleConfirm = async (value: number) => {
  const { pointRef, pointName } = clickParam.value.param;
  // pointRef 格式："asset,point,service"（GraphicRender 弹窗参数约定）
  const [targetAsset, , targetService] = pointRef.split(',');

  try {
    const result = await controlApi.writeSetpoint(
      targetService,
      targetAsset,
      pointName,
      value
    );

    if (result.status !== 'ACCEPTED' && result.status !== 'COMPLETED') {
      ElMessage.warning(`${t('scada.writeValueDialog.result')} ${result.message}`);
    }
  } catch (error) {
    console.error('Write value failed:', error)
    ElMessage.error(t('scada.writeValueDialog.failed'))
  }
};
</script>

<style lang="scss" scoped></style>
