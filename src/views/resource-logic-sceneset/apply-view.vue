<template>
  <div class="breadcrumb">
    <router-link to="/resource-logic-sceneset/">逻辑场景</router-link>
    <a @click="goback()">授权任务管理</a>
    <span>任务详情</span>
  </div>

  <div class="min-main">
    <span class="title mb-5">任务详情</span>
    <a-spin :spinning="dataLoading">
    <a-form class="view-form" :model="formState" :labelCol ="{ style: { width: isSceneset ? '80px' : '65px' } }" style="width: 65%">
      <p class="sub-title">{{ isSceneset ? '场景集信息' : '场景信息' }}</p>
      <template v-if="formState.data">
        <template v-if="isSceneset">
          <a-form-item label="场景集ID">{{ formState.data.id }}</a-form-item>
          <a-form-item label="场景集名称">
            <span class="break-text">{{ formState.data.name }}</span></a-form-item>
          <a-form-item label="场景集描述" name="desc">
            <span class="break-text">{{ formState.data.desc || '--' }}</span>
          </a-form-item>
          <a-form-item label="场景数量" name="scene_count">
            <span class="break-text">{{ formState.scene_count }}</span>
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
            <span class="break-text">场景资源库-逻辑场景-{{ formState.data.logic_scene_set_resource.name }}-{{ formState.data.name }}</span></a-form-item>
          <a-form-item label="关联地图">{{ formState.data.map_name + '_'+  formState.data.map_version_num }}</a-form-item>
          <a-form-item label="场景文件">
            <span class="break-text">{{ formState.data.scene_url }}</span>
          </a-form-item>
          <a-form-item label="配置文件">
            <span class="break-text">{{ formState.data.config_url }}</span>
          </a-form-item>
        </template>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.data.labels_detail?.length > 0">
            <li v-for="item in formState.data.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>--</span>
        </a-form-item>
        <a-form-item label="创建时间" name="create_time">{{ formState.data?.create_time }}</a-form-item>
      </template>
      <template v-else>
        <div class="label mb-4">{{ isSceneset ? '该场景集已被删除' : '该场景已被删除' }}</div>
      </template>
    </a-form>
    <a-form class="view-form" :model="formState" :labelCol ="{ style: { width: '65px' } }" style="width: 65%">
      <p  class="sub-title">申请信息</p>
      <a-form-item label="申请原因">
        <span class="break-text">{{ formState.reason || '--' }}</span>
      </a-form-item>
      <a-form-item label="申请时间">
        {{ formState.create_time }}
      </a-form-item>

      <p class="sub-title">审批结果</p>
      <a-form-item label="任务状态">
        <span :class="'apply-status--' + formState.status">{{ getApplyStatus(formState.status) }}</span></a-form-item>
      <a-form-item label="审批意见">
        <span class="break-text">{{ formState.comments || '--' }}</span></a-form-item>
      <a-form-item>
        <a-button type="primary" v-if="formState.data" class="mr-4" @click="gotoPage()">{{isSceneset ? '查看场景集' : '查看场景'}}</a-button>
        <a-button @click="goback()">返回</a-button>
      </a-form-item>
    </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { getApplyStatus } from '@/utils/dict'

const id = useRoute().params.id
const currentApi = api.grant
const router = useRouter()
const goback = () => router.push('/resource-logic-sceneset/apply-manage/')

// const isApproved = computed(() => formState.status != '1' )
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
    map_name: '',
    map_version_num: '',
    config_url: '',
    scene_url: '',
    create_time: '',
    count: '',
    logic_scene_set_resource: {id: '', name: ''} // 所属场景集
  }
})
const isSceneset = ref(false)
const gotoPage = () => {
  isSceneset.value ? router.push('/resource-logic-sceneset/scene/?pid=' + formState.data.id)
    : router.push('/resource-logic-sceneset/scene/view/' + formState.data.id)
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

<style lang="less">
.comments {
  width: 100%; height: 200px; padding: 8px; border: 1px solid #d3d3d3;
  word-break: break-all;
}
</style>