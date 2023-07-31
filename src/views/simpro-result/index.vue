<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <page-title title="仿真结果列表">
      <batch-button :disabled="!selectedRows.length" v-if="user.hasPermission('delete')" :api="batchDelete"></batch-button>
    </page-title>

    <a-spin :spinning="loading">
      <Table
        ref="table"
        :api="currentApi.getList"
        :query="query"
        :columns="columns"
        :isOnlyCreator="true"
        :scroll="{ x: 1900, y: 'auto' }"
        @select="onSelect"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'is_passed'">
            <div class="flex items-center">
              {{ record.is_passed === null ? '--' : record.is_passed ? '通过' : '未通过' }}
            </div>
          </template>
          <template v-if="column.dataIndex == 'status'">
            <span :class="'task-status task-status--' + record.status">{{ getResultStatus(record.status) }}</span>
            <a-popover title="" trigger="hover" v-if="record.status == 4 && record.errmsg">
              <!-- 异常时显示错误信息 -->
              <template #content>
                <span v-html="record.errmsg"></span>
              </template>
              <img class="ml-1 cursor-pointer" src="../../assets/images/tip.png" />
            </a-popover>
          </template>
        </template>
      </Table>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { TaskSourceOptions, getTaskSourceName, getResultStatus } from '@/utils/dict'

const templateId = useRoute().query.templateId as string
const router = useRouter()
const user = store.user
const currentApi = api.result

const isRunOrWait = (status: number) => status === 2 || status === 1
const isFinished = (status: number) => status === 3
const isNotRunning = (status: number) => status !== 2

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
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
  {
    label: '仿真结果',
    key: 'is_passed',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '未通过', value: '0' },
      { label: '通过', value: '1' },
      { label: '--', value: '2' }
    ],
    placeholder: '请选择仿真结果',
    defaultValue: ''
  },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '完成时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const table = ref()
const columns = [
  { dataIndex: 'checkbox', width: 50 },
  { title: '任务ID', dataIndex: 'template_number', width: 130 },
  { title: '仿真任务名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 90 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150, ellipsis: true },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150, ellipsis: true },
  { title: '评测指标', dataIndex: 'kpi_detail', width: 180, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 100 },
  { title: '任务结果', dataIndex: 'is_passed', width: 80 },
  { title: '完成时间', dataIndex: 'finish_time', width: 150 },
  { title: '所属用户', dataIndex: 'create_user', width: 100 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      停止: {
        validator: (data: any) => isRunOrWait(data.status),
        handler: (data: any) => onStop(data)
      },
      查看结果: {
        validator: (data: any) => isFinished(data.status),
        handler: (data: any) => router.push(`/simpro-result/view/${data.id}?u=${data.uuid}`)
      },
      删除: {
        validator: (data: any) => isNotRunning(data.status),
        handler: async (data: any) => await currentApi.delete(data.id)
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
  table.value.refresh()
}
</script>
