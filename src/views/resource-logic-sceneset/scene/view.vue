<template>
  <form-view title="逻辑场景详情" :items="formItems" :loading="loading" :labelWidth="80">
    <a @click="goback(-2)">逻辑场景</a>
    <a @click='goback()'>场景集{{ scenset?.name }}</a>
  </form-view>
</template>

<script setup lang="ts">
import {goback} from '@/utils/tools'

const scenset = store.catalog.sceneCatalog
const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.logicScene.get(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: false },
      { label: '场景描述', value: data.desc },
      { label: '所属场景集', value: scenset.name },
      { label: '关联地图', value: data.map_name ? (data.map_name + '_' + data.map_version_num) : '无'},
      { label: '场景文件', value: data.scene_url },
      { label: '配置文件', value: data.config_url },
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.create_time }
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>