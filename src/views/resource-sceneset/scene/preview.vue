<template>
    <form-view title="具体场景预览" :videoUrl="videoUrl" :items="formItems" :loading="loading">
      <span>场景管理</span>
<span>场景资源库</span>
      <router-link to="/resource-sceneset/">具体场景</router-link>
      <a @click='goback()'>{{ sceneset?.name }}</a>
    </form-view>
</template>

<script setup lang="ts">
const sceneset = store.catalog.sceneCatalog
const router = useRouter()
const goback = () => router.push('/resource-sceneset/scene/?pid=' + sceneset.id)

const videoUrl = import.meta.env.VITE_BASE_STATIC_URL + 'scene.mp4'
const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.sceneResource.getScene(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '路径', value: '场景资源库-具体场景-' + sceneset.name },
      { label: '关联地图', value: data.mapName + '_' + data.mapVersion },
      { label: '场景文件', value: data.xosc_key },
      { label: '标签', value: data.labels_detail?.map((item: any) => item.display_name) },
      { label: '创建时间', value: data.create_time }
    ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>