<template>
   <a-upload
      :disabled="disabled"
      :fileList="fileList"
      :before-upload="beforeUpload"
      @remove="onRemove"
      @change="onFileChange"
    >
      <a-button>选择文件</a-button>
      <!-- <span class="ml-2">{{ formState.mapFileName }}</span> -->
    </a-upload>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue'

defineProps(['value', 'disabled'])
const emits = defineEmits(['update:value'])

const fileList = ref()

/****** 上传文件限制 */
const beforeUpload = (file: File) => {
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    message.warning('文件不能大于50M！')
    return false
  }
  return false
}

const onFileChange = (info: UploadChangeParam) => {
  fileList.value = [info.file]
  emits('update:value', fileList.value?.[0])
}

const onRemove = () => {
  fileList.value = []
  emits('update:value', null)
}
</script>