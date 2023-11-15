<template>
  <div class="main">
    <div class="breadcrumb">
      <router-link to="/veticle-model/">动力学模型</router-link>
      <!-- <a>地图管理</a> -->
      <span class="breadcrumb--current">模型版本</span>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="title mr-4">模型版本列表</span>
      </div>
      <div>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="() => showCreateModel = true">创建版本</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <Table ref="table" :api="currentApi.getVersions" :query="query" :columns="columns" :scroll="{ x: 1000, y: 'auto' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'mapType'">
            {{  record }}
            <!-- <a-tooltip :title="type[record.mapType]">
              {{ type[record.mapType] }}
            </a-tooltip> -->
          </template>
        </template>
      </Table>
    </a-spin>
  </div>
  <a-modal v-model:visible="showCreateModel" 
      title="创建新版本"
      :footer="null">
        <div class="modal-content">
          <div class="flex items-center">
            <svg-icon style="color: #faad14" icon="alert"></svg-icon>
            <span class="modal-title">是否创建新版本？</span>
          </div>
        </div>
        <div class="modal-buttons" style="border-top: 1px solid #f0f0f0">
          <a-button @click="showCreateModel = false" class="marginR-16">取消</a-button>
          <a-button @click="confirmAdd" :loading="isCreating" type="primary">确定</a-button>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
const { id } = useRoute().params
/****** api */
const currentApi = api.veticleModel
const user = store.user
/****** 搜素区域 */

const loading = ref(false)
const query: Query = ref({ dynamic_model_id: id })
/****** 表格区域 */
const columns = [
  { title: '模型版本ID', dataIndex: 'vehicle_no', width: 200 },
  { title: '模型版本', dataIndex: 'full_version', width: 90 },
  { title: '创建时间', dataIndex: 'create_date', width: 150 },
  { title: '创建者', dataIndex: 'username', width: 100 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => gotoVeticlePro(data.id, '?type=look'),
      编辑: (data: any) => gotoVeticlePro(data.id, '?type=edit'),
      删除: async ({ id }: { id: string }) => await currentApi.deleteVersion(id)
    }
  }
]

const gotoVeticlePro = (id: string | number, params?: string) => {
  const modelWindow =  window.open('/vehicle_front/model/carBody/' + id + params)
  const timer = setInterval(() => {
    if(modelWindow?.closed) {
      clearInterval(timer)
      table?.value.refresh()
    }
  }, 500)
}
const table = ref()
onMounted(()=> table.value.refresh())

// model
const showCreateModel = ref(false)
const isCreating = ref(false)
const confirmAdd = async () => {
  try {
    isCreating.value = true
    const res = await currentApi.addVersion({ dynamic_model_id: id })
    gotoVeticlePro(res.id, '?type=add')
    showCreateModel.value = false
  } finally {
    isCreating.value = false
  }
}
</script>
