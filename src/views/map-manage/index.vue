<template>
  <div class="main-tree">
    <tree :title="'地图集'" :api="mapsApi.getMapCatalog" :button-handlers="treeBtnHandlers" 
      @select="onTreeSelect"/>

    <div class="main-right">
      <a-spin :spinning="catalogLoading">
        <div class="right-title">
          <div class="title-item"><span class="label">地图集名称</span>{{ selectedMapset?.name }}</div>
        </div>
      </a-spin>
      <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>
      <div class="main">
        <div class="title-section">
          <span class="title">地图列表</span>
          <div>
            <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
            <a-button type="primary" :disabled="selectedItems.length > 0" v-if="user.hasPermission('add')" @click="gotoSubPage('/edit/0')">上传地图</a-button>
          </div>
        </div>
        <Table ref="tableRef" :api="mapsApi.getMaps" :query="query" :columns="columns" :scroll="{ x: 800, y: 'auto' }"
          @select="onSelect" >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'versionCount'">
              <a class="text-link inline-block w-full" @click="gotoVersion(record)">
                {{ record.versionCount }}
              </a>
            </template>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gotoSubPage } from '@/utils/tools'

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
const columns = [
  { title: '', dataIndex: 'checkbox', width: 60 },
  { title: '地图ID', dataIndex: 'id', width: 150 },
  { title: '地图名称', dataIndex: 'name' },
  { title: '地图版本数量', dataIndex: 'versionCount', width: 250 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => gotoSubPage('/edit/' + data.id + '?type=0&name=' + encodeURIComponent(data.name)),
      编辑: (data: any) => gotoSubPage('/edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
      删除: {
        tip: '删除后，关联数据(场景、地图等)将会一起删除，是否删除？',
        handler: async ({ id, name }: any) => await mapsApi.deleteMaps({ id, data: { name } })
      }
    }
  }
]

const gotoVersion = (record: any) => gotoSubPage('/version/' + record.id + '?name=' + encodeURIComponent(record.name))

const catalogLoading = ref(false)
store.catalog.mapCatalog = {}
const onTreeSelect = async (val: any) => {
  selectedMapset.value = val
  store.catalog.mapCatalog = val
  // 切换地图集，地图列表page重置为1
  query.value = { ...query.value, catalog: val.id, page: 1 }
}

const treeBtnHandlers = {
  add: () => gotoSubPage('/mapset/0'),
  edit: (data: any) => gotoSubPage('/mapset/' + data.id + '?name=' + encodeURIComponent(data.name) + '&isLeaf=' + data.isLeaf),
  delete: api.mapsets.delete
}

const tableRef = ref()
const selectedItems = ref([])
const onSelect = (selectedKeys: any, selectedRows: any) => selectedItems.value = selectedRows.map((item: any) => item.name)
const onBatchDelete = async () => {
  await api.maps.batchDeleteMaps({maps_name: selectedItems.value})
  tableRef.value.refresh({ deletedRows: selectedItems.value.length })
}
</script>
