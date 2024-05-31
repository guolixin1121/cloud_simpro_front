<template>
  <form-view title="逻辑场景详情" :items="formItems" :loading="loading" :labelWidth="80">
    <span>场景管理</span>
<span>场景资源库</span>
    <router-link to="/resource-logic-sceneset/">逻辑场景</router-link>
    <a @click='goback()'>{{ senesetname }}</a>
  </form-view>
</template>

<script setup lang="ts">
import {goback} from '@/utils/tools'

// const sceneset = store.catalog.sceneCatalog
let senesetname = ''
const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.loginsceneResource.getScene(useRoute().params.id)
    senesetname = data.logic_scene_set_resource.name
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '路径', value: '场景资源库-逻辑场景-' + senesetname },
      { label: '关联地图', value: data.map_name + '_' + data.map_version_num},
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