<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback(-2)">具体场景</a>
    <a @click="goback()">{{ scenset?.name }}</a>
    <span>申请授权</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">申请授权</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%"
        @finish="add">
        <a-form-item label="场景ID" name="id" >
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="场景名称" name="name" >
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="场景描述" name="desc">
          {{ formState.desc }}
        </a-form-item>
        <a-form-item label="所属场景集" name="sceneset_name">
          {{ formState.sceneset_name }}
        </a-form-item>
        <a-form-item label="关联地图" name="sceneset">
          {{ formState.mapName + '_' + formState.mapVersion }}
        </a-form-item>
        <a-form-item label="场景文件" name="adsUrl">
          {{ formState.adsUrl }}
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.labels_detail?.length > 0">
            <li class="mb-2" v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>无</span>
        </a-form-item>
        <a-form-item label="创建时间" name="create_time">
          {{ formState.create_time }}
        </a-form-item>
        <a-form-item label="申请说明" name="reason">
          <a-textarea v-model:value="formState.reason" :rows="4" />
        </a-form-item>
        <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
          <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">申请</a-button>
          <a-button @click="goback()">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'

const id = useRoute().params.id
const currentApi = api.sceneResource
const scenset = store.catalog.sceneCatalog

const formState = reactive({
  id:'',
  name: '',
  desc: '',
  sceneset_name: '',
  mapName: '',
  mapVersion: '',
  adsUrl: '',
  create_time: '',
  reason: '',
  labels_detail: []
})

const loading = ref(false)
const add = async () => {
  loading.value = true

  const params = {
    type: 4,
    id: [id],
    reason: formState.reason
  }
  
  try {
    await api.grant.apply(params)

    message.info(`任务已提交，请前往授权任务管理查看任务状态。`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    try {
      dataLoading.value = true
      const data = await currentApi.getScene(id)
      formState.name = data.name
      formState.desc = data.desc
      formState.labels_detail = data.labels_detail
      formState.mapName = data.mapName
      formState.mapVersion = data.mapVersion
      formState.adsUrl = data.xosc_key
      formState.id = data.id
      formState.sceneset_name = scenset.name
      formState.create_time = data.create_time
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>