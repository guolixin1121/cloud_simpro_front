<template>
  <div class="breadcrumb">
    <router-link to="/map-manage/">地图管理</router-link>
    <a class="breadcrumb--current breadcrumb-title" @click="goback">地图版本</a>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <div v-if="isView" class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px" @finish="add">
      <a-form-item label="地图名称：" name="mapName">
        {{ formState.mapName }}
      </a-form-item>
      <a-form-item label="地图类型：" name="mapType">
        {{ formState.mapTypeName }}
      </a-form-item>
      <a-form-item label="地图目录：" name="catalog">
        {{ formState.catalogName }}
      </a-form-item>
      <a-form-item label="地图文件：" name="xodr">
        {{ formState.mapFileName }}
      </a-form-item>
      <a-form-item label="地图文件地址："
        ><span>{{ formState.mapUrl }}</span>
      </a-form-item>
      <a-form-item label="地图版本：" name="name">
        <span>{{ formState.mapVersion }}</span>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <a-textarea
          v-if="!isView"
          v-model:value="formState.mapVersionDesc"
          placeholder="请输入描述"
          rows="10"
          style="resize: none"
          maxlength="255"
        />
        <template v-else>{{ formState.mapVersionDesc }}</template>
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
      <a-form-item v-if="!isView" class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button class="mr-2" type="primary" html-type="submit" :loading="loading">
          {{ '修改' }}
        </a-button>
        <a-button @click="goback">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools'

const id = useRoute().params.id
const { type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const title = isView ? '查看地图' : '修改地图'
const mapApi = api.maps

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
    formState.catalogName = res.catalogName
    formState.mapFileName = res.mapFileName
    formState.mapVersionDesc = res.mapVersionDesc
    formState.mapUrl = res.mapUrl
    formState.mapVersion = res.mapVersion
    formState.importTime = formatDate(res.importTime)
    formState.update_time = formatDate(res.update_time)
    formState.importUserName = res.importUserName
    formState.mapType = res.mapType
    formState.mapTypeName = res.mapTypeName
  }
}
getLookData()
</script>
