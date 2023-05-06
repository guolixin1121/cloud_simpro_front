<template>
  <div class="breadcrumb">
    <router-link to="/map-manage/">地图管理</router-link>
    <a class="breadcrumb--current breadcrumb-title" @click="goback">地图版本</a>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px" @finish="add">
      <a-form-item label="地图名称：" name="mapName" :rules="[{ message: '请输入地图名称!' }]">
        <a-input :disabled="true" v-model:value="formState.mapName" maxlength="50" placeholder="请输入地图名称"></a-input>
      </a-form-item>
      <a-form-item label="地图类型：" name="mapType" :rules="[{ message: '请选择地图类型!' }]">
        <scroll-select
          :disabled="true"
          allowClear
          style="width: 245px"
          v-model:value="formState.mapType"
          :options="MapManageSourceOptions"
          placeholder="请选择地图类型"
        >
        </scroll-select>
      </a-form-item>
      <a-form-item label="地图目录：" name="catalog" :rules="[{ message: '请选择地图目录!' }]">
        <tree-select
          :disabled="true"
          allowClear
          style="width: 245px"
          v-model:value="formState.catalog"
          :api="() => mapApi.getMapCatalog({ tree: 1 })"
          :fieldNames="{ label: 'name', value: 'id' }"
          placeholder="请选择地图目录"
        >
        </tree-select>
      </a-form-item>
      <a-form-item label="地图文件：" name="xodr">
        <a-upload
          :disabled="true"
          accept=".xodr"
          :fileList="fileList"
          :before-upload="beforeUpload"
          @remove="onRemove"
          @change="onFileChange"
        >
          <a-button :disabled="true">选择文件</a-button>
          <span class="ml-2">{{ formState.mapFileName }}</span>
        </a-upload>
      </a-form-item>
      <a-form-item label="地图文件地址："
        ><span>{{ formState.mapUrl }}</span>
      </a-form-item>
      <a-form-item label="地图版本：" name="name">
        <span>{{ formState.mapVersion }}</span>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <a-textarea
          :disabled="isView"
          v-model:value="formState.mapVersionDesc"
          placeholder="请输入描述"
          rows="10"
          style="resize: none"
        />
      </a-form-item>
      <template v-if="isView">
        <a-form-item label="创建时间："
          ><span>{{ formState.importTime }}</span></a-form-item
        >
        <a-form-item label="修改时间："
          ><span>{{ formState.update_time }}</span></a-form-item
        >
        <a-form-item label="所属用户："
          ><span>{{ formState.importUserName }}</span></a-form-item
        >
      </template>
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button v-if="!isView" type="primary" html-type="submit" :loading="loading">
          {{ '修改' }}
        </a-button>
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
const title = isView ? '查看地图' : '修改地图'
const mapApi = api.maps

const fileList = ref()
const formState = reactive<any>({})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  const params: any = { mapVersionDesc: formState.mapVersionDesc }
  try {
    await mapApi.editMapVersion({ id, data: { ...params } })
    loading.value = false
    message.info('修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await mapApi.lookMapVersion(id)
    formState.mapName = res.mapName
    formState.catalog = res.catalog
    formState.mapFileName = res.mapFileName
    formState.mapVersionDesc = res.mapVersionDesc
    formState.mapUrl = res.mapUrl
    formState.mapVersion = res.mapVersion
    formState.importTime = formatDate(res.importTime)
    formState.update_time = formatDate(res.update_time)
    formState.importUserName = res.importUserName
    formState.mapType = res.mapType
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
