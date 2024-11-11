<template>
  <form-view title="逻辑场景详情" :items="formItems" :loading="loading" :labelWidth="80">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
  </form-view>\
</template>

<script setup lang="ts">
const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.logicScene.get(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: false },
      { label: '场景文件', value: data.scene_url },
      { label: '配置文件', value: data.config_url },
      { label: '关联地图', value: data.map_name ? (data.map_name + '_' + data.map_version_num) : '--'},
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.create_time },
      { label: '所属用户', value: data.create_user },
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>