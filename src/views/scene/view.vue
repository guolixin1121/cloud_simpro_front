<template>
  <form-view title="场景详情" :items="formItems" :loading="loading">
    <router-link to="/scene/">场景管理</router-link>
  </form-view>
</template>

<script setup lang="ts">
import { getSceneSourceName } from '@/utils/dict'

const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.scene.get(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.adsName },
      { label: '场景来源', value: getSceneSourceName(data.adsSource) },
      { label: '所属场景集', value: data.sceneset_name },
      { label: '关联地图', value: data.mapName + '_' + data.mapVersion },
      { label: '场景文件地址', value: data.adsUrl },
      { label: '场景路径', value: data.sceneset_name + '/' + data.adsName },
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.createTime },
      { label: '修改时间', value: data.updateTime },
      { label: '所属用户', value: data.createUser },
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>