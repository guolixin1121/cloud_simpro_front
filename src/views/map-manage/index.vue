<template>
  <search-form :items="formItems" :manual="true" @on-search="onSearch"></search-form>
  <div class="main main-bg">
    <left-tree :title="'地图集'" :api="() => mapsApi.getMapCatalog({ tree: 1 })" :showCheckbox="false" @select="onSelect" />
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
/****** api */
const user = store.user
const mapsApi = api.maps
let catelog = store.catalog
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入地图名称或ID' }
])
const onSearch = (data: Query) => {
  const mapCatalog = catelog.mapCatalog as any
  query.value = { ...data, catalog: mapCatalog?.id }
}
/****** 表格区域 */
const router = useRouter()
const preRoute = router.currentRoute.value.path
const columns = [
  { title: '地图ID', dataIndex: 'id', width: 60 },
  { title: '地图名称', dataIndex: 'name', width: 150 },
  { title: '地图版本数量', dataIndex: 'versionCount', width: 60 },
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
  catelog.mapCatalog = val
  query.value = { ...query.value, catalog: val.id }
}
</script>
