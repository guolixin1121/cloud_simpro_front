<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '150px' } }"  style="width: 55%"
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
        <a-form-item label="车辆动力学" name="dynamic_vehicle"
          :rules="[{ required: formState.mount == '1' ? true : false, message: '请选择主车模型' }]">
          <scroll-select v-model:value="formState.dynamic_vehicle" 
            :api="baseApi.vehicle.getList"
            :query="{is_share: 1}" placeholder="请选择主车模型"></scroll-select>
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
      <a-form-item label="任务执行次数" name="batch" :rules="[{ required: true, message: '请输入任务执行次数'}]">
        <a-input-number readonly v-model:value="formState.batch" min="1" max="9999" placeholder="请输入任务执行次数"></a-input-number>
      </a-form-item>
      <a-form-item label="仿真频率" name="frequency" :rules="[{ required: true, message: '请输入仿真频率'}]">
        <a-input-number v-model:value="formState.frequency" :precision="0" min="10" max="200" placeholder="请输入仿真频率"></a-input-number>
      </a-form-item>
      <a-form-item label="传感器" name="sensors">
        <scroll-transfer v-model:target-keys="formState.sensors" :api="baseApi.sensor.getList"
          :titles="['可选传感器', '选中传感器']"></scroll-transfer>
      </a-form-item>
      <a-form-item label="评测指标" name="kpi" :rules="[{ required: true, message: '请选择评测指标'}]">
        <scroll-transfer v-model:target-keys="formState.kpi" :api="baseApi.kpi.getList"
          :titles="['可选评测指标', '选中评测指标']"></scroll-transfer>
      </a-form-item>
      <a-form-item v-if="isAdd" label="所属场景集" name="scenesets" :rules="[{ required: isAdd, message: '请先选择场景集，再选择场景' }]">
        <!-- <tree-select v-model:value="formState.scenesets" 
            :api="baseApi.scenesets.getList"
            placeholder="请选择所属场景集"
            @change="onScenesetChanged"></tree-select>   -->
        <tree-select-async
            v-model:value="formState.scenesets" 
            placeholder="请选择所属场景集"
            :api="baseApi.scenesets.getList"
            :query="{version: 2}"
            @change="onScenesetChanged"></tree-select-async>
        <!-- <tree-select v-model:value="formState.scenesets" 
            :api="baseApi.scenesets.getList"
            :query="{version: 2}"
            :lazy="true"
            placeholder="请选择所属场景集"
            :fieldNames="{label: 'groupName', value: 'id'}"
            @change="onScenesetChanged"></tree-select> -->
        </a-form-item>
      <a-form-item v-if="isAdd" label="场景" name="scenes" :rules="[{ required: isAdd, message: '请选择场景'}]">
        <scroll-transfer v-model:target-keys="formState.scenes" :api="getScenes" 
          :fieldNames="{label: 'adsName', value: 'baidu_id'}"
          :titles="['可选场景', '选中场景']"></scroll-transfer>
      </a-form-item> 
       <a-form-item label="场景" v-if="!isAdd">
        <ul class="view-list" v-if="formState.scenes?.length > 0">
          <li class="mb-2" v-for="item in formState.scenes as any" :key="item">
            {{ item.adsName }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item :wrapper-col="{ style: { paddingLeft: '150px' }}">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '创建' : '修改' }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools';
import { VerticalOptions, HorizontalOptions } from '@/utils/dict';
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '仿真任务'
const baseApi = api
const currentApi = api.task

const formState = reactive({
  name: undefined,
  dynamic_vehicle: '',
  vehicle_horizontal: 1,
  vehicle_vertical: 1,
  sensors: [],
  is_in_ring: '0',
  mount: '',
  driver: undefined,
  algorithm: undefined,
  scenesets: undefined,
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
    dynamic_vehicle: formState.dynamic_vehicle,
    vehicle_horizontal: formState.vehicle_horizontal,
    vehicle_vertical: formState.vehicle_vertical,
    batch: formState.batch,
    mount: formState.mount,
    sensors: formState.sensors.map((item:any) =>item.value),
    scenes: formState.scenes.map((item:any) =>item.value || item.baidu_id),
    kpi: formState.kpi.map((item:any) =>item.value),
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

const getScenes = ref()
const onScenesetChanged = () => {
  getScenes.value = (args: any)  => api.scene.getList({scene_set: formState.scenesets, ...args})
}

const getAlgorithm = ref()
const onRingChanged = () => {
  formState.mount = formState.is_in_ring == '0' ? '' : '1'
  getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
  formState.algorithm = undefined
  if(formState.is_in_ring == '0') {
    formState.driver = '' as any
  }
}
const onMountChanged = () => {
  if(formState.mount == '0') {
    formState.vehicle_horizontal = 1
    formState.vehicle_vertical = 1
    formState.dynamic_vehicle = ''
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm_detail?.id
     formState.dynamic_vehicle = data.vehicle_detail?.id
     formState.vehicle_horizontal = data.vehicle_horizontal
     formState.vehicle_vertical = data.vehicle_vertical
     formState.sensors = data.sensors_detail
     formState.scenes= data.scenes_detail
     formState.kpi = data.kpi_detail
     formState.is_in_ring = data.is_in_ring ? '1' : '0',
     formState.driver = data.driver_detail.id
     formState.mount = data.mount.toString()
   }
   getAlgorithm.value = (args: any)  => api.algorithm.getList({is_in_ring: formState.is_in_ring, ...args})
}
getEditData()
</script>