<template>
  <search-form v-if="activeKey == 1" :items="formItems" @search="onSearch"></search-form>
  <search-form v-else :items="stpaFormItems" @search="onStpaSearch"></search-form>

  <div class="main">
    <!-- margin-top调整因tab引起的margin-top变大的问题 -->
    <div class="flex justify-between items-center" style="margin-top: -12px">
      <!-- <span class="title">SOTIF</span> -->

      <a-tabs v-model:activeKey="activeKey" class="tabs">
        <a-tab-pane :key="1" tab="SOTIF分析">
        </a-tab-pane>
        <a-tab-pane :key="2" tab="STPA分析">
        </a-tab-pane>
      </a-tabs> 
      <div>
        <a-button type="primary" @click="()=> gotoSotif()">进入SOTIF分析工具</a-button>
      </div>
    </div>
    <Table style="margin-top: 0" v-if="activeKey == 1" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'projectStatus'">
          <span>{{  getSotifStatus(record.projectStatus) }}</span>
        </template>
        <template v-if="column.dataIndex == 'vehicleNameList'">
          <a-tooltip placeholder="topLeft" :title="record.vehicleNameList.join('  ')">
            <span v-for="label in record.vehicleNameList" :key="label" class="label mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex == 'collaborationList'">
          <a-tooltip placeholder="topLeft"  :title="record.collaborationList.join('  ')">
            <span v-for="label in record.collaborationList" :key="label" class="label mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
      </template>
    </Table>

    <Table style="margin-top: 0" v-else :api="currentApi.getStpaList" :query="stpaQuery" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'projectStatus'">
          <span>{{  getSotifStatus(record.projectStatus) }}</span>
        </template>
        <template v-if="column.dataIndex == 'vehicleNameList'">
          <a-tooltip placeholder="topLeft" :title="record.vehicleNameList.join('  ')">
            <span v-for="label in record.vehicleNameList" :key="label" class="label mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex == 'collaborationList'">
          <a-tooltip placeholder="topLeft" :title="record.collaborationList.join('  ')">
            <span v-for="label in record.collaborationList" :key="label" class="label mr-2">
              {{ label}}
            </span>
          </a-tooltip>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
// 组件不支持api变化，所以尽管只api不同其他逻辑都相同，暂时还是需要写两套几乎相同的代码

import { SotifStatusOptions, getSotifStatus } from '@/utils/dict'
const currentApi: any = api.sotif
const activeKey = ref(1)
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '项目名称', key: 'projectName', type: 'input', maxlength: '100', placeholder: '请输入项目名称' },
  { label: '负责人', key: 'managerId', type: 'select', api: api.sotif.getManagers , 
    fieldNames: { label:'userName', value:'userId'},
    placeholder: '请输入项目负责人' },
  {
    label: '项目状态',
    key: 'projectStatus',
    type: 'select',
    options: SotifStatusOptions,
    placeholder: '请选择项目状态',
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => {
  query.value = { ...data, startTime: data.start_date, endTime: data.end_date }
}

// stpa搜索区域
const stpaFormItems = ref<SearchFormItem[]>([
  { label: '项目名称', key: 'projectName', type: 'input', maxlength: '100', placeholder: '请输入项目名称' },
  { label: '负责人', key: 'managerId', type: 'select', api: api.sotif.getStpaManagers , 
    fieldNames: { label:'userName', value:'userId'},
    placeholder: '请输入项目负责人' },
  {
    label: '项目状态',
    key: 'projectStatus',
    type: 'select',
    options: SotifStatusOptions,
    placeholder: '请选择项目状态',
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])

const stpaQuery: Query = ref({})
const onStpaSearch = (data: Query) => {
  stpaQuery.value = { ...data, startTime: data.start_date, endTime: data.end_date }
}

/****** 表格区域 */
const columns = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '项目名称', dataIndex: 'projectName', width: 200, ellipsis: true },
  { title: '负责人', dataIndex: 'manager', width: 200 },
  { title: '参与成员', dataIndex: 'collaborationList',  width: 200, ellipsis: true },
  { title: '分析项(整车级功能)', dataIndex: 'vehicleNameList',  width: 200, ellipsis: true },
  { title: '项目状态', dataIndex: 'projectStatus', width: 100},
  { title: '创建时间', dataIndex: 'createTime', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      查看: {
        validator: (data:any) => data.url,
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
    window.open('/sotif_front/' + '?' + query )
  }
}
</script>
