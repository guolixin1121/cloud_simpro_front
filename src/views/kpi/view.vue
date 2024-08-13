<template>
  <div class="breadcrumb">
    <router-link to="/kpi/">评测指标管理</router-link>
    <span class="breadcrumb--current">评测指标详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">评测指标详情</span>
    <a-spin :spinning="loading">
      <a-form :labelCol ="{ style: { width: '100px' } }"  style="width: 55%">
        <a-form-item label="评测指标ID">
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="评测指标名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="评测指标类型">
          {{ formState.category_name }}
        </a-form-item>
        <a-form-item label="指标阈值">
          <div class="flex">
          <template v-if="formState.threshold?.threshold_type == '0'">
              <div class="flex">
                  <span>{{ formState.threshold.threshold_min }}</span>
                  <img src="../../assets/images/icon_to.png" style="width: 16px"/>
                  <span>{{ formState.threshold.threshold_max }}</span>
              </div>
          </template>
          <template v-else-if="formState.threshold?.threshold_type == '1'">
              <div class="flex">
                  <img src="../../assets/images/icon_dayu.png" style="width: 16px"/>
                  <span>{{ formState.threshold.threshold_min }}</span>
              </div>
          </template>
          <template v-else-if="formState.threshold?.threshold_type == '2'" >
              <div class="flex">
                <img src="../../assets/images/icon_xiaoyu.png" style="width: 16px"/>
                <span>{{ formState.threshold.threshold_max }}</span>
              </div>
          </template>
          <template v-else-if="formState.threshold?.threshold_type == '3'">
              <div class="flex">
                  <span style="width:16px">=</span>
                  <span>{{ formState.threshold.threshold_value }}</span>
              </div>
          </template>
          <template v-else>--</template>
          <!-- <template v-if="formState.threshold?.threshold_type == '4'">
              {{ formState.threshold.threshold_value == '0' ? '否' : '是'}}
          </template> -->
          <span class="ml-2">{{ formState.threshold.threshold_unit }}</span>
          </div>
        </a-form-item>
        <a-form-item label="指标文件地址">
          {{ formState.py_url || '--' }}
        </a-form-item>
        <a-form-item label="描述">
          <span class="break-text">{{ formState.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="创建时间">
          {{ formatDate(formState.create_date) }}
        </a-form-item>
        <a-form-item label="修改时间">
          {{ formatDate(formState.update_time) }}
        </a-form-item>
        <a-form-item label="所属用户">
          {{ formState.create_user || '--' }}
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools'
// const formItems = ref<FormItem[]>([])
const loading = ref(false)
const formState = reactive({
  id: '',
  name: '',
  category_name: '',
  threshold: { threshold_type: '', threshold_min: '', threshold_max: '', threshold_value: '', threshold_unit: ''},
  py_url: '',
  desc: '',
  create_date: '',
  update_time: '',
  create_user: ''
})

const getEditData = async () => {
  try {
    loading.value = true
    const res = await api.kpi.getList({id: useRoute().params.id})
    const data = res.results?.[0]
    for(let prop in formState) {
      formState[prop as keyof typeof formState] = data[prop]
    }
    // formItems.value = [
    //   { label: '评测指标ID', value: data.id },
    //   { label: '评测指标名称', value: data.name },
    //   { label: '评测指标类型', value: data.category_name },
    //   { label: '指标文件地址', value: data.py_url },
    //   { label: '指标值', value: data.threshold?.threshold_unit },
    //   { label: '描述', value: data.desc },
    //   { label: '创建时间', value: data.create_date },
    //   { label: '修改时间', value: data.update_time },
    //   { label: '所属用户', value: data.create_user },
    // ]
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