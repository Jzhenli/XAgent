<template>
  <GraphicRender
    ref="graphicRenderItem"
    v-if="graphicData != null"
    :manager="dataHandleManager"
    :graphicData="parsedGraphics"
    @graphicLoaded="graphicLoaded"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { controlApi } from '@/api/control'
import DataHandleManager from './DataHandleManager'
import WriteValueModal from './modal/WriteValueModal.vue'
import ConfigModal from './modal/ConfigModal.vue'

const { t } = useI18n()

const props = defineProps<{
  project?: any
}>()

const graphicData = ref<any | null>(null)
const graphicRenderItem = ref<InstanceType<typeof GraphicRender> | null>(null)

const isShowModal = ref(false)
const clickParam = ref<Record<string, any>>({})
const isShowConfigModal = ref(false)
const configParam = ref<Record<string, any>>({})

const dataHandleManager = new DataHandleManager();

watch(
  () => props.project,
  (project) => {
    if (!project || !project.data) return;

    graphicData.value = project.data ?? {};
  },
  { immediate: true },
);

onMounted(() => {
  //console.log("onMounted", props.project);
});

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

const graphicLoaded = () => {
  //graphicRenderItem.value?.zoomFit()
};

const itemclick = (params: any) => {
  if (params.action === 'setValue') {
    console.log('setValue', params)
    clickParam.value = params
    isShowModal.value = true
  } else if (params.action === 'configPopup') {
    console.log('configPopup', params)
    configParam.value = params.param || {}
    isShowConfigModal.value = true
  }
};

const handleConfirm = async (value: number) => {
  const params = clickParam.value

  try {
    const result = await controlApi.writeSetpoint(
      params.param.pointRef.split(',')[2],
      params.param.pointRef.split(',')[0],
      params.param.pointName,
      value
    )

    if (result.status === 'ACCEPTED' || result.status === 'COMPLETED') {
      ElMessage.success(t('scada.writeValueDialog.success'))
    } else {
      ElMessage.warning(`${t('scada.writeValueDialog.result')} ${result.message}`)
    }
  } catch (error) {
    console.error('Write value failed:', error)
    ElMessage.error(t('scada.writeValueDialog.failed'))
  }
};

const handleCancel = () => {
  isShowModal.value = false;
};
</script>

<style lang="scss" scoped></style>
