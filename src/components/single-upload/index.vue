<template>
  <a-upload
    :fileList="fileList"
    :accept="accept"
    :before-upload="() => false"
    @remove="onRemove"
    @change="onFileChange"
  >
    <a-button>{{ text ? text : '选择文件' }}</a-button>
  </a-upload>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue'
import { getWordLength } from '@/utils/tools';

const props = defineProps(['value', 'text', 'accept', 'maxSize'])
const emits = defineEmits(['update:value'])
const { text } = toRefs(props)
const fileList = ref()

const onFileChange = (info: UploadChangeParam) => {
  const { file } = info
  const fileType: any = file.name.replace(/.+\./, '')
  if (props.accept?.indexOf(fileType) === -1) {
    message.error(`仅支持${props.accept}格式文件`)
    fileList.value = fileList.value ? fileList.value : null
    return
  }
  if(getWordLength(file.name) > 160) {
    message.warning('文件名加后缀，总长度不能超过160')
    fileList.value = fileList.value ? fileList.value : null
    return
  }
  const maxSize = props.maxSize || 100
  if(file.size && (file.size / 1024 / 1024 > maxSize)) {
    message.warning('文件不能大于' + maxSize + 'M')
    fileList.value = fileList.value ? fileList.value : null
    return
  }
  // 限定只上传一个文件
  fileList.value = [file]
  emits('update:value', file)
}

const onRemove = () => {
  fileList.value = []
  emits('update:value', null)
}
/****** 组件外部操作，清空fileList */
watch(
  () => props.value,
  newVal => {
    if (!newVal || newVal.length === 0) {
      fileList.value = []
    }
  }
)
</script>
