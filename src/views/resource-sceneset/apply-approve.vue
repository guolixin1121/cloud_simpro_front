<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback(-2)">逻辑场景</a>
    <a @click="goback()">授权任务管理</a>
    <span>{{ user.isAdmin() ? '任务审批' : '任务查看' }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ user.isAdmin() ? '任务审批' : '任务查看' }}</span>
    <div class="flex">
      <div style="width: 50%">
      <a-spin :spinning="dataLoading">
        <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }">
          <a-form-item label="申请人" >
            {{ formState.apply_username }}
          </a-form-item>
          <a-form-item label="申请时间">
            {{ formState.create_time }}
          </a-form-item>
          <a-form-item label="申请原因">
            {{ formState.reason }}
          </a-form-item>
          <template v-if="isSceneset">
            <a-form-item label="场景集ID">{{ formState.data.id }}</a-form-item>
            <a-form-item label="场景集名称">{{ formState.data.name }}</a-form-item>
            <a-form-item label="场景集描述" name="desc">
              <span class="break-all">{{ formState.data.desc || '无' }}</span>
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item label="场景ID">{{ formState.data.id }}</a-form-item>
            <a-form-item label="场景名称">{{ formState.data.name }}</a-form-item>
            <a-form-item label="场景描述" name="desc">
              <span class="break-all">{{ formState.data.desc || '无' }}</span>
            </a-form-item>
            <a-form-item label="路径">{{ formState.data.name }}</a-form-item>
            <a-form-item label="关联地图">{{ formState.data.mapName + formState.data.mapVersion }}</a-form-item>
            <a-form-item label="场景文件">{{ formState.data.name }}</a-form-item>
          </template>
          <a-form-item label="标签">
            <ul class="view-list"  v-if="formState.data.labels_detail?.length > 0">
              <li class="mb-2" v-for="item in formState.data.labels_detail as any" :key="item">
                {{ item.display_name }}
              </li>
            </ul>
            <span v-else>无</span>
          </a-form-item>
          <a-form-item label="创建时间" name="create_time">{{ formState.data.create_time }}</a-form-item>
        </a-form>
      </a-spin>
    </div>
      <div style="width: 40%" v-if="user.isAdmin()">
        <p>审批意见</p>
        <ch-input type="textarea" rows="15" placeholder="请输入审批意见" v-model:value="formState.comments" />
        <div class="my-4">
          <a-button type="primary" class="mr-4" @click="onApprove">批准</a-button>
          <a-button :loading="loading" @click="onReject">驳回</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'

const id = useRoute().params.id
const currentApi = api.grant
const user = store.user

const formState = reactive({
  apply_username: '',
  comments: '',
  reason: '',
  create_time: '',
  data: {
    id: '',
    name: '',
    desc: '',
    labels_detail: [],
    mapName: '',
    mapVersion: '',
    path: '',
    create_time: ''
  }
})
const isSceneset = ref(false)

const loading = ref(false)
const onApprove = async () => {
  loading.value = true

  const params = {
    id: [id],
    comments: formState.comments
  }
  
  try {
    await currentApi.approve(params)

    message.info(`任务已批准`)
    goback()
  } finally {
    loading.value = false
  }
}

const onReject = async () => {
  loading.value = true

  const params = {
    id: [id],
    comments: formState.comments
  }
  
  try {
    await currentApi.reject(params)

    message.info(`任务已驳回`)
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
      const data = await currentApi.get({id})
      for(const prop in formState) {
        formState[prop as keyof typeof formState] = data[prop]
      }
      isSceneset.value = data.grant_type == 1 || data.grant_type == 3
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>