<template>
  <search-form class="multiline-form " :items="formItems" @search="onSearch" @show-more="toggleMore"></search-form>

  <div class="main">
    <div class="title-section">
      <div class="flex items-center">
        <span class="title mr-4">仿真任务列表</span>
        <a-checkbox v-model:checked="isOwner" class="table_model" @change="onChecked">我的任务</a-checkbox>
      </div>
      <div>
        <a-button :disabled="!selectedRunRows.length" v-if="user.hasPermission('run')" @click="batchRun">运行</a-button>
        <template v-if="user.hasPermission('delete')">
          <a-button v-if="user.isRegisterUser()" :disabled="!selectedRunRows.length" @click="beforeHandler">删除</a-button>
          <batch-button v-else :disabled="!selectedDeleteRows.length" :api="batchDelete"></batch-button>
        </template>
        <a-button type="primary" :disabled="selectedRunRows.length || selectedDeleteRows.length" v-if="user.hasPermission('add')" @click="onCreate">创建任务</a-button>
      </div>
    </div>

    <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 2000, y: 'auto' }" @select="onSelect">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex == 'vehicle_detail' && !isEmpty(text)">
          <!-- <a-tooltip :title="text.dynamic_model_name + '_' + text.version " placement="topLeft"> -->
            {{ text.dynamic_model_name + '_' + text.version }}
          <!-- </a-tooltip> -->
        </template>
      </template>
    </Table>
  </div>
  <upgrade ref="upgradeModal" module="simulationManage"></upgrade>
</template>

<script setup lang="ts">
import { TaskSourceOptions, getTaskSourceName, resultStatus } from '@/utils/dict'
import { SStorage } from '@/utils/storage'
import { isEmpty } from '@/utils/tools'
/****** api */
const user = store.user
const currentApi = api.task
const upgradeModal = ref()

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入仿真任务名称或主车模型' },
  { label: '任务ID', key: 'number', type: 'input', placeholder: '请输入仿真任务ID' },
  { label: '任务来源', key: 'source', type: 'select', options: TaskSourceOptions, defaultValue: '' },
  { label: '运行状态', key: 'status', type: 'select', options: resultStatus, defaultValue: '' },
  { label: '仿真算法', key: 'algorithm', type: 'select', api: api.algorithm.getList, defaultValue: '' },
  { label: '所属用户', key: 'user', type: 'input', placeholder: '请输入所属用户' },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => (query.value = { ...data, owner: isOwner.value ? 1 : 0 })

const isOwner = ref(false)
const onChecked = () => (query.value = { ...query.value, owner: isOwner.value ? 1 : 0 })
const toggleMore = () => tableRef.value.calcateHeight()

const onCreate = () => {
  if(beforeHandler()) return
  router.push('/simpro-task/edit/')
}

/****** 表格区域 */
const beforeHandler = () => {
  if(user.isRegisterUser()) {
    upgradeModal.value.show()
    return true
  }
  return false
}
const tableRef = ref()
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 50, validator: (data: RObject) => ['等待', '运行'].indexOf(data.status) == -1 },
  { title: '任务ID', dataIndex: 'number', width: 150 },
  { title: '仿真任务名称', dataIndex: 'name', width: 150 },
  { title: '任务来源', dataIndex: 'source', formatter: getTaskSourceName, width: 90 },
  { title: '场景文件数量', dataIndex: 'scene_count', width: 100 },
  { title: '主车模型', dataIndex: 'vehicle_detail', width: 150 },
  { title: '仿真算法', dataIndex: 'algorithm_detail', width: 150 },
  { title: '执行任务次数', dataIndex: 'batch', width: 100 },
  { title: '运行状态', dataIndex: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'create_time', width: 150 },
  { title: '所属用户', dataIndex: 'create_user', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 180,
    actions: {
      查看: (data: RObject) => router.push('/simpro-task/view/' + data.id),
      运行: {
        validator: (data: RObject) => canBeRun(data),
        beforeHandler,
        handler: async (data: RObject) => await currentApi.run({ template_id: data.id })
      },
      仿真结果: {
        // 此按钮根据‘仿真结果’菜单项的权限来判断
        validator: () => user.hasAcl('cloud:simulation:results'),
        handler: (data: RObject) => {
          SStorage.remove('simpro-result')
          router.push('/simpro-result/?templateId=' + data.number)
        }
      },
      编辑: {
        beforeHandler,
        handler: (data: RObject) => {
          if(user.isRegisterUser()) {
              upgradeModal.value.show()
              return
            }
          router.push('/simpro-task/edit/' + data.id)
        }
      },
      删除: {
        validator: (data: RObject) => canBeDelete(data),
        beforeHandler,
        handler: async ({ id }: RObject) => await currentApi.delete(id)
      }
    }
  }
]

const canBeRun = (data: RObject) => ['运行', '等待'].indexOf(data.status) === -1 // && user.user.username == data.create_user
const canBeDelete = (data: RObject) => data.status !== '运行' // && user.user.username == data.create_user

const selectedRows = ref([])
const selectedRunRows = computed(() => selectedRows.value.filter((item: any) => canBeRun(item)))
const selectedDeleteRows = computed(() => selectedRows.value.filter((item: any) => canBeDelete(item)))
const onSelect = (_keys: any, data: any) => (selectedRows.value = data)
const batchRun = async () => {
  if(beforeHandler()) return
  const templateids = selectedRunRows.value.map((item: any) => item.id)
  await currentApi.run({ template_id: templateids })
  tableRef.value.refresh()
}
const batchDelete = async () => {
  const templateids = selectedDeleteRows.value.map((item: any) => item.id)
  await currentApi.batchDelete({ template_id: templateids })
  tableRef.value.refresh({ deletedRows: selectedDeleteRows.value.length })
}
</script>
