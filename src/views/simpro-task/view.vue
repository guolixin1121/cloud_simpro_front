<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">仿真任务详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">仿真任务详情</span>
    <a-spin :spinning="loading">
      
      <a-form class="view-form" :labelCol ="{ style: { width: labelWidth + 'px' } }"  style="width: 55%">
        <a-form-item label="任务ID">
          {{ formState.number }}
        </a-form-item>
        <a-form-item label="任务名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="任务来源">
          {{ getTaskSourceName(formState.source) }}
        </a-form-item>
        <a-form-item label="控制在环">
          {{ formState.is_in_ring ? '是' : '否' }}
        </a-form-item>
        <a-form-item label="算法">
          {{ formState.algorithm_detail?.name }}
        </a-form-item>
        <a-form-item label="动力学挂载" v-if="formState.is_in_ring">
          {{ formState.mount == '1' ? '内部' : '外部' }}
        </a-form-item>
        <!-- <a-form-item label="动力学动态库" v-if="formState.mount == '1'">
          {{ formState.dynamic_lib_detail?.name }}
        </a-form-item> -->
        <a-form-item label="动力学模型" v-if="formState.mount == '1'">
          {{ formState.vehicle_detail?.dynamic_model_name + '_' + formState.vehicle_detail?.version }}
        </a-form-item>
        <a-form-item label="动力学横向控制方式" v-if="formState.mount == '1'">
          {{ getHorizontalOptions(formState.vehicle_horizontal) }}
        </a-form-item>
        <a-form-item label="动力学纵向控制方式" v-if="formState.mount == '1'">
          {{ getVerticalOptions(formState.vehicle_vertical) }}
        </a-form-item>
        <a-form-item label="仿真频率">
          {{ formState.frequency }}
        </a-form-item>
        <a-form-item label="单场景仿真时长">
          {{ formState.single_sim_time + '秒' }}
        </a-form-item>
        <a-form-item label="感知在环">
          {{ formState.sensors_detail.length ? '是' : '否'  }}
        </a-form-item>
        <a-form-item label="传感器">
          <ul v-if="formState.sensors_detail.length > 0" class="view-list">
            <li v-for="(val, index) in formState.sensors_detail" :key="index">
              {{ val.name }}
            </li>
          </ul>
          <span v-else>--</span>
        </a-form-item>
        <a-form-item label="评测指标">
          <a-table bordered style="margin-top: 0px" :pagination="false" :columns="thresholdColumns" :dataSource="formState.kpi_detail">
            <template #bodyCell="{record, column}">
              <template v-if="column.dataIndex == 'threshold_type'">
                <template v-if="record.threshold_type == 0">
                  <span>{{ record.threshold_min }}</span>
                  <span class="mx-1">-</span>
                  <span>{{ record.threshold_max }}</span>
                </template>
                <template v-else-if="record.threshold_type == 1">
                  <img src="../../assets/images/icon_dayu.png" style="width: 16px"/>
                  <span>{{ record.threshold_min }}</span>
                </template>
                <template v-else-if="record.threshold_type == 2">
                  <img src="../../assets/images/icon_xiaoyu.png" style="width: 16px"/>
                  <span>{{ record.threshold_max }}</span>
                </template>
                <template v-else-if="record.threshold_type == 3">
                  <span>=</span>
                  <span>{{ record.threshold_value }}</span>
                </template>
                <template v-else-if="record.threshold_type == 4">
                  {{ '' }}
                  <!-- {{ record.threshold_value == '0' ? '否' : '是'}} -->
                </template>
              </template>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="场景">
          <ul v-if="formState.scenes_detail.length > 0" class="view-list">
            <li v-for="(val, index) in formState.scenes_detail" :key="index">
              {{ val.adsName }}
            </li>
          </ul>
          <span v-else>--</span>
        </a-form-item>
        <a-form-item label="创建时间">
          {{ formatDate(formState.create_time) }}
        </a-form-item>
        <a-form-item label="所属用户">
          {{ formState.create_user }}
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
import { getTaskSourceName, getVerticalOptions, getHorizontalOptions } from '@/utils/dict'

const loading = ref(false)
const labelWidth = ref()
const formState = reactive({
  number: '',
  name: '',
  source: '',
  is_in_ring: '',
  algorithm_detail: { name: '' },
  mount: '0',
  single_sim_time: '',
  dynamic_lib_detail: { name: ''},
  vehicle_detail:  { dynamic_model_name: '', version: ''},
  vehicle_horizontal: '',
  vehicle_vertical: '',
  frequency: '',
  sensors_detail: [{ name: '' }],
  kpi_detail: [{ name: '' }],
  scenes_detail: [{ adsName: '' }],
  create_time: '',
  create_user: ''
})

const thresholdColumns = [
  { dataIndex: 'name', title: '指标名称'},
  { dataIndex: 'threshold_type', title: '指标阈值'},
  { dataIndex: 'threshold_unit', title: '指标单位'}
]

const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.task.get(useRoute().params.id)
    for(let prop in formState) {
      formState[prop as keyof typeof formState] = data[prop] || ''
    }
    labelWidth.value = data.mount == '1' ? 130 : 110
  } finally {
    loading.value = false
  }
}
getEditData()
</script>

<style lange="less" scoped>
.flex {
  align-items: center;
  img {
    height: 16px;
  }
}
</style>