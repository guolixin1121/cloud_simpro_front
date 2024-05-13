<template>
  <form-view title="具体场景预览" :items="formItems" :loading="loading">
    <span>我的场景</span>
    <a @click="goback(-2)">具体场景</a>
    <a @click='goback()'>{{ sceneset?.name }}</a>   
    <template v-slot:right>
      <div style="width: 65%">
        <video width="800" controls autoplay>
          <source :src="videoUrl" type="video/mp4">
          <!-- 您的浏览器不支持视频标签。 -->
        </video>
      </div>
    </template> 
  </form-view>
</template>

<script setup lang="ts">
import { getMySceneSourceName } from '@/utils/dict'

const sceneset = store.catalog.sceneCatalog
const router = useRouter()
const goback = (step: number = -1) => router.go(step)
const videoUrl = import.meta.env.VITE_BASE_STATIC_URL + 'scene.mp4'

const formItems = ref<FormItem[]>([])
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.scene.get(useRoute().params.id)
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.adsName, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '场景来源', value: getMySceneSourceName(data.adsSource) },
      { label: '路径', value: '我的场景-具体场景-' + sceneset.name },
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