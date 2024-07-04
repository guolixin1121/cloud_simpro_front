<template>
  <div class="breadcrumb">
    <router-link to="/resource-sceneset/">具体场景</router-link>
    <a @click="goback()">授权任务管理</a>
    <span>任务详情</span>
  </div>

  <div class="min-main">
    <span class="title mb-5">任务详情</span>

    <a-form :model="formState" style="width: 80%" :labelCol ="{ style: { width: '80px' } }">
      <p class="sub-title">{{ isSceneset ? '场景集信息' : '场景信息' }}</p>
      <template v-if="isSceneset">
        <a-form-item label="场景集ID">{{ formState.data.id }}</a-form-item>
        <a-form-item label="场景集名称">
          <span>{{ formState.data.name }}</span></a-form-item>
        <a-form-item label="场景集描述" name="desc">
          <span class="break-text">{{ formState.data.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="场景数量" name="scene_count">
          <span>{{ formState.scene_count }}</span>
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item label="场景ID">{{ formState.data.id }}</a-form-item>
        <a-form-item label="场景名称">
          <span class="break-text">{{ formState.data.name }}</span></a-form-item>
        <a-form-item label="场景描述" name="desc">
          <span class="break-text">{{ formState.data.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="路径">
          <span class="break-text">场景资源库-具体场景-{{ formState.data.scene_set_name }}-{{ formState.data.name }}</span></a-form-item>
        <a-form-item label="关联地图">{{ formState.data.mapName + '_' + formState.data.mapVersion }}</a-form-item>
        <a-form-item label="场景文件">
          <span class="break-text">{{ formState.data.xosc_key }}</span>
        </a-form-item>
      </template>
      <a-form-item label="标签">
        <ul class="view-list"  v-if="formState.data.labels_detail?.length > 0">
          <li v-for="item in formState.data.labels_detail as any" :key="item">
            {{ item.display_name }}
          </li>
        </ul>
        <span v-else>无</span>
      </a-form-item>
      <a-form-item label="创建时间" name="create_time">{{ formState.data.create_time }}</a-form-item>
    
      <p class="sub-title">申请信息</p>
      <a-form-item label="申请原因">
        <span class="break-text">{{ formState.reason || '--' }}</span>
      </a-form-item>
      <a-form-item label="申请时间">
        {{ formState.create_time }}
      </a-form-item>

       <p class="sub-title">审批结果</p>
       <a-form-item label="任务状态" name="status">
        <span :class="'apply-status--' + formState.status">{{ getApplyStatus(formState.status) }}</span>
       </a-form-item>
       <a-form-item label="审批意见" name="comments">
        <span>{{ formState.comments || '--' }}</span>
       </a-form-item>
        <div class="my-4">
          <a-button type="primary" class="mr-4" @click="gotoPage()">{{isSceneset ? '查看场景集' : '查看场景'}}</a-button>
          <a-button @click="goback()">返回</a-button>
        </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { getApplyStatus } from '@/utils/dict'

const id = useRoute().params.id
const currentApi = api.grant

const router = useRouter()
const goback = () => router.push('/resource-sceneset/apply-manage/')
const formState = reactive({
  apply_username: '',
  comments: '',
  reason: '',
  create_time: '',
  scene_count: '',
  status: '',  // 1 待审批， 2 已批准 3 已拒绝
  data: {
    id: '',
    name: '',
    desc: '',
    labels_detail: [],
    scene_set_name: '',
    mapName: '',
    mapVersion: '',
    xosc_key: '',
    create_time: '',
    scene_count: ''
  }
})
const isSceneset = ref(false)

const gotoPage = () => {
  isSceneset.value ? router.push('/resource-sceneset/scene/?pid=' + formState.data.id)
    : router.push('/resource-sceneset/scene/preview/' + formState.data.id)
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

<style>
.comments {
  width: 100%; height: 400px; padding: 8px; border: 1px solid #d3d3d3;
  word-break: break-all;
}
</style>