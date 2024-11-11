<template>
  <form-view :title="sceneName" subtitle="场景详情" :items="formItems" :loading="loading">
    <router-link to="/resource-logic-sceneset/">逻辑场景</router-link>
    <a @click='goback()'>{{ sceneset?.name }}</a>
    <!-- <template v-slot:button>
      <a-button @click="goback()">返回</a-button>
    </template> -->
  </form-view>
</template>

<script setup lang="ts">
const router = useRouter()
const goback = () => router.push('/resource-logic-sceneset/scene/?pid=' + sceneset.value?.id)

let sceneset = ref()
const formItems = ref<FormItem[]>([])
const sceneName = ref('')
const loading = ref(false)
const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.loginsceneResource.getScene(useRoute().params.id)
    sceneset.value = {
      name: data.logic_scene_set_resource.name,
      id: data.logic_scene_set_resource.id
    }
    sceneName.value = data.name
    formItems.value = [
      { label: '场景ID', value: data.id },
      { label: '场景名称', value: data.name, isBreak: true },
      { label: '场景描述', value: data.desc },
      { label: '路径', value: '场景资源库-逻辑场景-' + sceneset.value.name + '-' + data.name },
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