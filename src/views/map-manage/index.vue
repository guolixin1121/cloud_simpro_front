<template>
  <div class="main-tree">
    <tree ref="treeRef" :title="'地图集'" :api="mapsApi.getMapCatalog" @select="onSelect" 
      @btn-click="onClick"/>
    <div class="main-right">
      <a-spin :spinning="loading">
        <div class="right-title">
          <div class="title-item"><span class="label">地图集名称</span>{{ catalog.mapCatalog.name }}</div>
        </div>
      </a-spin>

      <search-form :items="formItems" :manual="true" @search="onSearch"></search-form>

      <div class="main">
        <div class="flex justify-between items-center">
          <span class="title">地图管理</span>
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
import { catalog } from '@/store';

/****** api */
const user = store.user
const mapsApi = api.maps
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入地图名称' }
])

let catelog = store.catalog
catalog.mapCatalog = {} as any
const query: Query = ref({})
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
      查看: (data: any) => router.push('/map-manage/edit/' + data.id + '?type=0&name=' + encodeURIComponent(data.name)),
      编辑: (data: any) => router.push('/map-manage/edit/' + data.id + '?name=' + encodeURIComponent(data.name)),
      删除: async ({ id, name }: any) => await mapsApi.deleteMaps({ id, data: { name } })
    }
  }
]

const onSelect = (val: any) => {
  catelog.mapCatalog = val
  query.value = { ...query.value, catalog: val.id }

  console.log(query.value, 'onSelect')
}

const onClick = (val: any) => {
  const { type, data } = val
  const id = type == 'add' ? 0 : data.id
  if(type == 'add') router.push('/map-manage/mapset-edit/0')
  if(type == 'edit') router.push('/map-manage/mapset-edit/' + id + '?name=' + encodeURIComponent(data.name))
  if(type == 'delete') deleteData(id)
}

const treeRef = ref()
const loading = ref(false)
const deleteData = async (id: string) => {
  loading.value = true
  await api.mapsets.delete(id)
  message.info('删除成功')
  loading.value = false
  treeRef.value.refresh()
}
</script>
