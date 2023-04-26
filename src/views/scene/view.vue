<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">场景详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">场景详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;">
      <a-form-item label="场景ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="场景名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="场景来源" >
        {{ getSceneSourceName(formState.adsSource) }}
      </a-form-item>
      <a-form-item label="所属场景集">
        {{ formState.baiduSceneSets }}
      </a-form-item>
      <a-form-item label="关联地图">
        {{ formState.map_version_obj }}
      </a-form-item>
      <a-form-item label="场景文件" >
        <a-upload disabled :fileList="fileList"></a-upload>
      </a-form-item>
      <a-form-item label="标签">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.labels as any" :key="item">
            {{ item.display_name }}
          </li>
        </ul>
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
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
import { getSceneSourceName } from '@/utils/dict';
const id = useRoute().params.id

const fileList = ref()
const formState = reactive({
  id: '',
  name: undefined,
  map_version_obj: undefined,
  baiduSceneSets: undefined,
  adsSource: '',
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
     const scene = await api.scene.get(id)
     formState.id = scene.id
     formState.name = scene.adsName
     formState.labels = scene.labels_detail
     formState.adsSource = scene.adsSource
     formState.createTime = formatDate(scene.createTime)
     formState.updateTime = formatDate(scene.updateTime)
     formState.createUser = scene.createUser
    //  fileList.value = [scene.xosc]

     getSceneSet(scene)
   }
}

const getSceneSet = async (data: any) => {
  let res = await api.scenesets.get(data.baiduSceneSets)
  formState.baiduSceneSets = res.name

  res = await api.maps.getMap(data.map_version_obj)
  formState.map_version_obj = res.name
}
getEditData()
</script>

<style lang="less">
.view-list {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  height: 260px;
  width: 220px;
  overflow: auto;
  padding: 8px 10px;
  margin-top: 5px;
}
</style>