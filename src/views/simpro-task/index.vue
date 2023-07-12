<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">仿真任务列表</span>
      <div>
        <!-- <a-button type="primary" class="mr-2" :disabled="!selectedRows.length" @click="batchRun">批量运行</a-button> -->
        <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/simpro-task/edit/0')">创建任务</a-button>
      </div>
    </div>

    <Table
      ref="table"
      :api="currentApi.getList"
      :query="query"
      :columns="columns"
      :scroll="{ x: 2100, y: 'auto' }"
      :isOnlyCreator="true"
      :row-selection="{
        getCheckboxProps: (record: any) => ({
          disabled: ['运行', '等待'].indexOf(record.status) > -1
        }),
      }"
      @select="onSelect"
    >
    </Table>
  </div>
</template>

<script setup lang="ts">
import { TaskSourceOptions, getTaskSourceName } from '@/utils/dict'
import { SStorage } from '@/utils/storage'
/****** api */
const user = store.user
const currentApi = api.task

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入仿真任务名称或主车模型' },
  { label: '任务来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: '' },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const table = ref()
const router = useRouter()
const columns = [
  { title: '任务ID', dataIndex: 'number', width: 120 },
  { title: '仿真任务名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 90 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150, ellipsis: true },
  { title: '场景文件数量', dataIndex: 'scene_count', width: 100 },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150, ellipsis: true },
  // { title: '评测指标', dataIndex: 'kpi_detail', width: 180, ellipsis: true },
  // { title: '场景', dataIndex: 'scenes_detail', apiField: 'adsName', width: 180, ellipsis: true },
  { title: '执行任务次数', dataIndex: 'batch', width: 100 },
  { title: '运行状态', dataIndex: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'create_time', width: 150 },
  { title: '所属用户', dataIndex: 'create_user', width: 100 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      运行: {
        validator: (data: RObject) => ['运行', '等待'].indexOf(data.status) === -1 && user.user.username == data.create_user,
        handler: async (data: RObject) => await currentApi.run({ template_id: data.id })
      },
      仿真结果: (data: RObject) => {
        SStorage.remove('simpro-result')
        router.push('/simpro-result/?templateId=' + data.number)
      },
      查看: (data: RObject) => router.push('/simpro-task/view/' + data.id),
      编辑: (data: RObject) => router.push('/simpro-task/edit/' + data.id),
      删除: async ({ id }: RObject) => await currentApi.delete(id)
    }
  }
]

const selectedRows = ref([])
const onSelect = (data: any) => (selectedRows.value = data)
// const batchRun = async () =>{
//   console.log(selectedRows.value)
//   // await currentApi.run({ template_id: data.id })
// }
</script>
