<template>
  <search-form :items="formItems" :manual="true" @on-search="onSearch"></search-form>
  <div class="main main-bg">
    <!-- <left-tree :title="'地图目录'" @select="onSelect" :api="() => mapsApi.getMapCatalog({ tree: 1 })" /> -->
    <l-tree :title="'地图集'" :api="() => mapsApi.getMapCatalog({ tree: 1 })" :showCheckbox="false" @select="onSelect" />
    <div class="right-table">
      <div class="flex justify-between items-center">
        <span class="title">地图管理</span>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/map-manage/edit/0')">上传地图</a-button>
      </div>
      <Table :api="mapsApi.getMaps" :query="query" :columns="columns" :scroll="{ x: 300, y: 'auto' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'versionCount'">
            <a-tooltip :title="record.versionCount">
              <a
                class="text-blue"
                @click="
                  () => router.push({ path: '/map-manage/map-version/' + record.id, query: { preRoute, name: record.name } })
                "
              >
                {{ record.versionCount }}
              </a>
            </a-tooltip>
          </template>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { SStorage } from '@/utils/storage'
/****** api */
const user = store.user
const mapsApi = api.maps
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const selectTreeQuery = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入地图名称或ID' }
  // {
  //   label: '地图类型',
  //   key: 'mapType',
  //   type: 'select',
  //   options: MapManageSourceOptions,
  //   defaultValue: ''
  // },
  // {
  //   label: '地图目录',
  //   key: 'catalog',
  //   type: 'tree-select',
  //   checkLeaf: false,
  //   api: () => mapsApi.getMapCatalog({ tree: 1 }),
  //   placeholder: '请选择地图目录',
  //   onSelect: (id: any, node: any) => {
  //     SStorage.set('catalog', { id, name: node.title })
  //   }
  // }
  // { label: '创建时间', key: 'date', type: 'range-picker' }
])
const onSearch = (data: Query) => {
  query.value = { ...data, ...selectTreeQuery.value }
}
/****** 表格区域 */
const router = useRouter()
const preRoute = router.currentRoute.value.path
const columns = [
  { title: '地图ID', dataIndex: 'id', width: 60 },
  { title: '地图名称', dataIndex: 'name', width: 150 },
  // { title: '所属地图目录', dataIndex: 'catalogName', width: 100 },
  { title: '地图版本数量', dataIndex: 'versionCount', width: 60 },
  // { title: '地图文件', dataIndex: 'mapFileName', ellipsis: true },
  // { title: '创建时间', dataIndex: 'create_time', width: 180 },
  // { title: '所属用户', dataIndex: 'create_user', width: 100 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 60,
    actions: {
      查看: (data: any) => router.push('/map-manage/edit/' + data.id + '?type=0&name=' + data.name),
      编辑: (data: any) => router.push('/map-manage/edit/' + data.id + '?name=' + data.name),
      删除: async ({ id, name }: any) => await mapsApi.deleteMaps({ id, data: { name } })
    }
  }
]

const onSelect = (val: any) => {
  selectTreeQuery.value = { catalog: val.id }
  query.value = { ...query.value, catalog: val.id }
}

// const route = useRoute()
// watch(
//   () => route,
//   (newVal: any, oldVal) => {
//     console.log(newVal, newVal.meta, oldVal)
//     // if(newVal.meta.keepAlive && state.includeList.indexOf(newVal.name) === -1){
//     //   state.includeList.push(newVal.name);
//     //   console.log(state.includeList);
//     // }
//   },
//   { deep: true }
// ) // 开启深度监听
</script>
