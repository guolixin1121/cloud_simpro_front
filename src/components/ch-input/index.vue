<!-- 可判断中文个数的input组件 -->
<template>
  <a-input v-if="type == 'input'" 
    v-bind="$attrs"
    :value="value" 
    @input="inputChange"
></a-input>
  <a-textarea v-if="type == 'textarea'" 
    style="resize:none"
    v-bind="$attrs"
    :value="value" 
    @input="inputChange"
></a-textarea>
</template>

<script setup lang="ts">
import { getCnWordTotal } from '@/utils/tools'
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number || String,
    default: 32
  },
  type: {
    type: String, // 'input' | 'textarea',
    default: 'input'
  }
} as any)

const emits = defineEmits(['change', 'update:value'])
const { value, maxlength } = toRefs(props)
const inputChange = (e: { target: { value: any } }) => {
  const count = getCnWordTotal(e.target.value)
  const totalLength = count * 2 + (e.target.value.length - count)
  console.log(totalLength)
  if ( totalLength <= +maxlength.value) {
    emits('update:value', e.target.value)
  }
}

// watch(
//   () => value,
//   newVal => {
//     value.value = newVal
//   }
// )
</script>
