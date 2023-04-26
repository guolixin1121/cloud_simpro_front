<template>
  <div class="breadcrumb">
    <router-link to="/simpro-task/">仿真任务</router-link>
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
        <scroll-select v-model:value="formState.dynamic_vehicle" :api="getVehicle"></scroll-select>
      </a-form-item>
     <a-form-item label="算法" name="algorithm" :rules="[{ required: true, message: '请选择算法!' }]">
        <scroll-select v-model:value="formState.algorithm" :api="optionsApi.algorithm.getList"></scroll-select>
      </a-form-item>
      <a-form-item label="任务执行次数" name="batch" :rules="[{ required: true, message: '请输入任务执行次数!'}]">
        <a-input-number v-model:value="formState.batch" min="1" placeholder="请输入任务执行次数"></a-input-number>
      </a-form-item>
      <a-form-item label="场景" name="scenes" :rules="[{ required: true, message: '请选择场景!'}]">
        <scroll-transfer v-model:target-keys="formState.scenes" :api="optionsApi.scene.getList" 
          :fieldNames="{label: 'adsName', value: 'baidu_id'}"
          :titles="['可选场景', '选中场景']"></scroll-transfer>
      </a-form-item> 
      <a-form-item label="评测指标" name="kpi" :rules="[{ required: true, message: '请选择评测指标!'}]">
        <scroll-transfer v-model:target-keys="formState.kpi" :api="optionsApi.kpi.getList"
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
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '仿真任务'
const optionsApi = api
const currentApi = api.task
const getVehicle = (arg: any) => api.vehicle.getList({ is_share: 1, ...arg })

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

  try {
    isAdd 
      ? await currentApi.add({...formState})
      : await currentApi.edit({ id, data: {...formState} })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.batch = data.batch
     formState.algorithm = data.algorithm
     formState.dynamic_vehicle = data.dynamic_vehicle
     formState.kpi = data.kpi_detail.map((v: any) => v.id)
     formState.scenes = data.scenes
   }
}
getEditData()
</script>