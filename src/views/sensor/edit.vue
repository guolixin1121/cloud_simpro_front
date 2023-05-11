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
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px" @finish="add">
      <a-form-item
        label="传感器名称："
        name="name"
        :rules="[
          { required: isAdd ? true : false, message: '请输入传感器名称!' },
          { min: 2, max: 50, message: '传感器名称长度为2到50位' }
        ]"
      >
        <a-input v-if="isAdd" v-model:value="formState.name" maxlength="50" placeholder="请输入传感器名称"></a-input>
        <template v-else>{{ formState.name }}</template>
      </a-form-item>
      <a-form-item
        label="传感器类型："
        name="mapType"
        :rules="[{ required: isAdd ? true : false, message: '请选择传感器类型!' }]"
      >
        <scroll-select
          v-if="isAdd"
          allowClear
          v-model:value="formState.mapType"
          :options="MapManageSourceOptions"
          placeholder="请选择传感器类型"
        >
        </scroll-select>
        <template v-else>{{ formState.mapTypeName }}</template>
      </a-form-item>
      <a-form-item label="传感器文件：" name="xodr" :rules="[{ required: isAdd, message: '请上传传感器文件!' }]">
        <a-upload
          v-if="!isView"
          accept=".xodr"
          :fileList="fileList"
          :before-upload="beforeUpload"
          @remove="onRemove"
          @change="onFileChange"
        >
          <a-button :disabled="isView">选择文件</a-button>
          <span class="ml-2" v-if="!isAdd">{{ formState.mapFileName }}</span>
        </a-upload>
        <template v-else>{{ formState.mapFileName }}</template>
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
import type { UploadChangeParam } from 'ant-design-vue'
import { formatDate } from '@/utils/tools'
import { MapManageSourceOptions } from '@/utils/dict'

const id = useRoute().params.id
const { type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看传感器' : isAdd ? '上传传感器' : '修改传感器'
const mapApi = api.maps

const fileList = ref()
const formState = reactive<any>({
  name: undefined,
  catalog: null,
  xodr: null,
  desc: '',
  latestVersion: '',
  latestVersionUrl: '',
  create_time: '',
  update_time: '',
  create_user: '',
  mapType: null
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    catalog: formState.catalog,
    xodr: formState.xodr,
    desc: formState.desc,
    mapType: formState.mapType
  }
  for (const key in params) {
    if (params[key] === null || params[key] === undefined || params[key] === '') delete params[key]
  }
  try {
    isAdd ? await mapApi.addMaps({ ...params }) : await mapApi.editMaps({ id, data: { ...params } })
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
    const res = await mapApi.lookMaps(id)
    formState.name = res.name
    formState.catalog = res.catalog
    formState.catalogName = res.catalogName
    formState.xodr = null
    formState.desc = res.desc
    formState.latestVersion = res.latestVersion
    formState.latestVersionUrl = res.latestVersionUrl
    formState.create_time = formatDate(res.create_time)
    formState.update_time = formatDate(res.update_time)
    formState.create_user = res.create_user
    formState.mapFileName = res.mapFileName
    formState.mapType = res.mapType
    formState.mapTypeName = res.mapTypeName
  }
}
getLookData()

/****** 上传文件限制 */
const beforeUpload = (file: File) => {
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    message.warning('文件不能大于50M！')
    return false
  }
  return false
}

const onFileChange = (info: UploadChangeParam) => {
  fileList.value = [info.file]
  formState.xodr = fileList.value[0]
}

const onRemove = () => {
  fileList.value = []
  formState.xodr = null
}
</script>
