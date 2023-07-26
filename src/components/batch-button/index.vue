<template>
  <a-button type="primary" class="mr-2" v-bind="$attrs" @click="onButtonClick">{{ label }}</a-button>

  <a-modal v-model:visible="showConfirm"
    :closable="false"
    :footer="null">
    <div>
      <svg-icon style="color: #faad14" icon="alert"></svg-icon>
      <span class="ml-4" style="font-size: 16px">是否{{label}}？</span>
    </div>
    <div class="text-right mt-4 pt-4" style="border-top: 1px solid #f0f0f0">
      <a-button @click="showConfirm = false">否</a-button>
      <a-button @click="onBatch" v-model:loading="loading" type="primary" class="ml-2">是</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: () => '删除'
  },
  api: {
    type: Function,
    required: true
  },
  doubleConfirm: {
    type: Boolean,
    default: () => true
  }
})
const showConfirm = ref(false)
const loading = ref(false)

const onButtonClick = () => {
  if(props.doubleConfirm) {
    showConfirm.value = true
  } else {
    onBatch()
  }
}

const onBatch = async () =>{
  const { api } = props
  if(!api) return

  try {
    loading.value = true
    await api()
    message.info('批量'+ props.label + '成功')
    showConfirm.value = false
  } finally {
    loading.value = false
  }
}
</script>