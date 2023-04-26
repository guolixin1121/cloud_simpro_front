<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item
        label="场景名称"
        name="name"
        :rules="[
          { required: true, message: '请输入场景名称!' },
          { min: 2, max: 50, message: '场景名称长度为2到50位' }
        ]"
      >
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
      </a-form-item>
      <a-form-item label="所属场景集" name="baiduSceneSets" :rules="[{ required: true, message: '请选择场景集!' }]">
        <tree-select v-model:value="formState.baiduSceneSets" :api="getSceneSet"></tree-select>
      </a-form-item>
      <a-form-item label="关联地图" name="map_version_obj" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <scroll-select v-model:value="formState.map_version_obj" :api="getMaps"></scroll-select>
      </a-form-item>
      <a-form-item label="场景文件" name="xosc" :rules="[{ required: true, message: '请上传场景文件!' }]">
        <single-upload accept=".xosc" v-model:value="formState.xosc"></single-upload>
        <!-- <a-upload accept=".xosc" :fileList="fileList" :before-upload="beforeUpload" @remove="onRemove" @change="onFileChange">
          <a-button> 选择文件 </a-button>
        </a-upload> -->
      </a-form-item>
      <a-form-item label="场景路径" name="baiduSceneSets">
        <a-input disabled :value="path"></a-input>
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
// import type { UploadChangeParam } from 'ant-design-vue'

const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '场景'
const getMaps = api.maps.getMaps
const getSceneSet = (args: object) => api.scenesets.getList({ tree: 1, ...args })
const getScennTags = (args: object) => api.tags.getList({ tag_type: 3, ...args })
const currentApi = api.scene

// const fileList = ref()
const formState = reactive({
  name: '',
  map_version_obj: '',
  baiduSceneSets: '',
  xosc: undefined,
  labels: []
})
const path = ref('')
watch([
  () => formState.baiduSceneSets,
  () => formState.name
], async () => {
  const res = await api.scenesets.get(formState.baiduSceneSets)
  if(res) {
    path.value = (res.name || '')  + '/' + formState.name
  }
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  try {
    isAdd
      ? await currentApi.add({ ...formState, source: 0 })
      : await currentApi.edit({ id, data: { ...formState, source: 0 } })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
  if (id !== '0') {
    const scene = await currentApi.get(id)
    formState.name = scene.adsName
    formState.labels = scene.labels
    formState.baiduSceneSets = scene.baiduSceneSets
    formState.map_version_obj = scene.map_version_obj.value
    //  fileList.value = [scene.xosc]
  }
}
getEditData()
</script>
