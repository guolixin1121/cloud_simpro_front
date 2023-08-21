<template>
  <div class="main-tree">
    <tree :title="'地图集'" :api="mapsApi.getMapCatalog" :button-handlers="treeBtnHandlers" 
      @select="onTreeSelect"
      :refreshSelected="getMapSet"/>

    <div class="main-right">
      <a-spin :spinning="catalogLoading">
        <div class="right-title">
          <div class="title-item"><span class="label">地图集名称</span>{{ selectedMapset?.name }}</div>
        </div>
      </a-spin>
      <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>

      <div class="main">
        <div class="flex justify-between items-center">
          <span class="title">地图列表</span>
          <div>
            <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
            <a-button type="primary" :disabled="selectedItems.length > 0" v-if="user.hasPermission('add')" @click="router.push('/map-manage/edit/0')">上传地图</a-button>
          </div>
        </div>
        <Table ref="tableRef" :api="mapsApi.getMaps" :query="query" :columns="columns" :scroll="{ x: 800, y: 'auto' }"
          @select="onSelect" >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'versionCount'">
              <a-tooltip :title="record.versionCount">
                <a class="text-blue inline-block w-full" @click="gotoVersion(record)">
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
import { SStorage } from '@/utils/storage'
import { isEmpty } from '@/utils/tools'

/****** api */
const user = store.user
const mapsApi = api.maps
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([{ label: '名称', key: 'name', type: 'input', placeholder: '请输入地图名称' }])

const selectedMapset = ref()
const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const mapCatalog = selectedMapset.value
  query.value = { ...data, catalog: mapCatalog?.id }
}

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '', dataIndex: 'checkbox', width: 60 },
  { title: '地图ID', dataIndex: 'id', width: 100 },
  { title: '地图名称', dataIndex: 'name' },
  { title: '地图版本数量', dataIndex: 'versionCount', width: 120 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/map-manage/edit/' + data.id + '?type=0&name=' + encodeURIComponent(data.name)),
      编辑: (data: any) => router.push('/map-manage/edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
      删除: async ({ id, name }: any) => await mapsApi.deleteMaps({ id, data: { name } })
    }
  }
]

const preRoute = router.currentRoute.value.path
const gotoVersion = (record: any) => {
  const versionUrlPath = '/map-manage/version/' + record.id
  SStorage.remove(versionUrlPath + ':table-page')
  router.push({ path: versionUrlPath, query: { preRoute, name: record.name } })
}

const catalogLoading = ref(false)
store.catalog.mapCatalog = {}
const onTreeSelect = async (val: any) => {
  selectedMapset.value = val
  store.catalog.mapCatalog = val
  // 切换地图集，地图列表page重置为1
  query.value = { ...query.value, catalog: val.id, page: 1 }
  // if (val?.isLeaf) {
  //   try {
  //     catalogLoading.value = true
  //     const res = await api.mapsets.getList()
  //     selectedMapset.value = getMapSet(res.results, val.id)
  //     store.catalog.mapCatalog = selectedMapset.value
  //   } finally {
  //     catalogLoading.value = false
  //   }
  // }
}

const treeBtnHandlers = {
  add: () => router.push('/map-manage/mapset-edit/0'),
  edit: (data: any) => router.push('/map-manage/mapset-edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
  delete: api.mapsets.delete
}

const tableRef = ref()
const selectedItems = ref([])
const onSelect = (selectedKeys: any, selectedRows: any) => selectedItems.value = selectedRows.map((item: any) => item.name)
const onBatchDelete = async () => {
  await api.maps.batchDeleteMaps({maps_name: selectedItems.value})
  tableRef.value.refresh()

}

// 遍历地图目录树查找
// 修复更新地图集后无法同步获取新数据的问题
const getMapSet = async (id: string, data?: any) => {
  if(!data) {
    const res = await api.mapsets.getList()
    data = res.results
  }
  let result = {}
  for(let i = 0; i < data.length; i++) {
    const item = data[i]
    if(item.id == id) {
      result = item
    } else if(item.children) {
      result = getMapSet(id, item.children)
    }
    if(!isEmpty(result)) {
      break
    }
  }
  return result
}
</script>
