<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">仿真结果</span>
    </div>

    <Table 
      ref="table"
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns"
      :scroll="{ x: 1800, y: 'auto' }">
      <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex == 'is_passed'">
          {{ record.is_passed === null ? '--' : record.is_passed ? '通过' : '不通过' }}
        </template>
        <template v-if="column.dataIndex == 'actions'">
          <span v-if="record.status == '运行'">---</span>
          <template v-else>
            <router-link :to="`/simpro-result/view/${record.id}`" class="text-blue mr-2">查看结果</router-link>
          </template>
          <a-popconfirm
            v-if="record.status != '运行'"
            title="你确定要删除吗？"
            ok-text="是"
            cancel-text="否"
            @confirm="onConfirmDelete(record)"
          >
            <a class="text-blue mr-2">删除</a>
          </a-popconfirm>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { TaskSourceOptions, getTaskSourceName } from '@/utils/dict'

/****** api */
const currentApi = api.result

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入仿真任务名称或主车模型' },
  { label: '场景来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: '' },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '创建时间', key: 'date', type: 'range-picker' }
])
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
  { title: '所属用户', dataIndex: 'createUser', width: 100 },
  { title: '操作', dataIndex: 'actions', fixed: 'right', width: 150 }
]

const onConfirmDelete = async (record: RObject) => {
  await currentApi.delete(record.id)
  message.info('删除成功')
  table.value.refresh()
}
 </script>
 
