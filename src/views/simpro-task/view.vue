<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">仿真任务详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">仿真任务详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '150px' } }"  style="width: 55%">
      <a-form-item label="任务ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="任务名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="任务来源">
        {{ getTaskSourceName(formState.source) }}
      </a-form-item>
      <a-form-item label="是否控制在环">
        {{ formState.is_in_ring ? '是' : '否' }}
      </a-form-item>
      <a-form-item label="算法">
        {{ formState.algorithm_detail?.name }}
      </a-form-item>
      <a-form-item label="动力学挂载" v-if="formState.is_in_ring">
        {{ formState.mount == '1' ? '内部' : '外部' }}
      </a-form-item>
      <a-form-item label="车辆动力学"  v-if="formState.mount == '1'">
        {{ formState.vehicle_detail?.name }}
      </a-form-item>
      <!-- <a-form-item label="驾驶员模型">
        {{ formState.driver_detail?.name }}
      </a-form-item> -->
      <a-form-item label="动力学横向控制方式" v-if="formState.mount == '1'">
        {{ getHorizontalOptions(formState.vehicle_horizontal) }}
      </a-form-item>
      <a-form-item label="动力学纵向控制方式"  v-if="formState.mount == '1'">
        {{ getVerticalOptions(formState.vehicle_vertical) }}
      </a-form-item>
      <a-form-item label="仿真执行次数" >
        {{ formState.batch }}
      </a-form-item>
      <a-form-item label="仿真频率" >
        {{ formState.frequency }}
      </a-form-item>

      <a-form-item label="传感器" v-if="formState.sensors_detail?.length > 0">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.sensors_detail as any" :key="item">
            {{ item.name }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="评测指标">
        <ul class="view-list"  v-if="formState.kpi_detail?.length > 0">
          <li class="mb-2" v-for="item in formState.kpi_detail as any" :key="item">
            {{ item.name }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="场景">
        <ul class="view-list"  v-if="formState.scenes_detail?.length > 0">
          <li class="mb-2" v-for="item in formState.scenes_detail as any" :key="item">
            {{ item.adsName }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.createTime }}
      </a-form-item>
      <a-form-item label="所属用户">
        {{ formState.create_user }}
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { getTaskSourceName, getVerticalOptions, getHorizontalOptions } from '@/utils/dict';
import { formatDate } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  source: '',
  is_in_ring: '',
  driver_detail: { name: '' },
  vehicle_horizontal:'',
  vehicle_vertical:'',
  vehicle_detail: { name: '' },
  algorithm_detail: { name: '' },
  kpi_detail: [],
  scenes_detail: [],
  sensors_detail: [],
  batch: '',
  frequency: '',
  createTime: '',
  create_user: '',
  mount: ''
})

const getEditData = async () => {
   if(id !== '0') {
     const data = await api.task.get(id)

    for(const prop in formState) {
      formState[prop as keyof typeof formState] = data[prop]
    }
    formState.createTime = formatDate(data.create_time)
   }
}
getEditData()
</script>