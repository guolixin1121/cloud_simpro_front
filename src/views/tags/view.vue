<template>
  <form-view title="标签详情" :items="formItems" :loading="loading">
    <router-link to="/tags/">标签管理</router-link>
  </form-view>
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.tags.get(useRoute().params.id)

    formItems.value = [
      { label: '标签ID', value: data.id },
      { label: '标签类型：', value: data.tag_type_name },
      { label: '标签英文名称', value: data.name },
      { label: '标签中文名称：', value: data.display_name },
      { label: '上级标签：', value: data.parentList[0]?.labelDisplayName },
      { label: '描述', value: data.desc },
      { label: '创建时间', value: data.create_time },
      { label: '修改时间', value: data.update_time },
      { label: '所属用户', value: data.create_user },
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>