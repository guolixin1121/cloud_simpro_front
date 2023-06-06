<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">场景详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">场景详情</span>
    <a-spin :spinning="loading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;">
        <a-form-item label="场景ID">
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="场景名称">
          {{ formState.adsName }}
        </a-form-item>
        <a-form-item label="场景来源" >
          {{ getSceneSourceName(formState.adsSource) }}
        </a-form-item>
        <a-form-item label="所属场景集">
          {{ formState.sceneset_name }}
        </a-form-item>
        <a-form-item label="关联地图">
          {{ formState.mapName + '_' + formState.mapVersion }}
        </a-form-item>
        <a-form-item label="场景文件地址" >
          {{ formState.adsUrl }}
        </a-form-item>
        <a-form-item label="场景路径">
          {{ formState.sceneset_name + '/' + formState.adsName }}
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list">
            <li class="mb-2" v-for="item in formState.labels_detail as any" :key="item">
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
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { getSceneSourceName } from '@/utils/dict';
import { formatDate, isDateProp } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  adsName: '',
  mapName: '',
  mapVersion: '',
  sceneset_name: '',
  adsSource: '',
  adsUrl: '',
  labels_detail: [],
  createTime: '',
  updateTime: '',
  createUser: ''
})

const router = useRouter()
const goback = () => router.push('/scene/')

const loading = ref(false)
const getEditData = async () => {
   if(id !== '0') {
      loading.value = true
      try {
        const scene = await api.scene.get(id)
        for(const prop in formState) {
          formState[prop as keyof typeof formState] = isDateProp(prop) ? formatDate(scene[prop]) : scene[prop]
        }
      } finally {
        loading.value = false
      }
   }
}
getEditData()
</script>