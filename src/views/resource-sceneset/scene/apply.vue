<template>
  <div class="breadcrumb">
    <router-link to="/resource-sceneset/">具体场景</router-link>
    <a @click="goback()">{{ sceneset?.name }}</a>
    <span>申请授权</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">申请场景授权</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 55%"
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
          <span class="break-text">场景资源库-具体场景-{{ sceneset.name }}-{{ formState.name }}</span>
        </a-form-item>
        <a-form-item label="关联地图" name="map">
          {{ formState.mapName + '_' + formState.mapVersion }}
        </a-form-item>
        <a-form-item label="场景文件" name="adsUrl">
          {{ formState.adsUrl }}
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.labels_detail?.length > 0">
            <li v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>--</span>
        </a-form-item>
        <a-form-item label="创建时间" name="create_time">
          {{ formState.create_time }}
        </a-form-item>
        <template v-if="formState.can_apply">
          <a-form-item label="申请说明" name="reason">
            <ch-input type="textarea" v-model:value="formState.reason" :maxlength="255" :rows="4" />
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
const currentApi = api.sceneResource
const sceneset = ref({id: '', name: ''})
const router = useRouter()
const goback = () => router.push('/resource-sceneset/scene/?pid=' + sceneset.value.id)

const formState = reactive({
  id:'',
  name: '',
  desc: '',
  mapName: '',
  mapVersion: '',
  adsUrl: '',
  create_time: '',
  reason: '',
  labels_detail: [],
  can_apply: false
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

    message.success(`任务已提交，请前往授权任务管理查看任务状态。`)
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
      formState.create_time = data.create_time
      formState.can_apply = data.can_apply
      sceneset.value.id = data.scene_set_id
      sceneset.value.name = data.scene_set_name
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>