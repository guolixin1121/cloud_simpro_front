<!-- 可判断中文个数的input组件 -->
<template>
  <a-input :value="value" :placeholder="placeholder" :maxlength="maxlength" @change="inputChange"></a-input>
</template>

<script setup lang="ts">
import { getCnWordTotal } from '@/utils/tools'
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入...'
  },
  maxlength: {
    type: Number || String,
    default: 32
  }
} as any)

const emits = defineEmits(['change'])
const { value, maxlength } = toRefs(props)
const inputChange = (e: { target: { value: any } }) => {
  const count = getCnWordTotal(e.target.value)
  const totalLength = count * 2 + (e.target.value.length - count)
  if ( totalLength <= +maxlength.value) {
    emits('change', e.target.value)
  }
}

watch(
  () => value,
  newVal => {
    value.value = newVal
  }
)
</script>
