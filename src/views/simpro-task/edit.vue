<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form ref="form" :model="formState" :labelCol ="{ style: { width: '150px' } }"  style="width: 70%"
      @finish="add">
      <a-form-item label="任务名称" name="name" :rules="[
        { required: true, message: '请输入任务名称'}, 
        { validator: () => checkChName(formState.name, 50)}]">
        <ch-input v-model:value="formState.name" :maxlength="50" placeholder="请输入任务名称"></ch-input>
      </a-form-item> 
      <a-form-item label="控制在环" name="is_in_ring" :rules="[{ required: true, message: '请选择是否在环' }]">
        <a-select v-model:value="formState.is_in_ring" @change="onRingChanged">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
     <a-form-item label="算法" name="algorithm" :rules="[{ required: true, message: '请选择算法' }]">
        <scroll-select v-model:value="formState.algorithm" :api="getAlgorithm" placeholder="请选择算法"></scroll-select>
      </a-form-item>
      <a-form-item label="动力学挂载" name="mount" v-if="formState.is_in_ring == '1'" :rules="[{ required: true, message: '请选择是否动力学挂载' }]">
        <a-select v-model:value="formState.mount" @change="onMountChanged">
          <a-select-option key="1" value="1">内部</a-select-option>
          <a-select-option key="0" value="0">外部</a-select-option>
        </a-select>
      </a-form-item>
      <div v-show="formState.mount == '1'">
        <!-- <a-form-item label="动力学动态库" name="dynamic_lib"
          :rules="[{ required: formState.mount == '1' ? true : false, message: '请选择动力学动态库' }]">
          <scroll-select v-model:value="formState.dynamic_lib" 
            :api="baseApi.dll.getList" :is-set-default="isAdd" placeholder="请选择动力学动态库"></scroll-select>
        </a-form-item> -->
        <a-form-item label="动力学模型" name="dynamic_vehicle"
          :rules="[{ required: formState.mount == '1' ? true : false, message: '请选择动力学模型及版本' }]">
          <a-form-item-rest>
            <scroll-select v-model:value="formState.dynamic_model_id" 
              :api="baseApi.veticleModel.getList"
              :query="{is_share: 1}" placeholder="请选择动力学模型"
              @change="onVehicleChange"
              style="width:50%"></scroll-select>
            <!-- :is-set-default="isAdd" 下拉框自动填充值 -->
            <scroll-select v-model:value="formState.dynamic_vehicle" 
              :api="getVehicleVersions"
              :fieldNames="{label: 'full_version', value: 'id'}"
              :is-set-default="isAdd"
              placeholder="请选择动力学模型版本"
              style="width:50%"></scroll-select>
          </a-form-item-rest>
        </a-form-item>
        <!-- <a-form-item label="驾驶员模型" name="driver">
          <scroll-select v-model:value="formState.driver"
            :disabled="formState.is_in_ring === '0'"
            :api="baseApi.vehicle.getDrivers"
            placeholder="请选择驾驶员模型"></scroll-select>
        </a-form-item> -->
      <a-form-item label="动力学横向控制方式" name="vehicle_horizontal" 
        :rules="[{ required: formState.mount == '1' ? true : false, message: '请选择横向控制方式' }]">
          <a-select v-model:value="formState.vehicle_horizontal" :options="HorizontalOptions" placeholder="请选择横向控制方式"></a-select>
        </a-form-item>
      <a-form-item label="动力学纵向控制方式" name="vehicle_vertical" 
        :rules="[{ required: formState.mount == '1' ? true : false, message: '请选择纵向控制方式' }]">
          <a-select v-model:value="formState.vehicle_vertical" :options="VerticalOptions" placeholder="请选择纵向控制方式"></a-select>
        </a-form-item>
      </div>
      <!-- <a-form-item label="任务执行次数" name="batch" :rules="[{ required: true, message: '请输入任务执行次数'}]">
        <a-input-number readonly v-model:value="formState.batch" min="1" max="9999" placeholder="请输入任务执行次数"></a-input-number>
      </a-form-item> -->
      <a-form-item label="仿真频率" name="frequency" :rules="[{ required: true, message: '请输入仿真频率'}]">
        <a-input-number v-model:value="formState.frequency" :precision="0" min="10" max="200" placeholder="请输入仿真频率"></a-input-number>
      </a-form-item>
      <a-form-item label="感知在环" name="is_sensor" :rules="[{ required: true, message: '请选择感知在环' }]">
        <a-select v-model:value="formState.is_sensor">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="传感器" name="sensors" v-if="formState.is_sensor == '1'" :rules="[{ required: formState.is_sensor == '1' ? true :false, message: '请选择传感器'}]"> 
        <scroll-transfer v-model:target-keys="formState.sensors" :api="baseApi.sensor.getList"
          :titles="['可选传感器', '选中传感器']"></scroll-transfer>
      </a-form-item>
      <a-form-item label="评测指标" name="kpi" :rules="[{ required: true, message: '请选择评测指标'}]">
        <kpi-list v-model:target-keys="formState.kpi" :api="baseApi.kpi.getList"
          :titles="['可选评测指标', '选中评测指标']"></kpi-list>
      </a-form-item>
      <!-- <a-form-item v-if="isAdd" label="所属场景集" name="scenesets" :rules="[{ required: isAdd, message: '请先选择场景集，再选择场景' }]">
        <tree-select-async
            v-model:value="formState.scenesets" 
            placeholder="请选择所属场景集"
            :api="baseApi.scenesets.getList"
            :query="{version: 2}"
            @change="onScenesetChanged"></tree-select-async>
        </a-form-item>
      <a-form-item v-if="isAdd" label="场景" name="scenes" :rules="[{ required: isAdd, message: '请选择场景'}]">
        <scroll-transfer v-model:target-keys="formState.scenes" :api="getScenes" 
          :fieldNames="{label: 'adsName', value: 'baidu_id'}"
          :titles="['可选场景', '选中场景']"></scroll-transfer>
      </a-form-item>  -->
      <a-form-item v-if="isAdd"  label="场景" name="scenes" :rules="[{ required: isAdd, message: '请选择场景'}]">
        <scene-list v-model:value="formState.scenes"></scene-list>
      </a-form-item>
       <a-form-item label="场景" v-if="!isAdd">
        <ul class="view-list" v-if="formState.scenes?.length > 0">
          <li v-for="item in formState.scenes as any" :key="item">
            {{ item.adsName }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item :wrapper-col="{ style: { paddingLeft: '150px' }}">
        <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '创建' : '修改' }}
        </a-button>
        <a-button @click="goback">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools';
