<template>
  <a-form ref="formRef" :labelCol="{ style: { width: '80px' } }" style="width: 55%">
    <slot></slot>
  </a-form>
</template>

<script setup lang="ts">
import { useAttrs, ref, watch } from 'vue'

const formRef = ref()
const model = useAttrs()['model'] as any
// 自定义的组件，值发生变化时需要主动触发验证来消除红色alert信息
for(let prop in model) {
  watch(() => model[prop as keyof typeof model], () => formRef.value.validateFields(prop))
}
</script>