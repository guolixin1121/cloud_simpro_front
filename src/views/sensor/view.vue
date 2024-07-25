<template>
  <form-view title="传感器详情" :items="formItems" :loading="loading">
    <router-link to="/sensor/">传感器模型</router-link>
  </form-view>
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getLookData = async () => {
  try {
    loading.value = true
    const data = await api.sensor.get({ id: useRoute().params.id })
    formItems.value = [
      { label: '传感器名称', value: data.name },
      { label: '传感器类型', value: data.type_name },
      { label: '传感器文件', value: data.csv_url },
      { label: '描述', value: data.desc },
      { label: '创建时间', value: data.create_time },
      { label: '修改时间', value: data.update_time },
      { label: '所属用户', value: data.create_user },
    ]
  } finally {
    loading.value = false
  }
}
getLookData()
</script>