import { VerticalOptions, HorizontalOptions } from '@/utils/dict';
import KpiList from './components/kpi-list.vue'
import SceneList from './components/scene-list.vue'

const id = useRoute().params.id  || '0'
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '仿真任务'
const baseApi = api
const currentApi = api.task

const formState = reactive({
  name: undefined,
  // dynamic_lib: ''，
  dynamic_vehicle: undefined,
  dynamic_model_id: undefined,
  vehicle_horizontal: 0,
  vehicle_vertical: 0,
  sensors: [],
  is_in_ring: '0',
  is_sensor: '1',
  mount: '',
  driver: undefined,
  algorithm: undefined,
  // scenesets: undefined,
  scenes: [],
  batch: 1,
  frequency: 50,
  kpi: [],
  test: false
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
    // dynamic_lib: formState.dynamic_lib,
    dynamic_vehicle: formState.dynamic_vehicle,
    vehicle_horizontal: formState.vehicle_horizontal,
    vehicle_vertical: formState.vehicle_vertical,
    batch: formState.batch,
    mount: formState.mount,
    sensors: formState.is_sensor == '1' ? formState.sensors.map((item:any) =>item.value) : [],
    scenes: formState.scenes, //.map((item:any) =>item.value || item.baidu_id),
    kpi: formState.kpi.map((item:any) =>item.value),
    kpis_threshold: formState.kpi.map((item:any) => ({
      id: item.id,
      threshold_min: item.threshold.threshold_min,
      threshold_max: item.threshold.threshold_max,
      threshold_value: item.threshold.threshold_value,
    })),
    is_in_ring: formState.is_in_ring,
    driver: formState.driver,
    frequency: formState.frequency
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

const getVehicleVersions = ref()
const onVehicleChange = () => {
  formState.dynamic_vehicle = undefined
  getVehicleVersions.value = (args: any)  => api.veticleModel.getVersions({dynamic_model_id: formState.dynamic_model_id , ...args})
}

// const getScenes = ref()
// const onScenesetChanged = () => {
//   getScenes.value = (args: any)  => api.scene.getList({scene_set: formState.scenesets, ...args})
// }

const getAlgorithm = ref()
const onRingChanged = () => {
  formState.mount = formState.is_in_ring == '0' ? '0' : '1'
  getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
  formState.algorithm = undefined
  // 控制在环为‘是’时才显示动力学相关参数
  // 参数重置
  if(formState.is_in_ring == '0') {
    formState.driver = '' as any
    formState.vehicle_horizontal = 0
    formState.vehicle_vertical = 0
    formState.dynamic_vehicle = undefined
    // formState.dynamic_lib = ''
  }
}
const onMountChanged = () => {
  // 内部挂载时显示动力学相关参数
  // 参数重置
  if(formState.mount == '0') {
    formState.vehicle_horizontal = 0
    formState.vehicle_vertical = 0
    formState.dynamic_vehicle = undefined
    // formState.dynamic_lib = ''
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(isAdd) {
    if(!store.user.hasAcl('cloud:simulation:tasks:add'))
      return message.error('您没有执行该操作的权限')
   } else {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm_detail.id
    //  formState.dynamic_lib = data.dynamic_lib_detail?.id
     formState.dynamic_model_id = data.vehicle_detail?.dynamic_model_id
     formState.dynamic_vehicle = data.vehicle_detail?.id
     formState.vehicle_horizontal = data.vehicle_horizontal
     formState.vehicle_vertical = data.vehicle_vertical
     formState.is_sensor = data.sensors_detail.length ? '1' : '0'
     formState.sensors = data.sensors_detail
     formState.scenes= data.scenes_detail
     formState.kpi = data.kpi_detail.map((item: any) => ({
       id: item.id,
       name: item.name,
       threshold: {
        threshold_min: item.threshold_min,
        threshold_max: item.threshold_max,
        threshold_unit: item.threshold_unit,
        threshold_type: item.threshold_type,
        threshold_value: item.threshold_value,
       },
     }))
     formState.frequency = data.frequency
     formState.is_in_ring = data.is_in_ring ? '1' : '0',
     formState.driver = data.driver_detail?.id
     formState.mount = data.mount.toString()

     // dynamic_model_id为必填项，非空时再赋值
     if(formState.dynamic_model_id) {
      getVehicleVersions.value = (args: any)  => api.veticleModel.getVersions({dynamic_model_id: formState.dynamic_model_id, ...args})
     }
   }
   // 无论新建还是编辑都要默认加载算法
   getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
}
getEditData()

const form = ref()
// 自定义组件的变量，需要主动触发一下校验，以便消除红色提示
// watch(() => formState.scenesets, () => form.value.validateFields('scenesets'))
watch(() => formState.scenes, () => form.value.validateFields('scenes'))
watch(() => formState.kpi, () => form.value.validateFields('kpi'))
watch(() => formState.sensors, () => form.value.validateFields('sensors'))
watch(() => formState.dynamic_vehicle, () => form.value.validateFields('dynamic_vehicle'))
</script>

<style lang="less" scoped>
:deep(.ant-transfer) {
  .ant-transfer-list:first-child {
    width: 35%;
  }
  .ant-transfer-list:last-child {
    width: 65%;
  }
}
</style>