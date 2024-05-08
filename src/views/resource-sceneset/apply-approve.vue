<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback(-2)">具体场景</a>
    <a @click="goback()">授权任务管理</a>
    <span>任务审批</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">任务审批</span>
    <div class="flex">
      <div style="width: 50%">
      <a-spin :spinning="dataLoading">
        <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"
          @finish="add">
          <a-form-item label="申请人" name="name" >
            {{ formState.name }}
          </a-form-item>
          <a-form-item label="申请时间" name="name" >
            {{ formState.name }}
          </a-form-item>
          <a-form-item label="申请原因" name="name" >
            {{ formState.name }}
          </a-form-item>
          <a-form-item label="场景集ID" name="name" >
            {{ formState.name }}
          </a-form-item>
          <a-form-item label="场景集名称" name="name" >
            {{ formState.name }}
          </a-form-item>
          <a-form-item label="场景集描述" name="desc">
            {{ formState.desc }}
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
      <div style="width: 40%">
        <p>审批意见</p>
        <ch-input type="textarea" rows="15" placeholder="请输入审批意见" v-model="formState.reason" />
        <div class="my-4">
          <a-button type="primary" class="mr-4">批准</a-button>
          <a-button :loading="loading">驳回</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'

const id = useRoute().params.id
const currentApi = api.scenesets

const formState = reactive({
  name: '',
  desc: '',
  reason: '',
  create_time: '',
  labels_detail: []
})

const loading = ref(false)
const add = async () => {
  loading.value = true

  const params = {
    parentId: 1,
    name: formState.name,
    desc: formState.desc,
    // labels: formState.labels?.map((item: any) => item.value || item.name)
  }
  
  try {
    await currentApi.add(params)

    message.info(`申请成功`)
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
      const data = await currentApi.get(id)
      formState.name = data.name
      formState.desc = data.desc
      formState.labels_detail = data.labels_detail
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>