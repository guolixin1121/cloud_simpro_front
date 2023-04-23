<template>
  <div class="breadcrumb">
    <router-link to="/simpro/">仿真任务</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;"
      @finish="add">
      <a-form-item label="任务名称" name="name" :rules="[{ required: true, message: '请输入任务名称!'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景名称"></a-input>
      </a-form-item>
      <a-form-item label="主车模型" name="dynamic_vehicle" :rules="[{ required: true, message: '请选择主车模性!' }]">
        <scroll-select v-model:value="formState.dynamic_vehicle" :api="optionsApi.vehicle.getVehicle"></scroll-select>
      </a-form-item>
     <a-form-item label="算法" name="algorithm" :rules="[{ required: true, message: '请选择算法!' }]">
        <scroll-select v-model:value="formState.algorithm" :api="optionsApi.algorithm.getAlgorithms"></scroll-select>
      </a-form-item>
      <a-form-item label="任务执行次数" name="batch" :rules="[{ required: true, message: '请输入任务执行次数!'}]">
        <a-input-number v-model:value="formState.batch" min="1" placeholder="请输入任务执行次数"></a-input-number>
      </a-form-item>
      <a-form-item label="场景" name="scenes" :rules="[{ required: true, message: '请选择场景!'}]">
        <scroll-transfer v-model:target-keys="formState.scenes" :api="optionsApi.scene.getScenes" 
          :fieldNames="{label: 'adsName', value: 'id'}"
          :titles="['可选场景', '选中场景']"></scroll-transfer>
      </a-form-item> 
      <a-form-item label="评测指标" name="kpi" :rules="[{ required: true, message: '请选择评测指标!'}]">
        <scroll-transfer v-model:target-keys="formState.kpi" :api="optionsApi.kpi.getKpis"
          :titles="['可选评测指标', '选中评测指标']"></scroll-transfer>
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
const id = useRoute().params.id
const isAdd = id === '0'
const title =  isAdd ? '创建仿真任务' : '修改仿真任务'
const optionsApi = api
const simproApi = api.simpro

const formState = reactive({
  name: undefined,
  dynamic_vehicle: undefined,
  algorithm: undefined,
  scenes: [],
  batch: undefined,
  kpi: []
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  isAdd 
    ? await simproApi.addSimproTask({...formState, source: 0})
    : await simproApi.editSimproTask({ id, data: {...formState, source: 0} })

  loading.value = false
  message.info( isAdd ? '上传成功' : '修改成功')
  goback()
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await simproApi.getSimproTask(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm
     formState.dynamic_vehicle = data.dynamic_vehicle
     formState.kpi = data.kpi
     formState.scenes = data.scenes
   }
}
getEditData()
</script>