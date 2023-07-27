<template>
  <form-view title="算法详情" :items="formItems" :loading="loading">
    <router-link to="/algorithm/">算法管理</router-link>
  </form-view>
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getLookData = async () => {
  try {
    loading.value = true
    const res = await api.algorithm.getList({ id: useRoute().params.id })
    if(res.results?.length == 0 ) return 

    const data = res.results[0]
    formItems.value = [
      { label: '算法名称', value: data.name },
      { label: '算法镜像', value: data.docker_path, isBreak: true },
      { label: '启动命令', value: data.cmd, isBreak: true },
      { label: '控制在环', value: data.is_in_ring ? '是' : '否' },
      { label: '描述', value: data.desc ? '是' : '否' },
      { label: '创建时间', value: data.create_time },
      { label: '所属用户', value: data.create_user },
    ]
  } finally {
    loading.value = false
  }
}
getLookData()
</script>
