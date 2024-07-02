<template>
  <div class="breadcrumb">
    <router-link to="/resource-logic-sceneset/">逻辑场景</router-link>
    <a @click="goback()">{{ sceneset?.name }}</a>
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
          <span class="break-text">{{ formState.name }}</span>
        </a-form-item>
        <a-form-item label="场景描述" name="desc">
          <span class="break-text">{{ formState.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="路径" name="path">
          <span class="break-text">场景资源库-逻辑场景-{{ sceneset.name }}-{{ formState.name }}</span>
        </a-form-item>
        <a-form-item label="关联地图" name="sceneset">
          {{ formState.map_name + '_' + formState.map_version_num }}
        </a-form-item>
        <a-form-item label="场景文件" name="adsUrl">
          {{ formState.scene_url }}
        </a-form-item>
        <a-form-item label="配置文件" name="adsUrl">
          {{ formState.config_url }}
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
        <template v-if="formState.can_apply">
          <a-form-item label="申请原因" name="reason">
            <ch-input type="textarea" v-model:value="formState.reason" :maxlength="255" :rows="4" placeholder="请输入申请原因" />
          </a-form-item>
          <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
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
const currentApi = api.loginsceneResource
const sceneset = store.catalog.sceneCatalog
const router = useRouter()
const goback = () => router.push('/resource-logic-sceneset/scene/?pid=' + sceneset.id)
const formState = reactive({
  id:'',
  name: '',
  desc: '',
  map_name: '',
  map_version_num: '',
  scene_url: '',
  config_url: '',
  create_time: '',
  reason: '',
  labels_detail: [],
  can_apply: true
})

const loading = ref(false)
const add = async () => {
  loading.value = true

  const params = {
    type: 2,
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
      formState.map_name = data.map_name
      formState.map_version_num = data.map_version_num
      formState.scene_url = data.scene_url
      formState.config_url = data.config_url
      formState.id = data.id
      formState.create_time = data.create_time
      formState.can_apply = data.can_apply
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>