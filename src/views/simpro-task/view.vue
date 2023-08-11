<template>
  <form-view title="仿真任务详情" :items="formItems" :loading="loading" :labelWidth="labelWidth">
    <router-link to="/simpro-task/">仿真任务</router-link>
  </form-view>
</template>

<script setup lang="ts">
import { getTaskSourceName, getVerticalOptions, getHorizontalOptions } from '@/utils/dict'

const formItems = ref<FormItem[]>([])
const loading = ref(false)
const labelWidth = ref()

const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.task.get(useRoute().params.id)
    formItems.value = [
      { label: '任务ID', value: data.id },
      { label: '任务名称', value: data.name },
      { label: '任务来源', value: getTaskSourceName(data.source) },
      { label: '控制在环', value: data.is_in_ring ? '是' : '否'  },
      { label: '算法', value: data.algorithm_detail?.name },
      { label: '动力学挂载', value: data.mount == '1' ? '内部' : '外部', isShow: data.is_in_ring },
      { label: '动力学动态库', value: data.dynamic_lib_detail?.name, isShow: data.mount == '1' },
      { label: '车辆动力学', value: data.vehicle_detail?.name, isShow: data.mount == '1' },
      { label: '动力学横向控制方式', value: getHorizontalOptions(data.vehicle_horizontal), isShow: data.mount == '1' },
      { label: '动力学纵向控制方式', value: getVerticalOptions(data.vehicle_vertical), isShow: data.mount == '1' },
      { label: '仿真频率', value: data.frequency },
      { label: '感知在环', value: data.sensors_detail.length ? '是' : '否' },
      { label: '传感器', value: data.sensors_detail?.map((item: any) => item.name), isShow: data.sensors_detail.length >0 },
      { label: '评测指标', value: data.kpi_detail?.map((item: any) => item.name) },
      { label: '场景', value: data.scenes_detail?.map((item: any) => item.adsName) },
      { label: '创建时间', value: data.create_time },
      { label: '所属用户', value: data.create_user },
    ]
    labelWidth.value = data.mount == '1' ? 150 : 100
  } finally {
    loading.value = false
  }
}
getEditData()
</script>