<template>
  <div class="main">
    <search-form :items="formItems" @on-search="onSearch"></search-form>
    <div class="flex justify-between items-center">
      <span class="title">算法管理</span>
    </div>
    <Table :api="mapsApi.getMaps" :query="query" :columns="columns" :scroll="{ x: 1200, y: 420 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'versionCount'">
          <a-tooltip :title="record.versionCount">
            <a class="text-blue" @click="() => router.push({ path: '/map/version/' + record.id, query: { name: 11 } })">
              {{ record.versionCount }}
            </a>
          </a-tooltip>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { SceneSourceOptions } from '@/utils/dict'
/****** api */
const mapsApi = api.maps
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '算法名称', key: 'name', type: 'input', placeholder: '请输入算法名称或ID' },
  { label: '算法类型', key: 'adsSource', type: 'select', options: SceneSourceOptions, defaultValue: '' }
])
const onSearch = (data: Query) => {
  query.value = data
}
/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '地图ID', dataIndex: 'id', width: 80 },
  { title: '地图名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '所属地图目录', dataIndex: 'catalogName', width: 90 },
  { title: '地图版本数量', dataIndex: 'versionCount', ellipsis: true },
  { title: '地图文件', dataIndex: 'xodr', width: 180, ellipsis: true },
  // { title: '地图类型', dataIndex: 'mapType', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '所属用户', dataIndex: 'createUser', width: 100, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/map/edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/map/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await mapsApi.deleteMaps(id)
    }
  }
]
</script>
