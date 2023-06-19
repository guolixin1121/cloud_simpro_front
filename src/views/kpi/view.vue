<template>
  <div class="breadcrumb">
    <router-link to="/kpi/">评测指标管理</router-link>
    <span class="breadcrumb--current">评测指标详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">评测指标详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '120px' } }"  style="width: 55%">
      <a-form-item label="评测指标ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="评测指标名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="评测指标类型" >
        {{ formState.kpi_type_name}}
      </a-form-item>
      <a-form-item label="指标文件地址" >
        {{ formState.py_url}}
      </a-form-item>
      <a-form-item label="描述">
        <span style="word-break: break-all;">{{ formState.desc }}</span>
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.create_date }}
      </a-form-item>
      <a-form-item label="修改时间">
        {{ formState.update_date }}
      </a-form-item>
      <a-form-item label="所属用户">
        {{ formState.create_user }}
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: undefined,
  desc: '',
  kpi_type_name: '',
  py_url: '',
  create_date: '',
  update_date: '',
  create_user: ''
})

const router = useRouter()
const goback = () => router.push('/kpi')

const getEditData = async () => {
   if(id !== '0') {
     const res = await api.kpi.getList({id})
     const data = res.results?.[0]
     formState.id = data.id
     formState.name = data.name
     formState.py_url = data.py_url
     formState.desc = data.desc
     formState.kpi_type_name = data.category_name
     formState.create_date = formatDate(data.create_date)
     formState.update_date = formatDate(data.update_time)
     formState.create_user = data.create_user
   }
}
getEditData()
</script>