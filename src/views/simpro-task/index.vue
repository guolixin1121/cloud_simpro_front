<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">仿真任务列表</span>
      <div>
        <a-button type="primary" class="mr-2" :disabled="!selectedRunRows.length" @click="batchRun">运行</a-button>
        <a-button type="primary" class="mr-2" :disabled="!selectedDeleteRows.length" @click="showDeleteConfirm = true">删除</a-button>
        <a-button type="primary" :disabled="selectedRunRows.length || selectedDeleteRows.length" v-if="user.hasPermission('add')" @click="router.push('/simpro-task/edit/0')">创建任务</a-button>
      </div>
    </div>

    <Table
      ref="tableRef"
      :api="currentApi.getList"
      :query="query"
      :columns="columns"
      :isOnlyCreator="true"
      :scroll="{ x: 2000, y: 'auto' }"
      @select="onSelect"
    >
    </Table>

    <a-modal v-model:visible="showDeleteConfirm"
      :closable="false"
      :footer="null">
      <div>
        <svg-icon style="color: #faad14" icon="alert"></svg-icon>
        <span class="ml-4" style="font-size: 16px">是否删除？</span>
      </div>
      <div class="text-right mt-4 pt-4" style="border-top: 1px solid #f0f0f0">
        <a-button @click="showDeleteConfirm = false">否</a-button>
        <a-button @click="batchDelete" v-model:loading="isDeleting" type="primary" class="ml-2">是</a-button>
      </div>
    </a-modal>
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
const tableRef = ref()
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 40, 
    validator: (data: RObject) => ['运行', '等待'].indexOf(data.status) === -1 && user.user.username == data.create_user
  },
  { title: '任务ID', dataIndex: 'number', width: 120 },
  { title: '仿真任务名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 90 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150, ellipsis: true },
  { title: '场景文件数量', dataIndex: 'scene_count', width: 100 },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150, ellipsis: true },
  { title: '执行任务次数', dataIndex: 'batch', width: 100 },
  { title: '运行状态', dataIndex: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'create_time', width: 150 },
  { title: '所属用户', dataIndex: 'create_user', width: 100 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 180,
    actions: {
      运行: {
        validator: (data: RObject) => canBeRun(data),
        handler: async (data: RObject) => await currentApi.run({ template_id: data.id })
      },
      仿真结果: (data: RObject) => {
        SStorage.remove('simpro-result')
        router.push('/simpro-result/?templateId=' + data.number)
      },
      查看: (data: RObject) => router.push('/simpro-task/view/' + data.id),
      编辑: (data: RObject) => router.push('/simpro-task/edit/' + data.id),
      删除:{
        validator: (data: RObject) => canBeDelete(data),
        handler: async ({ id }: RObject) => await currentApi.delete(id)
      }
    }
  }
]

const canBeRun = (data: RObject) => ['运行', '等待'].indexOf(data.status) === -1 && user.user.username == data.create_user
const canBeDelete = (data: RObject) => data.status !== '运行' && user.user.username == data.create_user

const selectedRows = ref([])
const selectedRunRows = computed(() => selectedRows.value.filter((item: any) => canBeRun(item)))
const selectedDeleteRows = computed(() => selectedRows.value.filter((item: any) => canBeDelete(item)))
const onSelect = (_keys: any, data: any) => (selectedRows.value = data)
const batchRun = async () => {
  const templateids = selectedRunRows.value.map((item: any) => item.id)
  await currentApi.run({ template_id: templateids })
  message.info('批量运行成功')
  tableRef.value.refresh()
}

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const batchDelete = async () =>{
  try {
    const templateids = selectedDeleteRows.value.map((item: any) => item.id)
    isDeleting.value = true
    await currentApi.batchDelete({ template_id: templateids })
    message.info('批量删除成功')
    showDeleteConfirm.value = false
    tableRef.value.refresh()
  } finally {
    isDeleting.value = false
  }
}
</script>
