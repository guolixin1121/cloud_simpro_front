<!-- 可判断中文个数的input组件 -->
<template>
  <a-input v-if="type == 'input'" 
    v-bind="$attrs"
    :value="value" 
    allowClear
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
import { getWordLength } from '@/utils/tools'
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
  },
  exclude: {
    type: RegExp
  }
} as any)

const emits = defineEmits(['update:value'])
const { value, maxlength } = toRefs(props)
const inputChange = (e: { target: { value: any } }) => {
  let value = e.target.value
  if(props.exclude) {
    value = value.replace(props.exclude, '')
  }
  const totalLength = getWordLength(value)
  if ( totalLength <= +maxlength.value) {
    emits('update:value', value)
  }
}
</script>
