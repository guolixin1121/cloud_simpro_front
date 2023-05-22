<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">仿真任务详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">仿真任务详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;">
      <a-form-item label="任务ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="任务名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="任务来源">
        {{ getTaskSourceName(formState.source) }}
      </a-form-item>
      <a-form-item label="主车模型">
        {{ formState.vehicle_detail?.name }}
      </a-form-item>
      <a-form-item label="仿真执行次数" >
        {{ formState.batch }}
      </a-form-item>
      <a-form-item label="算法">
        {{ formState.algorithm_detail?.name }}
      </a-form-item>
      <a-form-item label="场景">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.scenes_detail as any" :key="item">
            {{ item.adsName }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="评测指标">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.kpi_detail as any" :key="item">
            {{ item.name }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="任务执行次数">
        {{ formState.batch }}
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.createTime }}
      </a-form-item>
      <a-form-item label="所属用户">
        {{ formState.createUser }}
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { getTaskSourceName } from '@/utils/dict';
import { formatDate } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  source: '',
  vehicle_detail: { name: '' },
  algorithm_detail: { name: '' },
  kpi_detail: [],
  scenes_detail: [],
  batch: '',
  createTime: '',
  createUser: ''
})

const router = useRouter()
const goback = () => router.go(-1)

const getEditData = async () => {
   if(id !== '0') {
     const data = await api.task.get(id)
     formState.id = data.id
     formState.name = data.name
     formState.batch = data.batch
     formState.source = data.source
     formState.algorithm_detail = data.algorithm_detail
     formState.kpi_detail = data.kpi_detail
     formState.vehicle_detail = data.vehicle_detail
     formState.scenes_detail = data.scenes_detail
     formState.createTime = formatDate(data.create_time)
     formState.createUser = data.create_user
   }
}
getEditData()
</script>