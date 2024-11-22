<template>
  <div class="breadcrumb">
    <router-link to="/map-manage/">地图管理</router-link>
    <!-- <a>地图管理</a> -->
    <span class="breadcrumb--current">地图版本</span>
  </div>
  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title mr-4">地图版本列表</span>
    </div>
    <a-spin :spinning="loading">
      <Table ref="table" :api="mapsApi.getMapVersion" :query="query" :columns="columns" :scroll="{ x: 1400, y: 'auto' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'mapType'">
            <a-tooltip placement="topLeft" :title="type[record.mapType]">
              {{ type[record.mapType] }}
            </a-tooltip>
          </template>
        </template>
      </Table>
    </a-spin>
  </div>

  <a-modal v-model:visible="downloadModal.visible" title="下载地图" :footer="null" :destroyOnClose="true">
      <div class="modal-content">
       是否下载地图文件？
      </div>
      <div class="modal-buttons">
        <a-button @click="downloadModal.visible = false">取消</a-button>
        <a-button @click="onConfirmDownload" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
  <VncModal ref="vncModal"></VncModal>
  <upgrade ref="upgradeModal" module="simulationManage"></upgrade>
</template>

<script setup lang="ts">
import { download } from '@/utils/tools'
import { gotoVnc} from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
const vncModal = ref()
const { name, id } = useRoute().query
const type: any = { 0: '内置', 1: '真实', 2: '虚拟' }
/****** api */
const mapsApi = api.maps
/****** 搜素区域 */

const loading = ref(false)
const query: Query = ref({ map: id, name })
/****** 表格区域 */
const user = store.user
const upgradeModal = ref()
const beforeHandler = () => {
  if(user.isRegisterUser()) {
    upgradeModal.value.show()
    return true
  }
  return false
}
const router = useRouter()
const columns = [
  { title: '地图版本ID', dataIndex: 'id', width: 150 },
  { title: '地图版本', dataIndex: 'mapVersion', width: 90 },
  { title: '地图文件', dataIndex: 'mapFileName', width: 180, ellipsis: true },
  { title: '创建时间', dataIndex: 'importTime', width: 150 },
  { title: '创建者', dataIndex: 'importUserName', width: 150, ellipsis: true  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 160,
    actions: {
      查看: (data: any) => router.push('/map-manage/version-edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/map-manage/version-edit/' + data.id),
      编辑地图: {
        beforeHandler,
        handler: (data: any) => gotoVnc({
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
        () => vncModal.value.show())
      },
      下载: (data: any) => {
        downloadModal.sourceData = data.id
        downloadModal.visible = true
        downloadModal.fileName = data.mapName + '_' + data.mapVersion
      },
      删除: async ({ id }: { id: string }) => await mapsApi.deleteMapVersion(id)
    }
  }
]

const submitting = ref(false)
const downloadModal = reactive({
  sourceData: '',
  fileName: '',
  visible: false,
})
const onConfirmDownload = async () => {
  try {
    submitting.value = true
    const { success, file } = await mapsApi.download({ version_id: downloadModal.sourceData })
    if(success) {
      download(file, downloadModal.fileName + '.zip')
      message.success('下载成功')
      downloadModal.visible = false
    }
  } finally {
    submitting.value = false
  }
}

const table = ref()
onMounted(()=> table.value.refresh())
</script>
