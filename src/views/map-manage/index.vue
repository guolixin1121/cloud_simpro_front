<template>
  <div class="main-tree">
    <tree 
      :title="'地图集'" 
      :api="mapsApi.getMapCatalog" 
      :button-handlers="treeBtnHandlers"
      @select="onTreeSelect" />
    <div class="main-right">
      <div class="right-title">
        <div class="title-item"><span class="label">地图集名称</span>{{ selectedMapset?.name }}</div>
      </div>

      <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>

      <div class="main">
        <div class="flex justify-between items-center">
          <span class="title">地图列表</span>
          <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/map-manage/edit/0')">上传地图</a-button>
        </div>
        <Table :api="mapsApi.getMaps" :query="query" :columns="columns" :scroll="{ x: 300, y: 'auto' }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'versionCount'">
              <a-tooltip :title="record.versionCount">
                <a class="text-blue inline-block w-full"
                  @click="() => router.push({ path: '/map-manage/version/' + record.id, query: { preRoute, name: record.name } })"
                >
                  {{ record.versionCount }}
                </a>
              </a-tooltip>
            </template>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const mapsApi = api.maps
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入地图名称' }
])

const selectedMapset = ref()
const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const mapCatalog = selectedMapset.value
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
      查看: (data: any) => router.push('/map-manage/edit/' + data.id + '?type=0&name=' + encodeURIComponent(data.name)),
      编辑: (data: any) => router.push('/map-manage/edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
      删除: async ({ id, name }: any) => await mapsApi.deleteMaps({ id, data: { name } })
    }
  }
]

const onTreeSelect = (val: any) => {
  selectedMapset.value = val
  store.catalog.mapCatalog = val
  // 切换地图集，地图列表page重置为1
  query.value = { ...query.value, catalog: val.id, page: 1 }
}

const treeBtnHandlers = {
  add: () => router.push('/map-manage/mapset-edit/0'),
  edit: (data: any) => router.push('/map-manage/mapset-edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
  delete: api.mapsets.delete
}
</script>
