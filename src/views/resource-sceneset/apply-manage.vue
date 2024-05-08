<template>
  <div class="breadcrumb">
    <span>场景资源库</span>
    <a @click="goback()">具体场景</a>
    <span>授权任务管理</span>
  </div>
  <search-form :items="formItems" @search="onSearch"></search-form>
  <div class="main">
    <div class="title-section">
      <a-tabs class="tabs" v-model:activeKey="activeKey" >
        <a-tab-pane :key="1" tab="场景集管理">
        </a-tab-pane>
        <a-tab-pane :key="2" tab="具体场景管理">
        </a-tab-pane>
      </a-tabs> 
      <div>
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
      <a-button @click="onBatchReject">驳回</a-button>
      <a-button type="primary" @click="onBatchPass">批准</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'
import { ApplyStatusOptions, getApplyStatus } from '@/utils/dict'

// const user = store.user
const router = useRouter()
const query = ref({})
const onSearch = (data: Query) => (query.value = data)

const activeKey = ref(1)
const listApi = computed(() => activeKey.value == 1 ? api.scene.getList : api.scene.getList)
const columns = computed(() => activeKey.value == 1 ? scenesetColumns : sceneColumns )
const formItems = computed(() => activeKey.value == 1 ? scenetsetFormItems : sceneFormItems )

const scenetsetFormItems = [
  { label: '任务ID', key: 'id', type: 'input', placeholder: '请输入任务ID' },
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称' },
  {
    label: '状态',
    key: 'labels',
    type: 'tree-select',
    options: ApplyStatusOptions,
    placeholder: '请选择状态',
    defaultValue: '',
  }]
const sceneFormItems = [
  { label: '任务ID', key: 'id', type: 'input', placeholder: '请输入任务ID' },
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景ID或名称' },
  {
    label: '状态',
    key: 'labels',
    type: 'tree-select',
    options: ApplyStatusOptions,
    placeholder: '请选择状态',
    defaultValue: '',
  }]
const scenesetColumns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '任务ID', dataIndex: 'id', width: 120 },
  { title: '场景集ID', dataIndex: 'scenetset-id', width: 120 },
  { title: '场景集名称', dataIndex: 'scenet-name', width: 200, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 180, formatter: getApplyStatus },
  { title: '申请人', dataIndex: 'createTime', width: 180 },
  { title: '申请时间', dataIndex: 'updateTime', width: 180 },
  { title: '审批时间', dataIndex: 'createUser', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      审批: (data: any) => router.push('/resource-sceneset/apply-approve/' + data.id)
    }
  }
]

const sceneColumns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '任务ID', dataIndex: 'id', width: 120 },
  { title: '场景ID', dataIndex: 'scenetset-id', width: 120 },
  { title: '场景名称', dataIndex: 'scenet-name', ellipsis: true },
  { title: '所属场景集', dataIndex: 'scenet-name', width: 200, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 180, formatter: getApplyStatus },
  { title: '申请人', dataIndex: 'createTime', width: 180 },
  { title: '申请时间', dataIndex: 'updateTime', width: 180 },
  { title: '审批时间', dataIndex: 'createUser', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      审批: (data: any) => router.push('/resource-sceneset/apply/' + data.id)
    }
  }
]

const tableRef = ref()
const modalVisible = ref(false)
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchPass = async () => {
  await api.scene.batchDelete({ scenes_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
const onBatchReject = async () => {
  await api.scene.batchDelete({ scenes_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
</script>