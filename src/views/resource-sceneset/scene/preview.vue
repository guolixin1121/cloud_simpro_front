<template>
  <div class="breadcrumb">
    <router-link to="/resource-sceneset/">具体场景</router-link>
    <a @click='goback()'>{{ sceneset?.name }}</a>
    <span>{{ sceneName }}</span>
  </div>
  <iframe :src="previewUrl" style="margin: -16px; margin-top: 0px; width: calc(100% + 32px); height: calc(100% - 22px)"></iframe>
</template>

<script setup lang="ts">
const { id } = useRoute().params
let sceneset = { id: '', name: ''}
const router = useRouter()
const goback = () => router.push('/resource-sceneset/scene/?pid=' + sceneset.id)

const sceneName = ref()
const previewUrl = '/scene-simulation-client/#/overview/?type=1&id=' + id
const getEditData = async () => {
  if (id) {
    const scene = await api.sceneResource.getScene(id)
    sceneName.value = scene.name
    sceneset.id = scene.scene_set_id
    sceneset.name = scene.scene_set_name
  }
}
getEditData()
</script>