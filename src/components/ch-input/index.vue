<!-- 可判断中文个数的input组件 -->
<template>
  <a-input v-if="type == 'input'" 
    ref="inputRef"
    v-bind="$attrs"
    v-model:value="innerValue" 
    allowClear
    @change="inputChange"
></a-input>
  <a-textarea v-if="type == 'textarea'" 
    style="resize:none"
    v-bind="$attrs"
    :value="value" 
    @change="inputChange"
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

const innerValue = ref(props.value)
const emits = defineEmits(['update:value'])
const { value, maxlength } = toRefs(props)
const inputChange = (e: { target: { value: any } }) => {
  let value = e.target.value
  if(props.exclude) {
    value = value.replace(props.exclude, '')
  }
  const totalLength = getWordLength(value)
  if(totalLength > +maxlength.value) {
    value = sliceWord(value)
  }
  innerValue.value = value
  emits('update:value', value)
}

const sliceWord = (text: string, index: number = 1): string => {
  const preTextToIndex = text.substring(0, index - 1)
  const textToIndex = text.substring(0, index)
  const lengthToIndex = getWordLength(textToIndex)

  if(lengthToIndex > +maxlength.value || lengthToIndex == getWordLength(text)) {
     return preTextToIndex
  } else {
    return sliceWord(text, index + 1)
  }
}
watch(() => props.value, (val) => {
  innerValue.value = val
})

const inputRef = ref()
defineExpose({
  focus: () => inputRef.value.focus(),
})
</script>
