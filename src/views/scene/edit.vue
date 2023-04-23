<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;"
      @finish="add">
      <a-form-item label="场景名称" name="name" :rules="[{ required: true, message: '请输入场景名称!'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
      </a-form-item>
      <a-form-item label="场景集" name="baiduSceneSets" :rules="[{ required: true, message: '请选择场景集!' }]">
        <tree-select v-model:value="formState.baiduSceneSets" :api="getSceneSet"></tree-select>
      </a-form-item>
      <a-form-item label="关联地图" name="map_version_obj" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <scroll-select v-model:value="formState.map_version_obj" :api="getMaps"></scroll-select>
      </a-form-item>
      <a-form-item label="场景文件" name="xosc" :rules="[{ required: true, message: '请上传场景文件!' }]">
        <a-upload 
            accept=".xosc"
            :fileList="fileList"
            :before-upload="beforeUpload"
            @remove="onRemove"
            @change="onFileChange">
          <a-button> 选择文件 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer v-model:target-keys="formState.labels" :api="getScennTags" 
          :fieldNames="{label: 'display_name', value: 'id'}"
          :titles="['可选标签', '选中标签']"></scroll-transfer>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '80px' }}">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '上传' : '修改' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue';

const id = useRoute().params.id
const isAdd = id === '0'
const title =  isAdd ? '上传场景' : '修改场景'
const getMaps = api.maps.getMaps
const getSceneSet = (args: object) => api.scenesets.getSceneSets({ tree: 1, ...args} )
const getScennTags = (args: object) => api.tags.getTags({ tag_type: 3, ...args })

const fileList = ref()
const formState = reactive({
  name: undefined,
  map_version_obj: undefined,
  baiduSceneSets: undefined,
  xosc: null,
  labels: [],
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  isAdd 
    ? await api.scene.addScene({...formState, source: 0})
    : await api.scene.editScene({ id, data: {...formState, source: 0} })

  loading.value = false
  message.info( isAdd ? '上传成功' : '修改成功')
  goback()
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const scene = await api.scene.getScene(id)
     formState.name = scene.adsName
     formState.labels = scene.labels
     formState.baiduSceneSets = scene.baiduSceneSets
     formState.map_version_obj = scene.map_version_obj
    //  fileList.value = [scene.xosc]
   }
}
getEditData()

/****** 上传文件限制 */
const beforeUpload = (file: File) => {
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
      message.warning('文件不能大于50M！')
      return false
  }
  return false;
}

const onFileChange =  (info: UploadChangeParam) => {
  fileList.value = [info.file];
  formState.xosc = fileList.value?.[0]
}

const onRemove = () => {
  fileList.value = []
  formState.xosc = null
}
</script>