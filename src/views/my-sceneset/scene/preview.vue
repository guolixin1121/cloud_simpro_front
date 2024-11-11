<template>
  <div class="breadcrumb">
    <a @click="goback()">具体场景</a>
    <a class="cursor-auto">{{ sceneset?.name }}</a>
    <span>{{ sceneName }}</span>
  </div>
  <iframe :src="previewUrl" style="margin: -16px; margin-top: -10px; width: calc(100% + 32px); height: calc(100% - 8px)"></iframe>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'
const { id } = useRoute().params
let sceneset: any = null //store.catalog.sceneCatalog

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