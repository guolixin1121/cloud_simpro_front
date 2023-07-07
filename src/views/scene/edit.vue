<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 55%" @finish="add">
        <a-form-item label="所属场景集" name="scenesets" :rules="[{ required: true, message: '请选择场景集' }]">
          <tree-select-async
            v-if="isAdd"
            v-model:value="formState.scenesets" 
            placeholder="请选择所属场景集"
            :api="baseApi.scenesets.getList"
            :query="{version: 2}"
            ></tree-select-async>
            <span v-else>{{ formState.scenesetsName }}</span>
        </a-form-item>
        <a-form-item
          label="场景名称"
          name="adsName"
          :rules="[
            { required: true, message: '请输入场景名称' },
            { validator: () => checkChName(formState.adsName, 160) }
          ]"
        >
          <ch-input v-model:value="formState.adsName" :maxlength="160" v-if="isAdd"
            placeholder="请输入场景名称"></ch-input>
          <span v-else>{{ formState.adsName }}</span>
        </a-form-item>
        <!-- <a-form-item
          label="场景名称"
          name="adsName"
          :rules="[
            { required: true, message: '请输入场景名称' }
          ]"
        >
          <multi-select v-if="isAdd" v-model:value="formState.adsName"></multi-select>
          <span v-else>{{ formState.adsName }}</span>
        </a-form-item> -->
        <a-form-item v-if="!isAdd" label="关联地图" name="mapVersion">
          <span>{{ (formState.mapName || '') + '_' + (formState.mapVersion || '') }}</span>
        </a-form-item>
        <a-form-item label="关联地图" name="mapVersionAdd" :rules="[{ required: isAdd, message: '请选择关联地图' }]">
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
              <scroll-select v-model:value="formState.mapVersionAdd" 
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
          <span>{{ formState.adsUrl }}</span>
        </a-form-item>
        <a-form-item label="具体场景标签">
          <tree-transfer
            v-model:target-keys="formState.labels"
            :api="baseApi.tags.getList"
            :query="{ tag_type: 3, tree: 1 }"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
        </a-form-item>
        <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
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
import { checkChName } from '@/utils/tools';

const route = useRoute()
const { id } = route.params
const isAdd = id === '0'
const actionText = isAdd ? '上传' : '修改'
const title =  actionText + '场景'

const baseApi = api
const currentApi = baseApi.scene
// const sceneCatalog = store.catalog.sceneCatalog as any  // 分级查询场景集，无法默认选中

const formState = reactive({
  adsName: '',
  adsNameList: '', // 多级目录
  mapCatalog: undefined,
  map: undefined,
  mapVersionAdd: undefined,
  mapName: undefined,
  mapVersion: undefined,
  scenesets: undefined, // sceneCatalog ? { label: sceneCatalog.sourceName, value: sceneCatalog.id} : undefined,
  scenesetsName: '',
  xosc: undefined,
  labels: [],
  adsUrl: undefined,
})
const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/scene')
const add = async () => {
  const { labels } = formState
  const params = {
    source: 0,
    adsName: formState.adsName,
    baiduSceneSets: formState.scenesets,
    mapName: formState.map ? (formState.map as unknown as SelectOption).label : formState.mapName,
    mapVersion: formState.mapVersionAdd || formState.mapVersion,
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
    formState.labels = scene.labels_detail //?.map((item: any) => item.name)
    formState.mapVersion = scene.mapVersion
    formState.mapName = scene.mapName
    formState.adsUrl = scene.adsUrl
    formState.scenesets = scene.baiduSceneSets // { value: scene.baiduSceneSets, label: scene.sceneset_name }
    formState.scenesetsName = scene.sceneset_name
  }
}
getEditData()
</script>
