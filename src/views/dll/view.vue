<template>
  <form-view title="动态库详情" :items="formItems" :loading="loading" :label-width="80">
    <router-link to="/dll/">动力学动态库</router-link>
  </form-view>
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getLookData = async () => {
  try {
    loading.value = true
    const data = await api.dll.get({ id: useRoute().params.id })
    formItems.value = [
      { label: '动态库名称', value: data.name },
      { label: '动态库文件', value: data.so_url },
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
