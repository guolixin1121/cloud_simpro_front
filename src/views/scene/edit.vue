<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
        <a-form-item
          label="场景名称"
          name="adsName"
          :rules="[
            { required: true, message: '请输入场景名称' },
            { min: 2, max: 50, message: '场景名称长度为2到50位' }
          ]"
        >
          <a-input v-model:value="formState.adsName" :maxlength="50" placeholder="请输入场景名称"></a-input>
        </a-form-item>
        <a-form-item label="所属场景集" name="scenesets" :rules="[{ required: true, message: '请选择场景集' }]">
          <tree-select v-model:value="formState.scenesets" :api="getSceneSet"
            placeholder="请选择所属场景集" label-in-value></tree-select>
        </a-form-item>
        <a-form-item label="关联地图" name="mapVersion" :rules="[{ required: true, message: '请选择关联地图' }]">
          <div class="flex justify-between">
            <tree-select v-model:value="formState.mapCatalog" :api="getMapCatalog" 
              placeholder="请选择地图目录" @change="onMapCateogryChanged"
              style="width: 33%;"></tree-select>
            <scroll-select v-model:value="formState.map"
              placeholder="请选择地图"
              label-in-value
              :api="getMaps"
              style="width: 33%;"
              @change="onMapChanged"></scroll-select>
            <scroll-select v-model:value="formState.mapVersion" 
              placeholder="请选择地图版本"
              :api="getMapVersions"
              style="width: 33%;"
              :fieldNames="{ label: 'mapVersion', value: 'mapVersion'}"></scroll-select>
          </div>
        </a-form-item>
        <a-form-item label="场景文件" name="xosc" :rules="[{ required: isAdd, message: '请上传场景文件' }]">
          <single-upload accept=".xosc" v-model:value="formState.xosc"></single-upload>
        </a-form-item>
        <a-form-item v-if="!isAdd" label="场景文件地址" name="adsUrl">
          <span>{{ formState.adsUrl }}</span>
        </a-form-item>
        <a-form-item label="场景路径" name="baiduSceneSets">
          <span>{{ path }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <scroll-transfer
            v-model:target-keys="formState.labels"
            :api="getScennTags"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></scroll-transfer>
        </a-form-item>
        <a-form-item label="标签">
          <tree-transfer
            v-model:target-keys="formState.labels"
            :api="getScennTags"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
        </a-form-item>
        <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
          <a-button type="primary" html-type="submit" :loading="loading">
            {{ actionText }}
          </a-button>
          <a-button @click="goback" class="ml-2">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '场景'

const getMapCatalog = () => api.maps.getMapCatalog({ tree: 1 })
const getMaps = ref()
const getMapVersions = ref()
const getSceneSet = (args: object) => api.scenesets.getList({ tree: 1, ...args })
const getScennTags = (args: object) => api.tags.getList({ tag_type: 3, ...args })
const currentApi = api.scene

const formState = reactive({
  adsName: '',
  mapCatalog: undefined,
  map: undefined,
  mapVersion: undefined,
  scenesets: undefined,
  xosc: undefined,
  labels: undefined,
  adsUrl: undefined,
})
const path = computed(() => {
  const scenesets = formState.scenesets as unknown as SelectOption
  return (scenesets?.label || '') + '/' + formState.adsName
})
const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  const params = {
    source: 0,
    path: path.value,
    adsName: formState.adsName,
    baiduSceneSets: (formState.scenesets as unknown as SelectOption).value,
    mapName: (formState.map as unknown as SelectOption).label,
    mapVersion: formState.mapVersion,
    xosc: formState.xosc || null,
    labels: formState.labels
  }

  try {
    isAdd
      ? await currentApi.add(params)
      : await currentApi.edit({ id, data: params })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}
const onMapCateogryChanged = (value: string) => {
  formState.map = undefined
  formState.mapVersion = undefined
  getMaps.value = (args: any) => api.maps.getMaps({catalog: value, ...args})
}
const onMapChanged = (item: any) => {
  formState.mapVersion = undefined
  getMapVersions.value = (args: any) => api.maps.getMapVersion({map: item.value, name: item.label, ...args})
}

// const mapValidator = () => {
//   // const { mapCatalog, map, mapVersion } = formState
//   // if (!mapCatalog || !map || !mapVersion) {
//   //   return Promise.reject('请选择关联地图');
//   // }
//   return Promise.resolve();
// }

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if (id !== '0') {
    dataLoading.value = true
    const scene = await currentApi.get(id)
    dataLoading.value = false
    formState.adsName = scene.adsName
    formState.labels = scene.label_detail?.map((item: any) => item.name)
    formState.mapVersion = scene.mapVersion
    formState.adsUrl = scene.adsUrl
    
    getEditOptions(scene)
  }
}
const getEditOptions = async ({ baiduSceneSets } : any) => {
  const res = await api.scenesets.get(baiduSceneSets)
  formState.scenesets = {
    label: res.name,
    value: res.id
  } as any
}
getEditData()
</script>
