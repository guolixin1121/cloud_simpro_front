<template>
  <form-view title="具体场景预览" :items="formItems" :videoUrl="videoUrl" :loading="loading">
    <span>场景管理</span>
    <span>我的场景</span>
    <router-link to="/my-sceneset/">具体场景</router-link>
    <a @click='goback()'>{{ sceneset?.name }}</a> 
  </form-view>
</template>

<script setup lang="ts">
import { getMySceneSourceName } from '@/utils/dict'

// const sceneset = store.catalog.sceneCatalog
const sceneset = ref({id: '', name: ''})
const router = useRouter()
const goback = () => router.push('/my-sceneset/scene/?pid=' + sceneset.value.id)
const videoUrl = import.meta.env.VITE_BASE_STATIC_URL + 'scene.mp4'

const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.scene.get(useRoute().params.id)
    sceneset.value = { id: data.sceneset_id, name: data.sceneset_name }
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.adsName, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '场景来源', value: getMySceneSourceName(data.adsSource) },
      { label: '路径', value: '我的场景-具体场景-' + sceneset.value.name },
      { label: '关联地图', value: data.mapName + '_' + data.mapVersion },
      { label: '场景文件', value: data.adsUrl },
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.createTime }
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>