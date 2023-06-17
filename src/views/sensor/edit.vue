<template>
  <div class="breadcrumb">
    <router-link to="/sensor/">传感器管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <div v-if="isView" class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 55%" @finish="add">
      <a-form-item
        label="传感器名称："
        name="name"
        :rules="[
          { required: isAdd ? true : false, message: '请输入传感器名称'},
          { validator: () => checkChName(formState.name, 50) }
        ]"
      >
        <ch-input v-if="isAdd" v-model:value="formState.name" :maxlength="50" placeholder="请输入传感器名称"></ch-input>
        <template v-else>{{ formState.name }}</template>
      </a-form-item>
      <a-form-item label="传感器类型：" name="type" :rules="[{ required: isAdd ? true : false, message: '请选择传感器类型'}]">
        <scroll-select
          v-if="isAdd"
          allowClear
          v-model:value="formState.type"
          :options="sensorType.slice(1)"
          placeholder="请选择传感器类型"
        >
        </scroll-select>
        <template v-else>{{ formState.type_name }}</template>
      </a-form-item>
      <a-form-item label="传感器文件：" name="csv" :rules="[{ required: isAdd, message: '请上传传感器文件'}]">
        <single-upload
          v-if="!isView"
          class="inline-block pr-2"
          accept=".json"
          v-model:value="formState.csv"
          :desc="'选择文件'"
        ></single-upload>
        <template v-if="!formState.csv">{{ formState.csv_url }}</template>
      </a-form-item>
      <!-- <a-form-item v-if="!isAdd" label="传感器文件地址：">{{ formState.latestVersionUrl }} </a-form-item> -->
      <a-form-item label="描述" name="name">
        <a-textarea
          v-if="!isView"
          v-model:value="formState.desc"
          placeholder="请输入描述"
          rows="10"
          style="resize: none"
          maxlength="255"
        />
        <template v-else>{{ formState.desc }}</template>
      </a-form-item>
      <!-- <template v-if="isView">
        <a-form-item label="创建时间："
          ><span>{{ formState.create_time }}</span></a-form-item
        >
        <a-form-item label="修改时间："
          ><span>{{ formState.create_time }}</span></a-form-item
        >
        <a-form-item label="所属用户："
          ><span>{{ formState.create_user }}</span></a-form-item
        >
      </template> -->
      <a-form-item v-if="!isView" class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '新建' : '修改' }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { sensorType } from '@/utils/dict'
import { checkChName } from '@/utils/tools';

const id = useRoute().params.id
const { type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看传感器' : isAdd ? '上传传感器' : '修改传感器'
const sensorApi = api.sensor

const formState = reactive<any>({
  name: undefined,
  csv: null,
  desc: '',
  type: null,
  type_name: null
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/sensor')
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    type: formState.type,
    csv: formState.csv,
    desc: formState.desc
  }
  for (const key in params) {
    if (key !== 'desc') {
      if (params[key] === null || params[key] === undefined || params[key] === '') delete params[key]
    }
  }

  try {
    isAdd ? await sensorApi.add({ ...params }) : await sensorApi.edit({ id, data: { ...params } })
    loading.value = false
    message.info(isAdd ? '新建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await sensorApi.get(id)
    formState.name = res.name
    formState.csv = null
    formState.desc = res.desc
    formState.type = res.type
    formState.type_name = res.type_name
    formState.csv_url = res.csv_url
  }
}
getLookData()
</script>
