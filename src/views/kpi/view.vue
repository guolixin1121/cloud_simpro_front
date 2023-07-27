<template>
  <form-view title="评测指标详情" :items="formItems" :loading="loading">
    <router-link to="/kpi/">评测指标管理</router-link>
  </form-view>
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getEditData = async () => {
  try {
    loading.value = true
    const res = await api.kpi.getList({id: useRoute().params.id})
    const data = res.results?.[0]
    formItems.value = [
      { label: '评测指标ID', value: data.id },
      { label: '评测指标名称', value: data.name },
      { label: '评测指标类型', value: data.category_name },
      { label: '指标文件地址', value: data.py_url },
      { label: '描述', value: data.desc },
      { label: '创建时间', value: data.create_date },
      { label: '修改时间', value: data.update_time },
      { label: '所属用户', value: data.create_user },
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>