<template>
  <div class="breadcrumb">
    <a @click="goback()">具体场景</a>
    <!-- <router-link to="/my-sceneset/">具体场景</router-link> -->
    <a class="cursor-auto">{{ sceneset?.name }}</a>
    <span>{{ sceneName }}</span>
  </div>
  <iframe :src="previewUrl" style="margin: -16px; margin-top: 0px; width: calc(100% + 32px); height: calc(100% + 16px)"></iframe>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'
const { id } = useRoute().params
let sceneset: any = null //store.catalog.sceneCatalog
// const router = useRouter()
// const goback = () => router.push('/my-sceneset/scene/?pid=' + sceneset.id)

const sceneName = ref()
const previewUrl = '/scene-simulation-client/#/overview/?type=2&id=' + id
const getEditData = async () => {
  if (id) {
    const scene = await api.scene.get(id)
    sceneName.value = scene.adsName
    sceneset = {
      id: scene.sceneset_id,
      name: scene.sceneset_name
    }
  }
}
getEditData()
</script>