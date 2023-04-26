<template>
    <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main" >
    <div class="flex justify-between items-center">
      <span class="title">仿真结果管理</span>
    </div>
    
    <Table 
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns"
      :scroll="{ x: 1800 }">
      <template #bodyCell="{column, record}">
          <template v-if="column.dataIndex == 'kpi_detail'">
            <a-tooltip :title="record.kpi_detail.map((d: any) => d.name).join('  ')">
              <span v-for="label in record.kpi_detail" :key="label.id" class="text-blue mr-2">
                {{ label.name }}
              </span>
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex == 'adsSource'">
            {{ getTaskSourceName(record.source)}}
          </template>

          <template v-if="column.dataIndex == 'vehicle_detail'">
            {{ record.vehicle_detail?.name }}
          </template>
          <template v-if="column.dataIndex == 'algorithm_detail'">
            {{ record.algorithm_detail.name }}
          </template>
          <template v-if="column.dataIndex == 'actions'">
            123123
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
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入仿真任务名称或主车模型'},
  { label: '场景来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: ''},
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: ''},
  { label: '创建时间', key: 'date', type: 'range-picker' }
])
const onSearch = (data: Query) => query.value = data

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '任务ID', dataIndex: 'id', width: 80 },
  { title: '仿真任务名称', dataIndex: 'name', width: 150, ellipsis: true},
  { title: '任务来源', dataIndex: 'source', width: 90 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150, ellipsis: true },
  { title: '场景文件数量', dataIndex: 'scene_count', width: 100 },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150, ellipsis: true  },
  { title: '评测指标', dataIndex: 'kpi_detail', width: 180, ellipsis: true },
  { title: '执行任务次数', dataIndex: 'batch', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 150 },
  { title: '所属用户', dataIndex: 'createUser', width: 100, ellipsis: true },
  {
    title: '操作', dataIndex: 'actions', fixed: 'right', width: 150,
    actions: {
      '查看': ( data: any ) => router.push('/simpro/view/' + data.id),
      '编辑': ( data: any ) => router.push('/simpro/edit/' + data.id),
      '删除': async ({ id }: { id: string} ) => await currentApi.delete(id)
    }
  }
]
 </script>
 