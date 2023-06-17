<template>
  <div class="breadcrumb">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
    <span class="breadcrumb--current">逻辑场景详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">逻辑场景详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%">
      <a-form-item label="场景ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="场景名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="场景文件地址" >
        {{ formState.scene_url }}
      </a-form-item>
      <a-form-item label="配置文件地址" >
        {{ formState.config_url }}
      </a-form-item>
      <a-form-item label="关联地图">
        {{ formState.map_name + '_' + formState.map_version_num }}
      </a-form-item>
      <a-form-item label="标签">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.labels_detail as any" :key="item">
            {{ item.display_name }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.create_time }}
      </a-form-item>
      <a-form-item label="所属用户">
        {{ formState.create_user }}
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate, isDateProp } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  map_name: '',
  map_version_num: '',
  config_url: '',
  scene_url: '',
  labels_detail: [],
  create_time: '',
  create_user: ''
})

const router = useRouter()
const goback = () => router.push('/logic-scene')

const getEditData = async () => {
   if(id !== '0') {
      const data = await api.logicScene.get(id)
      for(const prop in formState) {
        formState[prop as keyof typeof formState] = isDateProp(prop) ? formatDate(data[prop]) : data[prop]
      }
   }
}
getEditData()
</script>