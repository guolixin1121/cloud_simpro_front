<template>
  <div class="breadcrumb">
    <a @click="goback()">具体场景</a>
    <!-- <router-link to="/my-sceneset/">具体场景</router-link> -->
    <!-- <a @click='goback()'>{{ sceneset?.name }}</a> -->
    <span>{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>

    <a-spin :spinning="dataLoading">
      <Form :model="formState" @finish="add">
        <!-- <a-form-item label="场景集名称">
          {{ sceneset?.name }}
        </a-form-item> -->
        <a-form-item label="场景名称" name="adsName"
          :rules="[{ required: true, message: '请输入场景名称' },
            { validator: () => checkChName(formState.adsName, 160)  }]"
        >
          <ch-input v-model:value="formState.adsName" :maxlength="160" placeholder="请输入场景名称"></ch-input>
        </a-form-item>
        <a-form-item label="场景描述" name="desc">
          <ch-input type="textarea" v-model:value="formState.desc" :maxlength="1000" rows="5" placeholder="请输入场景描述"></ch-input>
        </a-form-item>
        <a-form-item label="关联地图" name="mapVersion" :rules="[{ required: isAdd, message: '请选择关联地图' }]">
          <a-form-item-rest v-if="isAdd" >
            <div class="flex  w-full">
              <tree-select v-model:value="formState.mapCatalog" 
                :api="baseApi.maps.getMapCatalog" 
                placeholder="请选择地图目录" @change="onMapCateogryChanged"
                style="width: 33%; margin-right: 10px;"></tree-select>
              <scroll-select v-model:value="formState.map"
                placeholder="请选择地图"
                label-in-value
                :api="getMaps"
                style="width: 33%; margin-right: 10px;"
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
        <a-form-item :wrapper-col="{ style: { paddingLeft: '80px' }}">
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
import { checkChName, goback } from '@/utils/tools'
const route = useRoute()
const { id } = route.params
const isAdd = !id
const actionText = isAdd ? '上传' : '修改'
const title =  actionText + '具体场景'
const sceneset = store.catalog.sceneCatalog
const baseApi = api
const currentApi = baseApi.scene

const formState = reactive({
  adsSource: 0,
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

const add = async () => {
  const { labels } = formState
  const params = {
    source: formState.adsSource,
    desc: formState.desc,
    adsName: formState.adsName,
    baiduSceneSets: sceneset.id,
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

    message.success(`${actionText}成功`)
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
  if (id) {
    dataLoading.value = true
    const scene = await currentApi.get(id)
    dataLoading.value = false
    formState.adsName = scene.adsName
    formState.labels = scene.labels_detail
    formState.mapVersion = scene.mapVersion
    formState.mapName = scene.mapName
    formState.adsUrl = scene.adsUrl
    formState.desc = scene.desc || ''
    formState.adsSource = scene.adsSource
    // formState.scenesets = scene.baiduSceneSets
    // formState.scenesetsName = scene.sceneset_name
  }
}
getEditData()
</script>
