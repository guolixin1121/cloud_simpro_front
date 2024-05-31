<template>
  <a-button v-bind="$attrs" @click="onButtonClick">{{ label }}</a-button>

  <a-modal v-model:visible="showConfirm"
    :closable="false"
    :footer="null"
    width="250px">
    <div class="modal-content">
      <!-- <svg-icon style="color: #faad14" icon="alert"></svg-icon> -->
      <span style="font-size: 16px">{{tips || '是否' + label + '?'}}</span>
    </div>
    <div class="modal-buttons" style="border: 0px; padding-top: 0px;">
      <a-button @click="showConfirm = false">取消</a-button>
      <a-button @click="onBatch" v-model:loading="loading" type="primary">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  // 按钮label
  label: {
    type: String,
    default: () => '删除'
  },
  tips: {
    type: String,
    default: () => '是否删除'
  },
  api: {
    type: Function,
    required: true
  },
  // 是否需要二次确认
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