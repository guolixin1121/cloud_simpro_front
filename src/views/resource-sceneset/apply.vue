<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback()">具体场景</a>
    <span>申请授权</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">申请授权</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%"
        @finish="add">
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