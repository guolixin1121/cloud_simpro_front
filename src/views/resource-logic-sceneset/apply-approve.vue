<template>
  <div class="breadcrumb">
    <span>场景管理</span>
    <span>场景资源库</span>
    <router-link to="/resource-logic-sceneset/">逻辑场景</router-link>
    <a @click="goback()">授权任务管理</a>
    <span>任务审批</span>
  </div>

  <div class="flex justify-between" style="height: calc(100% - 20px)">
    <div class="white-block" style="width: 60%; overflow: auto;">
      <span class="title mb-5">任务详情</span>
      <a-spin :spinning="dataLoading">
        <div class="sub-title">申请信息</div>
        <a-form :model="formState" :labelCol ="{ style: { width: '90px' } }">
          <a-form-item label="申请人" >
            {{ formState.apply_username }}
          </a-form-item>
          <a-form-item label="申请时间">
            {{ formState.create_time }}
          </a-form-item>
          <a-form-item label="申请原因">
            <span class="break-text">{{ formState.reason || '--' }}</span>
          </a-form-item>
        </a-form>

        <div class="sub-title">{{ isSceneset ? '场景集信息' : '场景信息' }}</div>
        <a-form :model="formState" :labelCol ="{ style: { width: '90px' } }">
          <template v-if="isSceneset">
            <a-form-item label="场景集ID">{{ formState.data.id }}</a-form-item>
            <a-form-item label="场景集名称">
              <span class="break-text">{{ formState.data.name }}</span></a-form-item>
            <a-form-item label="场景集描述" name="desc">
              <span class="break-text">{{ formState.data.desc || '-' }}</span>
            </a-form-item>
            <a-form-item label="场景数量" name="count">
              <span>{{ formState.data.count }}</span>
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item label="场景ID">{{ formState.data.id }}</a-form-item>
            <a-form-item label="场景名称">
              <span class="break-text">{{ formState.data.name }}</span>
            </a-form-item>
            <a-form-item label="场景描述" name="desc">
              <span class="break-text">{{ formState.data.desc || '-' }}</span>
            </a-form-item>
            <a-form-item label="路径">
              <span class="break-text">场景资源库-逻辑场景-{{ sceneset.name }}</span>
            </a-form-item>
            <a-form-item label="关联地图">{{ formState.data.map_name + formState.data.map_version_num }}</a-form-item>
            <a-form-item label="场景文件">{{ formState.data.scene_url }}</a-form-item>
            <a-form-item label="配置文件">{{ formState.data.config_url }}</a-form-item>
          </template>
          <a-form-item label="标签">
            <ul class="view-list"  v-if="formState.data.labels_detail?.length > 0">
              <li class="mb-2" v-for="item in formState.data.labels_detail as any" :key="item">
                {{ item.display_name }}
              </li>
            </ul>
            <span v-else>--</span>
          </a-form-item>
          <a-form-item label="创建时间" name="create_time">{{ formState.data.create_time }}</a-form-item>
        </a-form>
      </a-spin>
    </div>
    <div class="white-block" style="width: 40%; margin-left: 16px;">
      <span class="title mb-5">审批意见</span>
        <p>
          <span class="label">任务状态</span><span :class="'apply-status--' + formState.status">{{ getApplyStatus(formState.status) }}</span></p>
        <template v-if="user.isAdmin() && !isApproved">
          <ch-input type="textarea" rows="10" :maxlength="255"
            placeholder="请输入审批意见" v-model:value="formState.comments" />
          <div class="my-4">
            <a-button type="primary" :loading="isApproving"  @click="onApprove(true)">批准</a-button>
            <a-button class="mx-4" :loading="isRejecting" @click="onApprove(false)">驳回</a-button>
            <a-button @click="gotoPage()">{{isSceneset ? '查看场景集' : '查看场景'}}</a-button>
          </div>
        </template>
        <template v-else>
          <p class="comments">{{ formState.comments || '无' }}</p>
          <div class="my-4">
            <a-button type="primary" class="mr-4" @click="gotoPage()">{{isSceneset ? '查看场景集' : '查看场景'}}</a-button>
            <a-button @click="goback()">返回</a-button>
          </div>
        </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApplyStatus } from '@/utils/dict'

const id = useRoute().params.id
const currentApi = api.grant
const user = store.user
const sceneset = store.catalog.sceneCatalog
const router = useRouter()
const goback = () => router.push('/resource-logic-sceneset/apply-manage/0')

const isApproved = computed(() => formState.status != '1' )
const formState = reactive({
  apply_username: '',
  comments: '',
  reason: '',
  create_time: '',
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
    count: ''
  }
})

const isSceneset = ref(false)

const isApproving = ref(false)
const isRejecting = ref(false)
const onApprove = async (isAproved: boolean = true) => {
  isAproved ? isApproving.value = true : isRejecting.value = true

  const params = {
    id: [id],
    comments: formState.comments || ''
  }
  
  try {
    await isAproved ? currentApi.approve(params) : currentApi.reject(params)

    message.info(isAproved ? `任务已批准` : '任务已驳回')
    goback()
  } finally {
    isAproved ? isApproving.value = false : isRejecting.value = false
  }
}

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
<style>
.comments {
  width: 100%; height: 200px; padding: 8px; border: 1px solid #d3d3d3;
  word-break: break-all;
}
</style>