<template>
  <div class="main">
    <div class="breadcrumb">
      <router-link to="/map-manage/">地图管理</router-link>
      <!-- <a>地图管理</a> -->
      <span class="breadcrumb--current">地图版本</span>
    </div>
    <Table :api="mapsApi.getMapVersion" :query="query" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'mapType'">
          <a-tooltip :title="type[record.mapType]">
            {{ type[record.mapType] }}
          </a-tooltip>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const { name } = useRoute().query
const type: any = { 0: '内置', 1: '真实', 2: '虚拟' }
/****** api */
const mapsApi = api.maps
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({ map: id, name })
/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '地图版本ID', dataIndex: 'id', width: 150 },
  { title: '地图名称', dataIndex: 'mapName', width: 150, ellipsis: true },
  { title: '地图版本', dataIndex: 'mapVersion', width: 90 },
  { title: '地图文件', dataIndex: 'mapFileName', width: 100, ellipsis: true },
  { title: '地图类型', dataIndex: 'mapType', width: 100 },
  { title: '创建时间', dataIndex: 'importTime', width: 180 },
  { title: '地图文件地址', dataIndex: 'mapUrl', ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/map-manage/m-version-edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/map-manage/m-version-edit/' + data.id),
      删除: async ({ id }: { id: string }) => await mapsApi.deleteMapVersion(id)
    }
  }
]
</script>
