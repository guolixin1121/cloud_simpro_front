<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '150px' } }"  style="width: 550px;"
      @finish="add">
      <a-form-item label="任务名称" name="name" :rules="[{ required: true, message: '请输入任务名称'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
      </a-form-item> 
      <a-form-item label="控制在环" name="is_in_ring" :rules="[{ required: true, message: '请选择是否在环' }]">
        <a-select v-model:value="formState.is_in_ring">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
     <a-form-item label="算法" name="algorithm" :rules="[{ required: true, message: '请选择算法' }]">
        <scroll-select v-model:value="formState.algorithm" :api="getAlgorithm" placeholder="请选择算法"></scroll-select>
      </a-form-item>
      <a-form-item label="车辆动力学" name="dynamic_vehicle" :rules="[{ required: true, message: '请选择主车模型' }]">
        <scroll-select v-model:value="formState.dynamic_vehicle" :api="getVehicle" placeholder="请选择主车模型"></scroll-select>
      </a-form-item>
     <a-form-item label="动力学横向控制方式" name="vehicle_horizontal" :rules="[{ required: true, message: '请选择横向控制方式' }]">
        <a-select v-model:value="formState.vehicle_horizontal" :options="HorizontalOptions" placeholder="请选择横向控制方式"></a-select>
      </a-form-item>
     <a-form-item label="动力学纵向控制方式" name="vehicle_vertical" :rules="[{ required: true, message: '请选择纵向控制方式' }]">
        <a-select v-model:value="formState.vehicle_vertical" :options="VerticalOptions" placeholder="请选择纵向控制方式"></a-select>
      </a-form-item>
      <a-form-item label="任务执行次数" name="batch" :rules="[{ required: true, message: '请输入任务执行次数'}]">
        <a-input-number v-model:value="formState.batch" min="1" max="9999" placeholder="请输入任务执行次数"></a-input-number>
      </a-form-item>
      <a-form-item label="传感器" name="kpi" :rules="[{ required: true, message: '请选择传感器'}]">
        <scroll-transfer v-model:target-keys="formState.sensors" :api="optionsApi.sensor.getList"
          :titles="['可选传感器', '选中传感器']"></scroll-transfer>
      </a-form-item>
      <a-form-item label="评测指标" name="kpi" :rules="[{ required: true, message: '请选择评测指标'}]">
        <scroll-transfer v-model:target-keys="formState.kpi" :api="optionsApi.kpi.getList"
          :titles="['可选评测指标', '选中评测指标']"></scroll-transfer>
      </a-form-item>
      <a-form-item v-if="isAdd" label="所属场景集" name="scenesets" :rules="[{ required: isAdd, message: '请先选择场景集，再选择场景' }]">
          <tree-select v-model:value="formState.scenesets" :api="getSceneSet"
            placeholder="请选择所属场景集"
            @change="onScenesetChanged"></tree-select>
        </a-form-item>
      <a-form-item v-if="isAdd" label="场景" name="scenes" :rules="[{ required: isAdd, message: '请选择场景'}]">
        <scroll-transfer v-model:target-keys="formState.scenes" :api="getScenes" 
          :fieldNames="{label: 'adsName', value: 'baidu_id'}"
          :titles="['可选场景', '选中场景']"></scroll-transfer>
      </a-form-item> 
       <a-form-item label="场景" v-if="!isAdd">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.scenes as any" :key="item">
            {{ item.adsName }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '创建' : '修改' }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { VerticalOptions, HorizontalOptions } from '@/utils/dict';
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '仿真任务'
const optionsApi = api
const currentApi = api.task
const getScenes = ref()
const getSceneSet = (args: object) => api.scenesets.getList({ tree: 1, ...args })
const getVehicle = (arg: any) => api.vehicle.getList({ is_share: 1, ...arg })
const getAlgorithm = ref((args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args}))

const formState = reactive({
  name: undefined,
  dynamic_vehicle: undefined,
  vehicle_detail: undefined,
  vehicle_horizontal: 1,
  vehicle_vertical: 1,
  sensors: [],
  is_in_ring: '0',
  algorithm: undefined,
  scenesets: undefined,
  scenes: [],
  batch: 1,
  kpi: []
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/simpro-task')
const add = async () => {
  loading.value = true

  const data = {
    source: 0,
    name: formState.name,
    algorithm: formState.algorithm,
    dynamic_vehicle:formState.dynamic_vehicle,
    vehicle_horizontal: formState.vehicle_horizontal,
    vehicle_vertical: formState.vehicle_vertical,
    batch: formState.batch,
    sensors: formState.sensors.map((item:any) =>item.value),
    scenes: formState.scenes.map((item:any) =>item.value || item.baidu_id),
    kpi: formState.kpi.map((item:any) =>item.value),
    is_in_ring: formState.is_in_ring
  }

  try {
    isAdd 
      ? await currentApi.add(data)
      : await currentApi.edit({ id, data })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

const onScenesetChanged = () => {
  getScenes.value = (args: any)  => api.scene.getList({scene_set: formState.scenesets, ...args})
}

watch(
  () => formState.is_in_ring,
  () => {
    formState.algorithm = undefined
    getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
  }
)

// const onRingChanged = () => {
//   getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
// }

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm_detail?.id
     formState.dynamic_vehicle = data.vehicle_detail.id
     formState.vehicle_horizontal = data.vehicle_vertical
     formState.vehicle_vertical = data.vehicle_vertical
     formState.sensors = data.sensors_detail
     formState.scenes= data.scenes_detail
     formState.kpi = data.kpi_detail
   }
}
getEditData()
</script>