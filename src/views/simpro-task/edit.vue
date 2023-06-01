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
     <a-form-item label="算法" name="algorithm" :rules="[{ required: true, message: '请选择算法' }]">
        <scroll-select v-model:value="formState.algorithm" :api="optionsApi.algorithm.getList" placeholder="请选择算法"></scroll-select>
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
      <a-form-item v-if="isAdd" label="所属场景集" name="scenesets" :rules="[{ required: isAdd, message: '请选择场景集' }]">
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
          <li class="mb-2" v-for="item in formState.scenes_detail as any" :key="item">
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

const formState = reactive({
  name: undefined,
  dynamic_vehicle: undefined,
  vehicle_horizontal: 0,
  vehicle_vertical: 0,
  sensors: [],
  algorithm: undefined,
  scenesets: undefined,
  scenes: [],
  scenes_detail: [],
  batch: 1,
  kpi: []
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/simpro-task')
const add = async () => {
  loading.value = true

  const params = {...formState, source:0 }
  delete params.scenesets

  try {
    isAdd 
      ? await currentApi.add(params)
      : await currentApi.edit({ id, data: params })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

const onScenesetChanged = () => {
  getScenes.value = (args: any)  => api.scene.getList({scene_set: formState.scenesets, ...args})
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm
     formState.dynamic_vehicle = data.dynamic_vehicle
     formState.vehicle_horizontal = data.vehicle_vertical
     formState.vehicle_vertical = data.vehicle_vertical
     formState.sensors = data.sensors
     formState.scenes_detail = data.scenes_detail
     formState.scenes= data.scenes_detail?.map((v: RObject) => v.baidu_id)
     formState.kpi = data.kpi_detail?.map((v: any) => v.id)
   }
}
getEditData()
</script>