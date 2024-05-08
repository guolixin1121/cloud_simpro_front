<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback(-2)">具体场景</a>
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
          <a-form-item label="场景集ID">
            {{ formState.resource_id }}
          </a-form-item>
          <a-form-item label="场景集名称">
            {{ formState.resource_name }}
          </a-form-item>
          <a-form-item label="场景集描述" name="desc">
            {{ formState.resource_desc }}
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
  desc: '',
  reason: '',
  comments: '',
  resource_id: '',
  resource_name: '',
  resource_desc: '',
  create_time: '',
  labels_detail: []
})

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
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>