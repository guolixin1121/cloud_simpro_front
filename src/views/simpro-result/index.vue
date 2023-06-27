<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">仿真结果列表</span>
    </div>

    <Table 
      ref="table"
      :loading="loading"
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns"
      :isOnlyCreator="true"
      :scroll="{ x: 1800, y: 'auto' }">
      <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex == 'is_passed'">
          {{ record.is_passed === null ? '--' : record.is_passed ? '通过' : '不通过' }}
        </template>
        <template v-if="column.dataIndex == 'status'">
          <span :class="'task-status task-status--' + record.status">{{ getResultStatus(record.status) }}</span>
        </template>
        <!-- <template v-if="column.dataIndex == 'actions'"> -->
          <!-- <span v-if="isRunOrWait(record.status)">
            <a class="text-blue mr-2" @click="onStop(record)">停止</a>
          </span>
          <template v-if="isFinished(record.status)">
            <router-link :to="`/simpro-result/view/${record.id}?u=${record.uuid}`" class="text-blue mr-2">查看结果</router-link>
          </template> -->
          <!-- <a-popconfirm
            v-if="isNotRunning(record.status) && (record.create_user == user.username)"
            title="是否删除？"
            ok-text="是"
            cancel-text="否"
            @confirm="onConfirmDelete(record)"
          >
            <a class="text-blue mr-2">删除</a>
          </a-popconfirm> -->
        <!-- </template> -->
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { TaskSourceOptions, getTaskSourceName, getResultStatus } from '@/utils/dict'

const templateId = useRoute().query.templateId as string
/****** api */
const currentApi = api.result

const isRunOrWait = (status: number) => status === 2 || status === 1
const isFinished = (status: number) => status === 3
const isNotRunning = (status: number) => status !== 2

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入仿真任务名称或任务ID', defaultValue: templateId },
  { label: '任务来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: '' },
  { label: '仿真结果', key: 'is_passed', type: 'select', 
    options: [
      {label: '全部', value: ''},
      {label: '不通过', value: '0'},
      {label: '通过', value: '1'},
      {label: '--', value: '2'}
    ],
    placeholder: '请选择仿真结果',
    defaultValue: '' 
  },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '完成时间', key: 'create_time', type: 'range-picker' }])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const table = ref()
const columns = [
  { title: '任务ID', dataIndex: 'id', width: 80 },
  { title: '仿真任务名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 90 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150, ellipsis: true },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150, ellipsis: true },
  { title: '评测指标', dataIndex: 'kpi_detail', width: 180, ellipsis: true },
  { title: '任务状态', dataIndex: 'status', width: 80 },
  { title: '任务结果', dataIndex: 'is_passed', width: 80 },
  { title: '完成时间', dataIndex: 'finish_time', width: 150 },
  { title: '所属用户', dataIndex: 'create_user', width: 100 },
  { title: '操作', dataIndex: 'actions', fixed: 'right', width: 150, 
    actions: {
      停止: {
        validator: (data: any) => isRunOrWait(data.status),
        handler: (data: any) => onStop(data)
      },
      查看结果: {
        validator: (data: any) => isFinished(data.status),
        handler: (data: any) => router.push(`/simpro-result/view/${data.id}?u=${data.uuid}`)
      },
      删除:  {
        validator: (data: any) => isNotRunning(data.status),
        handler: async (data: any) => await currentApi.delete(data.id)
      }
    }
  }
]

// const onConfirmDelete = async (record: RObject) => {
//   await currentApi.delete(record.id)
//   message.info('删除成功')
//   table.value.refresh()
// }

const loading = ref(false)
const onStop = async (record: RObject) => {
  try {
    loading.value = true
    await api.task.cancel({sim_task_id: record.id})
    message.info('停止成功')
    table.value.refresh()
  } finally {
    loading.value = false
  }
}
 </script>
 
