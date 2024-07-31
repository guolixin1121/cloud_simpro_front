<template>
  <search-form class="multiline-form " :items="formItems" @search="onSearch" @show-more="toggleMore"></search-form>

  <div class="main">
    <div class="title-section">
      <div class="flex items-center">
        <span class="title mr-4">仿真结果列表</span>
        <a-checkbox v-model:checked="isOwner" class="table_model" @change="onChecked">我的结果</a-checkbox>
      </div>
      <div>
        <template v-if="user.hasPermission('delete')">
          <a-button v-if="user.isRegisterUser()" :disabled="!selectedRows.length" @click="beforeHandler">删除</a-button>
          <batch-button v-else :disabled="!selectedRows.length" :api="batchDelete"></batch-button>
        </template>
      </div>
    </div>
    <a-spin :spinning="loading">
      <Table
        ref="table"
        :api="currentApi.getList"
        :query="query"
        :columns="columns"
        :scroll="{ x: 2200, y: 'auto' }"
        @select="onSelect"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'results_status'">
            <div class="flex items-center" :class="'task-passed--' + record.results_status">
              <template v-if="record.results_status == 1">通过</template>
              <template v-else-if="record.results_status == 0">未通过</template>
              <template v-else-if="record.results_status == 2">N/A</template>
              <template v-else>--</template>
              <!-- {{ record.is_passed === null ? '--' : record.is_passed ? '通过' : '未通过' }} -->
            </div>
          </template>
          <template v-if="column.dataIndex == 'status'">
            <span :class="'task-status task-status--' + record.status">{{ getResultStatus(record.status) }}</span>
            <a-tooltip placement="topLeft" v-if="record.status == 4 && record.errmsg">
              <template #title>
                <span v-html="record.errmsg.replaceAll('\n', '<br />')"></span>
              </template>
              <!-- 异常时显示错误信息 -->
              <img class="ml-1 cursor-pointer" style="height: 16px" src="../../assets/images/tip.png" />
            </a-tooltip>
          </template>
        </template>
      </Table>
    </a-spin>
  </div>
  <upgrade ref="upgradeModal" module="simulationManage"></upgrade>
</template>

<script setup lang="ts">
import { TaskSourceOptions, getTaskSourceName, resultStatus, getResultStatus } from '@/utils/dict'
import { gotoSubPage, openLink } from '@/utils/tools'

const templateId = useRoute().query.templateId as string
const user = store.user
const upgradeModal = ref()
const currentApi = api.result

const isRunOrWait = (status: number) => status === 2 || status === 1
const isFinished = (status: number) => status === 3 || status === 4
const isNotRunning = (status: number) => status !== 2

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})

const isOwner = ref(false)
const onChecked = () => (query.value = { ...query.value, owner: isOwner.value ? 1 : 0 })
const toggleMore = () => table.value.calcateHeight()

const formItems = ref<SearchFormItem[]>([
  {
    label: '名称',
    key: 'name',
    type: 'input',
    placeholder: '请输入仿真任务名称或任务ID',
    defaultValue: templateId,
    resetValue: ''
  },
  { label: '任务来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: '' },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '运行状态', key: 'status', type: 'select', options: resultStatus, defaultValue: '' },
  {
    label: '任务结果',
    key: 'is_passed',
    type: 'select',
    placeholder: '请选择仿真结果',
    defaultValue: '',
    options: [
      { label: '全部', value: '' },
      { label: '未通过', value: '0' },
      { label: '通过', value: '1' },
      { label: 'N/A', value: '2' },
      { label: '--', value: '-1' }
    ]
  },
  { label: '所属用户', key: 'user', type: 'input', placeholder: '请输入所属用户' },
  { label: '完成时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => (query.value = { ...data, owner: isOwner.value ? 1 : 0 })

/****** 表格区域 */
const beforeHandler = () => {
  if(user.isRegisterUser()) {
    upgradeModal.value.show()
    return true
  }
  return false
}
const table = ref()
const columns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: RObject) => isNotRunning(data.status) },
  { title: '任务ID', dataIndex: 'template_number', width: 150 },
  { title: '运行时序', dataIndex: 'serial', width: 100 },
  { title: '仿真任务名称', dataIndex: 'name', width: 200 },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 100 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 200 },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 200 },
  { title: '评测指标', dataIndex: 'kpi_detail', width: 180, ellipsis: true },
  { title: '运行状态', dataIndex: 'status', width: 120 },
  { title: '任务结果', dataIndex: 'results_status', width: 100 },
  { title: '完成时间', dataIndex: 'finish_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 200 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 180,
    actions: {
      停止: {
        beforeHandler,
        validator: (data: any) => isRunOrWait(data.status),
        handler: (data: any) => onStop(data)
      },
      查看结果: {
        validator: (data: any) => isFinished(data.status),
        handler: (data: any) => gotoSubPage(`/view/${data.id}?u=${data.uuid}`)
      },
      查看报告: {
        validator: (data: any) => isFinished(data.status) && data.obs_report,
        handler: (data: any) => openLink('/api/simpro/resource/' + data.obs_report)
      },
      删除: {
        validator: (data: any) => isNotRunning(data.status),
        beforeHandler,
        handler: async (data: any) => {
          if(user.isRegisterUser()) {
            upgradeModal.value.show()
            return
          }
          await currentApi.delete(data.id)
        }
      }
    }
  }
]

const loading = ref(false)
const onStop = async (record: RObject) => {
  try {
    loading.value = true
    await api.task.cancel({ sim_task_id: record.id })
    message.info('停止成功')
    table.value.refresh()
  } finally {
    loading.value = false
  }
}
const selectedRows = ref([])
const onSelect = (keys: any) => (selectedRows.value = keys)
const batchDelete = async () => {
  await currentApi.batchDelete({ tasks: selectedRows.value })
  table.value.refresh({ deletedRows: selectedRows.value.length })
}
</script>

<style lang="less" scope>
.task-passed--1 {
  color: #00b54e;
}
.task-passed--0 {
  color: #fa2f30;
}
</style>
