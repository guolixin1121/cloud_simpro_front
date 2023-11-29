<template>
  <div class="main">
    <div class="breadcrumb">
      <router-link to="/map-manage/">地图管理</router-link>
      <!-- <a>地图管理</a> -->
      <span class="breadcrumb--current">地图版本</span>
    </div>
    <a-spin :spinning="loading">
      <Table ref="table" :api="mapsApi.getMapVersion" :query="query" :columns="columns" :scroll="{ x: 1000, y: 'auto' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'mapType'">
            <a-tooltip :title="type[record.mapType]">
              {{ type[record.mapType] }}
            </a-tooltip>
          </template>
        </template>
      </Table>
    </a-spin>
  </div>
  <VncModal ref="vncModal"></VncModal>
</template>

<script setup lang="ts">
import { gotoVnc} from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
const vncModal = ref()
const { id } = useRoute().params
const { name } = useRoute().query
const type: any = { 0: '内置', 1: '真实', 2: '虚拟' }
/****** api */
const mapsApi = api.maps
/****** 搜素区域 */

const loading = ref(false)
const query: Query = ref({ map: id, name })
/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '地图版本ID', dataIndex: 'id', width: 180 },
  { title: '地图版本', dataIndex: 'mapVersion', width: 90 },
  { title: '地图文件', dataIndex: 'mapFileName', width: 180, ellipsis: true },
  // { title: '地图类型', dataIndex: 'mapType', width: 100 },
  { title: '创建时间', dataIndex: 'importTime', width: 150 },
  { title: '创建者', dataIndex: 'importUserName', width: 100 },
  // { title: '地图文件地址', dataIndex: 'mapUrl', ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/map-manage/version-edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/map-manage/version-edit/' + data.id),
      编辑地图: (data: any) => gotoVnc({
          action: 2,
          value: JSON.stringify({
            map_name: data.mapName,
            version: data.mapVersion,
            map_id: data.id,
            catalog: store.catalog.mapCatalog?.id
          })
        }, 
        loading,
        null,
        () => vncModal.value.show()),
      删除: async ({ id }: { id: string }) => await mapsApi.deleteMapVersion(id)
    }
  }
]

// let count = 0
// const gotoVnc =async (data: any) => {
//   try {
//     loading.value = true
//     const res = await api.vnc.enterVnc({
//       action: 2,
//       value: data.id
//     })
//     loopVnc(res.id)
//   } catch {
//     loading.value = false
//   }
// }
// const loopVnc = async (id: String) => {
//   if(count >= 8) {
//     loading.value = false
//     message.info('连接服务器失败')
//     return
//   }
//   try {
//     count++
//     loading.value = true
//     const res = await api.vnc.checkVnc(id)
//     if(res.status == 1 && res.address) {
//       loading.value = false
//       window.open(res.address, 'vnc')
//     } else {
//       setTimeout(() => loopVnc(id), 1000)
//     }
//   } catch {
//     loading.value = false
//   }
// }

const table = ref()
onMounted(()=> table.value.refresh())
</script>
