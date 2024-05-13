<template>
  <div class="breadcrumb">
    <span>我的场景</span>
    <a @click="goback(-2)">具体场景</a>
    <a @click='goback()'>{{ scenset?.name }}</a>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <Form :model="formState" @finish="add">
        <a-form-item label="场景名称" name="adsName"
          :rules="[{ required: true, message: '请输入场景名称' },
            { min: 2, max: 160, message: '场景名称长度为2到160位' }]"
        >
          <ch-input v-model:value="formState.adsName" :maxlength="50" placeholder="请输入场景名称"></ch-input>
        </a-form-item>
        <a-form-item label="场景描述" name="desc">
          <ch-input type="textarea" v-model:value="formState.desc" :maxlength="255" rows="10" placeholder="请输入场景描述"></ch-input>
        </a-form-item>
        <a-form-item label="关联地图" name="mapVersion" :rules="[{ required: isAdd, message: '请选择关联地图' }]">
          <a-form-item-rest v-if="isAdd" >
            <div class="flex justify-between w-full">
              <tree-select v-model:value="formState.mapCatalog" 
                :api="baseApi.maps.getMapCatalog" 
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
          </a-form-item-rest>
          <div v-else>
            {{ formState.mapName + '_' + formState.mapVersion }}
          </div>
        </a-form-item>
        <a-form-item label="场景文件" name="xosc" :rules="[{ required: isAdd, message: '请上传场景文件' }]">
          <single-upload v-if="isAdd" accept=".xosc" v-model:value="formState.xosc"></single-upload>
          <span class="break-text">{{ formState.adsUrl }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <tree-transfer
            v-model:target-keys="formState.labels"
            :api="baseApi.tags.getList"
            :query="{ tag_type: 3, tree: 1 }"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
        </a-form-item>
        <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
          <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
            {{ actionText }}
          </a-button>
          <a-button @click="goback()">取消</a-button>
        </a-form-item>
      </Form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { id } = route.params
const isAdd = id === '0'
const actionText = isAdd ? '上传' : '修改'
const title =  actionText + '具体场景'
const scenset = store.catalog.sceneCatalog

const baseApi = api
const currentApi = baseApi.scene
// const sceneCatalog = store.catalog.sceneCatalog

const formState = reactive({
  adsName: '',
  desc: '',
  mapCatalog: undefined,
  map: undefined,
  mapName: undefined,
  mapVersion: undefined,
  xosc: undefined,
  labels: [],
  adsUrl: undefined,
})
const loading = ref(false)
const router = useRouter()
const goback = (step: number = -1) => router.go(step)

const add = async () => {
  const { labels } = formState
  const params = {
    source: 0,
    desc: formState.desc,
    adsName: formState.adsName,
    baiduSceneSets: scenset.id,
    mapName: formState.map ? (formState.map as unknown as SelectOption).label : formState.mapName,
    mapVersion: formState.mapVersion,
    xosc: formState.xosc,
    labels: labels ? labels.map((item: any) => item.name || item.key) : []
  }

  if(!params.xosc) {
    delete params.xosc
  }

  try {
    loading.value = true

    isAdd
      ? await currentApi.add(params)
      : await currentApi.edit({ id, data: params })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

// 地图切换
const getMaps = ref()
const onMapCateogryChanged = (value: string) => {
  formState.map = undefined
  formState.mapVersion = undefined
  getMaps.value = (args: any) => api.maps.getMaps({catalog: value, ...args})
}
const getMapVersions = ref()
const onMapChanged = (item: any) => {
  formState.mapVersion = undefined
  getMapVersions.value = (args: any) => api.maps.getMapVersion({map: item.value, name: item.label, ...args})
}

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if (id !== '0') {
    dataLoading.value = true
    const scene = await currentApi.get(id)
    dataLoading.value = false
    formState.adsName = scene.adsName
    formState.labels = scene.labels_detail
    formState.mapVersion = scene.mapVersion
    formState.mapName = scene.mapName
    formState.adsUrl = scene.adsUrl
    formState.desc = scene.desc
    // formState.scenesets = scene.baiduSceneSets
    // formState.scenesetsName = scene.sceneset_name
  }
}
getEditData()
</script>
