<template>
  <div class="breadcrumb">
    <router-link to="/sceneset/">场景集管理</router-link>
    <span class="breadcrumb--current">场景集详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">场景集详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;">
      <a-form-item label="场景集ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="场景集名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="父场景集">
        {{ formState.parentName }}
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
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: undefined,
  parentName: '',
  labels: [],
  createTime: '',
  updateTime: ''
})

const router = useRouter()
const goback = () => router.go(-1)

const getEditData = async () => {
   if(id !== '0') {
     const sceneset = await api.scenesets.get(id)
     formState.id = sceneset.id
     formState.name = sceneset.name
     formState.parentName = sceneset.parentName
     formState.labels = sceneset.labels_detail || []
     formState.createTime = formatDate(sceneset.create_time)
     formState.updateTime = formatDate(sceneset.update_time)
   }
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