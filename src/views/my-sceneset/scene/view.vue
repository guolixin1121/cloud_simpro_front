<template>
  <form-view title="具体场景详情" :items="formItems" :loading="loading">
    <span>我的场景</span>
    <a @click="goback(-2)">具体场景</a>
    <a @click='goback()'>场景集{{ scenset?.name }}</a>
  </form-view>
</template>

<script setup lang="ts">
import { getMySceneSourceName } from '@/utils/dict'

const scenset = store.catalog.sceneCatalog
const router = useRouter()
const goback = (step: number = -1) => router.go(step)

const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.scene.get(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.adsName, isBreak: false },
      { label: '场景描述', value: data.desc },
      { label: '场景来源', value: getMySceneSourceName(data.adsSource) },
      { label: '所属场景集', value: data.sceneset_name },
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