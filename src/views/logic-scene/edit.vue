<template>
  <div class="breadcrumb">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item
        label="场景名称"
        name="adsName"
        :rules="[
          { required: true, message: '请输入场景名称!' },
          { min: 2, max: 50, message: '场景名称长度为2到50位' }
        ]"
      >
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
      </a-form-item>
      <a-form-item v-if="isAdd" label="场景文件" name="xosc" :rules="[{ required: isAdd, message: '请上传场景文件!' }]">
        <single-upload accept=".xosc" v-model:value="formState.xosc"></single-upload>
      </a-form-item>
      <a-form-item v-if="!isAdd" label="场景文件地址" name="adsUrl">
        <span>{{ formState.adsUrl }}</span>
      </a-form-item>
      <a-form-item v-if="isAdd" label="配置文件" name="xosc" :rules="[{ required: isAdd, message: '请上传配置文件!' }]">
        <single-upload accept=".xosc" v-model:value="formState.config"></single-upload>
      </a-form-item>
      <a-form-item v-if="!isAdd" label="配置文件地址" name="adsUrl">
        <span>{{ formState.adsUrl }}</span>
      </a-form-item>
      <a-form-item label="关联地图" name="map_version_obj" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <scroll-select v-model:value="formState.map_version_obj" :api="getMaps" 
          placeholder="请选择关联地图"
          :fieldNames="{label: 'mapName', value: 'id', sublabel: 'mapVersion'}"></scroll-select>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer
          v-model:target-keys="formState.labels"
          :api="getScennTags"
          :fieldNames="{ label: 'display_name', value: 'id' }"
          :titles="['可选标签', '选中标签']"
        ></scroll-transfer>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ actionText }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'

const title =  actionText + '场景'
const getMaps = api.maps.getMapVersion
const getScennTags = (args: object) => api.tags.getList({ tag_type: 3, ...args })
const currentApi = api.scene

const formState = reactive({
  name: '',
  map_version_obj: undefined,
  xosc: undefined,
  config: undefined,
  labels: undefined,
  adsUrl: undefined
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  const params = {
    ...formState
  }

  delete params.adsUrl
  !params.xosc && delete params.xosc

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

/****** 获取编辑数据 */
const getEditData = async () => {
  if (id !== '0') {
    const data = await currentApi.get(id)
    // formState.adsName = scene.adsName
    // formState.labels = scene.labels
    // formState.baiduSceneSets = scene.baiduSceneSets
    // formState.map_version_obj = scene.map_version_obj
    // formState.adsUrl = scene.adsUrl
    for(const prop in formState) {
      formState[prop as keyof typeof formState] = data[prop] as never
    }
  }
}
getEditData()
</script>
