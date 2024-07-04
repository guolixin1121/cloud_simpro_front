<template>
  <div class="relative">
    <form-view :title="sceneName" subtitle="场景详情" :items="formItems" :loading="loading" :labelWidth="80">
      <a @click="goback(-2)">逻辑场景</a>
      <a @click='goback()'>{{ sceneset?.name }}</a>
    </form-view>
    <a-button class="return-btn" @click="goback()">返回</a-button>
  </div>
</template>

<script setup lang="ts">
import {goback} from '@/utils/tools'

const sceneset = store.catalog.sceneCatalog  //ref({id: '', name: ''})
const formItems = ref<FormItem[]>([])
const sceneName = ref('')
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.logicScene.get(useRoute().params.id)
    // sceneset.value = data.logic_scene_set
    sceneName.value = data.name
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '路径', value: '我的场景-逻辑场景-' + sceneset.name + '-' + data.name},
      { label: '关联地图', value: data.map_name + '_' + data.map_version_num},
      { label: '场景文件', value: data.scene_url },
      { label: '配置文件', value: data.config_url },
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.create_time },
      { label: '修改时间', value: data.update_time },
      { label: '创建者', value: data.create_user },
      { label: '修改者', value: data.update_user }
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>

<style lang="less" scoped>
.return-btn {
  position: absolute;
  right: 24px;
  top: 55px;
}
</style>