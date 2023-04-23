<template>
  <div class="breadcrumb">
    <router-link to="/map/manage/">地图管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px" @finish="add">
      <a-form-item label="地图名称：" name="name" :rules="[{ required: true, message: '请输入地图名称!' }]">
        <a-input
          :disabled="isView || !isAdd"
          v-model:value="formState.name"
          maxlength="50"
          placeholder="请输入地图名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="地图目录：" name="catalog" :rules="[{ required: true, message: '请选择地图目录!' }]">
        <tree-select
          :disabled="isView || !isAdd"
          allowClear
          style="width: 245px"
          v-model:value="formState.catalog"
          :api="mapApi.getMapCatalog"
          :params="{ tree: 1 }"
          :fieldNames="{ title: 'name', id: 'id' }"
          placeholder="请选择地图目录"
        >
        </tree-select>
      </a-form-item>
      <a-form-item label="地图文件：" name="xodr" :rules="[{ required: isAdd, message: '请上传地图文件!' }]">
        <a-upload
          :disabled="isView"
          accept=".xodr"
          :fileList="fileList"
          :before-upload="beforeUpload"
          @remove="onRemove"
          @change="onFileChange"
        >
          <a-button :disabled="isView">选择文件</a-button>
          <span class="ml-2" v-if="!isAdd">{{ formState.mapFileName }}</span>
        </a-upload>
      </a-form-item>
      <a-form-item v-if="!isAdd" label="地图文件地址："
        ><span>{{ formState.latestVersionUrl }}</span>
      </a-form-item>
      <a-form-item v-if="!isAdd" label="地图版本：" name="name">
        <span>{{ formState.latestVersion }}</span>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <a-textarea :disabled="isView" v-model:value="formState.desc" placeholder="请输入描述" rows="10" style="resize: none" />
      </a-form-item>
      <template v-if="isView">
        <a-form-item label="创建时间："
          ><span>{{ formState.createTime }}</span></a-form-item
        >
        <a-form-item label="修改时间："
          ><span>{{ formState.updateTime }}</span></a-form-item
        >
        <a-form-item label="所属用户："
          ><span>{{ formState.createUser }}</span></a-form-item
        >
      </template>
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button v-if="!isView" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '上传' : '修改' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue'

const id = useRoute().params.id
const { type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看地图' : isAdd ? '上传地图' : '修改地图'
const mapApi = api.maps

const fileList = ref()
const formState = reactive<any>({
  name: undefined,
  catalog: null,
  xodr: null,
  desc: '',
  latestVersion: '',
  latestVersionUrl: '',
  createTime: '',
  updateTime: '',
  createUser: ''
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
    desc: formState.desc
  }
  for (const key in params) {
    if (!params[key]) delete params[key]
  }
  console.log(params, formState)
  isAdd ? await mapApi.addMaps({ ...params }) : await mapApi.editMaps({ id, data: { ...params } })
  loading.value = false
  message.info(isAdd ? '上传成功' : '修改成功')
  goback()
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await mapApi.lookMaps(id)
    formState.name = res.name
    formState.catalog = res.catalog
    formState.xodr = res.xodr
    formState.desc = res.desc
    formState.latestVersion = res.latestVersion
    formState.latestVersionUrl = res.latestVersionUrl
    formState.createTime = res.createTime
    formState.updateTime = res.updateTime
    formState.createUser = res.createUser
    formState.mapFileName = res.mapFileName
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
