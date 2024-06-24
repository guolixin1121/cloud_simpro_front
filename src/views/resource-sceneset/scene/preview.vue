<template>
  <div class="breadcrumb">
    <span>场景管理</span>
    <span>场景资源库</span>
    <router-link to="/resource-sceneset/">具体场景</router-link>
    <a @click='goback()'>{{ sceneset?.name }}</a>
    <span>{{ sceneName }}</span>
  </div>
  <iframe :src="previewUrl"></iframe>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const sceneset = store.catalog.sceneCatalog
const router = useRouter()
const goback = () => router.push('/resource-sceneset/scene/?pid=' + sceneset.value.id)

const sceneName = ref()
const previewUrl = '/scene-simulation-client/#/overview/?type=1&id=' + id
const getEditData = async () => {
  if (id) {
    const scene = await api.scene.get(id)
    sceneName.value = scene.adsName
  }
}
getEditData()
</script>