<template>
  <div class="breadcrumb">
    <router-link to="/scene/scene">场景管理</router-link>
    <span class="breadcrumb--current">场景详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">场景详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;">
      <a-form-item label="场景名称" name="name" :rules="[{ required: true, message: '请选择场景集!' }]">
        <a-input disabled v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="场景集" name="sceneSet" :rules="[{ required: true, message: '请选择场景集!' }]">
        <scroll-select disabled v-model:value="formState.sceneSet" :api="getSceneSet"></scroll-select>
      </a-form-item>
      <a-form-item label="关联地图" name="map_version_obj" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <scroll-select disabled v-model:value="formState.map_version_obj" :api="getMaps"></scroll-select>
      </a-form-item>
      <a-form-item label="场景文件" name="xosc" :rules="[{ required: true, message: '请上传场景文件!' }]">
        <a-upload disabled :fileList="[]">
        </a-upload>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer disabled v-model:target-keys="formState.labels" :api="getScennTags" labelKey="display_name"></scroll-transfer>
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.createTime }}
      </a-form-item>
      <a-form-item label="修改时间">
        {{ formState.updateTime }}
      </a-form-item>
      <a-form-item label="所属用户">
        {{ formState.createUser }}
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '80px' }}">
        <a-button @click="goback" class="mr-2">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const getMaps = api.maps.getMaps
const getSceneSet = api.scenesets.getSceneSets
const getScennTags = () => api.tags.getTags({ tag_type: 3 })

const formState = reactive({
  name: undefined,
  map_version_obj: undefined,
  sceneSet: undefined,
  xosc: null,
  labels: [],
  createTime: '',
  updateTime: '',
  createUser: ''
})

const router = useRouter()
const goback = () => router.go(-1)

const getEditData = async () => {
   if(id !== '0') {
     const scene = await api.scene.getScene(id)
     formState.name = scene.adsName
     formState.labels = scene.labels
     formState.sceneSet = scene.baiduSceneSets
     formState.map_version_obj = scene.map_version_obj
     formState.createTime = scene.createTime
     formState.updateTime = scene.updateTime
     formState.createUser = scene.createUser
   }
}
getEditData()
</script>