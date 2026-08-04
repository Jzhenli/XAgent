<template>
  <!-- 缩放系数：用于原始值与标准值之间的线性转换 -->
  <el-form-item :label="t('devices.scale')">
    <el-input-number
      :model-value="props.form.scale"
      :placeholder="scalePlaceholderText"
      :precision="4"
      :step="0.1"
      clearable
      @update:model-value="(val: number | null | undefined) => props.form.scale = val ?? null"
    />
  </el-form-item>

  <!-- 偏移量：与缩放系数配合完成线性转换 -->
  <el-form-item :label="t('devices.offset')">
    <el-input-number
      :model-value="props.form.offset"
      :placeholder="offsetPlaceholderText"
      :precision="4"
      clearable
      @update:model-value="(val: number | null | undefined) => props.form.offset = val ?? null"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/** 仅包含 scale / offset 的表单片段 */
interface ScaleOffsetForm {
  scale: number | null
  offset: number | null
}

const props = defineProps<{
  form: ScaleOffsetForm
  /** scale 输入框占位文本，未传则使用“可选”默认提示 */
  scalePlaceholder?: string
  /** offset 输入框占位文本，未传则使用“可选”默认提示 */
  offsetPlaceholder?: string
}>()

const { t } = useI18n()

const scalePlaceholderText = computed(
  () => props.scalePlaceholder || t('devices.optionalPlaceholder')
)
const offsetPlaceholderText = computed(
  () => props.offsetPlaceholder || t('devices.optionalPlaceholder')
)
</script>
