<template>
  <div class="breadcrumb">
    <a @click="goback()">逻辑场景</a>
    <span>申请授权</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">申请场景集授权</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 55%"
        @finish="add">
        <a-form-item label="场景集ID" name="id" >
          <span>{{ id }}</span>
        </a-form-item>
        <a-form-item label="场景集名称" name="name" >
          <span class="break-text">{{ formState.name }}</span>
        </a-form-item>
        <a-form-item label="场景集描述" name="desc">
          <span class="break-text">{{ formState.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.labels_detail?.length > 0">
            <li v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>无</span>
        </a-form-item>
        <a-form-item label="场景数量" name="scene_count">
          {{ formState.scene_count }}
        </a-form-item>
        <a-form-item label="创建时间" name="create_time">
          {{ formState.create_time }}
        </a-form-item>
        <template v-if="formState.can_apply">
          <a-form-item label="申请原因" name="reason">
            <ch-input type="textarea" v-model:value="formState.reason" :maxlength="255" :rows="4"
              placeholder="请输入申请原因" />
          </a-form-item>
          <a-form-item :wrapper-col="{ style: { paddingLeft: '80px' }}">
            <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">申请</a-button>
            <a-button @click="goback()">取消</a-button>
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id

const router = useRouter()
const goback = () => router.push('/resource-logic-sceneset/')
const formState = reactive({
  name: '',
  desc: '',
  reason: '',
  create_time: '',
  labels_detail: [],
  can_apply: true,
  scene_count: ''
})

const loading = ref(false)
const add = async () => {
  loading.value = true

  const params = {
    type: 1,
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
      const data = await api.loginsceneResource.getSceneset(id)
      formState.name = data.name
      formState.desc = data.desc
      formState.create_time = data.create_time
      formState.labels_detail = data.labels_detail
      formState.can_apply = data.can_apply
      formState.scene_count = data.count
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>