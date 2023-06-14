<template>
  <div class="breadcrumb">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
        <a-form-item
          label="场景名称"
          name="name"
          :rules="[
            { required: true, message: '请输入场景名称'},
            { min: 2, max: 50, message: '场景名称长度为2到50位' }
          ]"
        >
          <a-input v-if="isAdd" v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
          <span v-else>{{ formState.name }}</span>
        </a-form-item>
        <a-form-item label="关联地图" v-if="!isAdd" name="mapVersion" :rules="[{ required: true, message: '请选择关联地图' }]">
          {{ formState.mapName + '_' + formState.mapVersion }}
        </a-form-item>
        <a-form-item label="关联地图" v-if="isAdd" name="mapVersion" :rules="[{ required: true, message: '请选择关联地图' }]">
          <div class="flex justify-between">
            <tree-select 
              style="width: 33%;"
              v-model:value="formState.mapCatalog" 
              :api="baseApi.maps.getMapCatalog" 
              placeholder="请选择地图目录" 
              @change="onMapCateogryChanged"></tree-select>
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
              :fieldNames="{ label: 'mapVersion', value: 'mapId'}"></scroll-select>
          </div>
        </a-form-item>
        <a-form-item label="场景文件" name="xosc_scene" :rules="[{ required: isAdd, message: '请上传场景文件'}]">
          <single-upload v-if="isAdd" accept=".xosc" v-model:value="formState.xosc_scene"></single-upload>
          <span>{{ formState.scene_url }}</span>
        </a-form-item>
        <a-form-item label="配置文件" name="xosc_config" :rules="[{ required: isAdd, message: '请上传配置文件'}]">
          <single-upload v-if="isAdd" accept=".xosc" v-model:value="formState.xosc_config"></single-upload>
          <span>{{ formState.config_url }}</span>
        </a-form-item>
         <a-form-item label="标签">
          <tree-transfer
            v-model:target-keys="formState.labels"
            :api="baseApi.tags.getList"
            :query="{tag_type: 3, tree: 1}"
            :fieldNames="{ label: 'display_name', value: 'name' }"
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
const title =  actionText + '逻辑场景'

const baseApi = api
const currentApi = api.logicScene

const formState = reactive({
  name: '',
  mapCatalog: undefined,
  map: undefined,
  mapName: '',
  mapVersion: undefined,
  xosc_scene: undefined,
  xosc_config: undefined,
  scene_url: '',
  config_url: '',
  labels: [],
  adsUrl: undefined,
})
const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/logic-scene')
const add = async () => {
  loading.value = true
  
  const params = {
    source: 0,
    name: formState.name,
    map_id: formState.mapVersion,
    xosc_scene: formState.xosc_scene,
    xosc_config: formState.xosc_config,
    labels: formState.labels?.map((item: any) => item.value || item.name)
  }

  !formState.xosc_config && delete params.xosc_config
  !formState.xosc_scene && delete params.xosc_scene
  !formState.labels && (params.labels = [])

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
    const data = await currentApi.get(id)
    dataLoading.value = false
    formState.name = data.name
    formState.mapName = data.map_name
    formState.mapVersion = data.map_version_num
    formState.labels = data.labels_detail
    formState.scene_url = data.scene_url
    formState.config_url = data.config_url
  }
}
getEditData()
</script>
