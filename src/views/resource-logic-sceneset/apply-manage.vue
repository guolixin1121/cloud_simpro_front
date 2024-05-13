<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback()">逻辑场景</a>
    <span>授权任务管理</span>
  </div>
  <search-form ref="searchFormRef" :items="formItems" @search="onSearch"></search-form>
  <div class="main">
    <div class="title-section">
      <a-tabs class="tabs" v-model:activeKey="activeKey" >
        <a-tab-pane :key="1" tab="场景集管理">
        </a-tab-pane>
        <a-tab-pane :key="2" tab="具体场景管理">
        </a-tab-pane>
      </a-tabs> 
      <div v-if="user.isAdmin()">
        <a-button :disabled="checkedItems.length == 0" type="primary" @click="modalVisible = true">审批</a-button>
      </div>
    </div>
    <Table ref="tableRef" style="margin-top: 0px;" :api="listApi" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
  </div>

  <a-modal title="批量审批" v-model:visible="modalVisible" :footer="null">
    <div class="modal-content">
      <p>已勾选{{ checkedItems.length }}个任务，是否批准全部任务申请？</p>
      <p>审批之后无法修改，请谨慎操作。</p>
    </div>
    <div class="modal-buttons">
      <a-button @click="onBatchReject" :loading="isRejecting">驳回</a-button>
      <a-button type="primary" @click="onBatchPass" :loading="isApproving">批准</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'
import { ApplyStatusOptions, getApplyStatus } from '@/utils/dict'

const user = store.user
const isAdmin = user.isAdmin()
const router = useRouter()
const query = ref({})
const onSearch = (data: Query) => (query.value = data)

const activeKey = ref(1)
const listApi = (params: any) => api.grant.getList({...params, type: activeKey.value == 1 ? 1 : 2})
const columns = computed(() => activeKey.value == 1 ? scenesetColumns : sceneColumns )
const formItems = computed(() => activeKey.value == 1 ? scenetsetFormItems : sceneFormItems )

const scenetsetFormItems = [
  { label: '任务ID', key: 'id', type: 'input', placeholder: '请输入任务ID' },
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称' },
  {
    label: '状态',
    key: 'status',
    type: 'select',
    options: ApplyStatusOptions,
    placeholder: '请选择场景来源',
    defaultValue: ''
  }]
const sceneFormItems = [
  { label: '任务ID', key: 'id', type: 'input', placeholder: '请输入任务ID' },
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景ID或名称' },
  {
    label: '状态',
    key: 'status',
    type: 'select',
    options: ApplyStatusOptions,
    placeholder: '请选择状态',
    defaultValue: '',
  }]
const scenesetColumns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: any) => isAdmin && data.status != 2 },
  { title: '任务ID', dataIndex: 'id', width: 120 },
  { title: '场景集ID', dataIndex: 'resource_id', width: 120 },
  { title: '场景集名称', dataIndex: 'resource_name', width: 200, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 180, formatter: getApplyStatus },
  { title: '申请人', dataIndex: 'apply_username', width: 180 },
  { title: '申请时间', dataIndex: 'create_time', width: 180 },
  { title: '审批时间', dataIndex: 'operate_time', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 80,
    actions: user.isAdmin() ? {
      审批: {
        validator: (data: any) => data.status == 1,
        handler: (data: any) => router.push('/resource-logic-sceneset/apply-approve/' + data.id)
      }} :  {
      查看: (data: any) => router.push('/resource-logic-sceneset/apply-approve/' + data.id)
    }
  }
]

const sceneColumns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: any) => isAdmin && data.status != 2 },
  { title: '任务ID', dataIndex: 'id', width: 120 },
  { title: '场景ID', dataIndex: 'resource_id', width: 120 },
  { title: '场景名称', dataIndex: 'resource_name', ellipsis: true },
  { title: '所属场景集', dataIndex: 'parent_name', width: 200, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 180, formatter: getApplyStatus },
  { title: '申请人', dataIndex: 'apply_username', width: 180 },
  { title: '申请时间', dataIndex: 'create_time', width: 180 },
  { title: '审批时间', dataIndex: 'operate_time', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 80,
    actions: user.isAdmin() ? {
      审批: {
        validator: (data: any) => data.status == 1,
        handler: (data: any) => router.push('/resource-logic-sceneset/apply-approve/' + data.id)
      }} :  {
      查看: (data: any) => router.push('/resource-logic-sceneset/apply-approve/' + data.id)
    }
  }
]

const tableRef = ref()
const modalVisible = ref(false)
const checkedItems = ref([])
const isRejecting = ref(false)
const isApproving = ref(false)
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchPass = async () => {
  try {
    isApproving.value = true
    await api.grant.approve({ id: checkedItems.value })
    tableRef.value.refresh({ deletedRows: checkedItems.value.length })
    message.success('已批准')
    modalVisible.value = false
  } finally {
    isApproving.value = false
  }
}
const onBatchReject = async () => {
  try {
    isRejecting.value = true
    await api.grant.reject({ id: checkedItems.value })
    tableRef.value.refresh({ deletedRows: checkedItems.value.length })
    message.success('已驳回')
    modalVisible.value = false
  } finally {
    isRejecting.value = false
  }
}

const searchFormRef = ref()
watch(activeKey, () => {
  searchFormRef.value.reset()
  tableRef.value.refresh({page: 1})
})
</script>