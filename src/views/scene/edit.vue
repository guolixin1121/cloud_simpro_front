<template>
  <div class="breadcrumb">
    <router-link to="/scene/scene">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;"
      @finish="add">
      <a-form-item label="场景名称" name="name" :rules="[{ required: true, message: '请输入场景名称!' }]">
        <a-input v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="场景集" name="sceneSet" :rules="[{ required: true, message: '请选择场景集!' }]">
        <scroll-select v-model:value="formState.sceneSet" :api="getSceneSet"></scroll-select>
      </a-form-item>
      <a-form-item label="关联地图" name="map_version_obj" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <scroll-select v-model:value="formState.map_version_obj" :api="getMaps"></scroll-select>
      </a-form-item>
      <a-form-item label="场景文件" name="xosc" :rules="[{ required: true, message: '请上传场景文件!' }]">
        <a-upload 
            :multiple="false"
            v-model:value="formState.xosc" :before-upload="beforeUpload">
          <a-button> 选择文件 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer v-model:target-keys="formState.labels" :api="getScennTags" labelKey="display_name"></scroll-transfer>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '80px' }}">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">上传</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const title = id === '0' ? '上传场景' : '修改场景'
const getMaps = api.maps.getMaps
const getSceneSet = api.scene.getSceneSets
const getScennTags = () => api.tags.getTags({ tag_type: 3 })

const formState = reactive({
  name: undefined,
  map_version_obj: undefined,
  sceneSet: undefined,
  xosc: null,
  labels: [],
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  await api.scene.addScene({...formState, source: 0})
  loading.value = false
  goback()
}

const beforeUpload = (file: File) => {
  const currentFiles = formState.xosc
  if (currentFiles) {
      message.warning('只支持单文件上传！')
      return false
  }
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
      message.warning('文件不能大于50M！')
      return false
  }
  formState.xosc = file as never
  return false;
}
</script>