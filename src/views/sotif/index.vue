<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">SOTIF</span>
      <div>
        <a-button type="primary" class="mr-2" @click="()=> gotoSotif()">进入预期功能安全</a-button>
      </div>
    </div>
    <Table :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'projectStatus'">
          <span>{{  getSotifStatus(record.projectStatus) }}</span>
        </template>
        <template v-if="column.dataIndex == 'vehicleNameList'">
          <a-tooltip :title="record.vehicleNameList.join('  ')">
            <span v-for="label in record.vehicleNameList" :key="label" class="text-blue mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex == 'collaborationList'">
          <a-tooltip :title="record.collaborationList.join('  ')">
            <span v-for="label in record.collaborationList" :key="label" class="text-blue mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { SotifStatusOptions, getSotifStatus } from '@/utils/dict'
const currentApi: any = api.sotif
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '项目名称', key: 'projectName', type: 'input', maxlength: '100', placeholder: '请输入项目名称' },
  { label: '负责人', key: 'managerId', type: 'select', api: currentApi.getManagers , 
    fieldNames: { label:'userName', value:'userId'},
    placeholder: '请输入项目负责人' },
  {
    label: '项目状态',
    key: 'projectStatus',
    type: 'select',
    options: SotifStatusOptions,
    placeholder: '请选择项目状态'
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => {
  query.value = { ...data, startTime: data.start_date, endTime: data.end_date }
}
/****** 表格区域 */
const columns = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '项目名称', dataIndex: 'projectName', width: 200, ellipsis: true },
  { title: '负责人', dataIndex: 'manager', width: 200 },
  { title: '项目状态', dataIndex: 'projectStatus', width: 100},
  { title: '参与成员', dataIndex: 'collaborationList', ellipsis: true },
  { title: '分析项(整车级功能)', dataIndex: 'vehicleNameList', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      查看: {
        vadidator: (data:any) => !data.url,
        handler: (data: any) => gotoSotif(data.url)
      }
    }
  }
]

const token = store.user.token
const gotoSotif = (path: string = '') => {
  const query = 'token=' + token
  if(path) {
    window.open(path + '&' + query )
  } else {
    window.open(process.env.VITE_SOTIF_URL + '?' + query )
  }
}
</script>
