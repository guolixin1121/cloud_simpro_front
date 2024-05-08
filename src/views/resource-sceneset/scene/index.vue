<template>
  <div class="breadcrumb">
    <router-link to="/my-sceneset/">具体场景</router-link>
    <span class="breadcrumb--current">{{ selectedSceneset?.name }}</span>
  </div>

  <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">场景列表</span>
      <div>
        <a-button type="primary" :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" @click="modal.visible = true">申请授权</a-button>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
        <a-button type="primary" :disabled="checkedItems.length > 0" v-if="user.hasPermission('add')"
            @click="gotoSubPage('/edit/0')">上传具体场景</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
    </a-spin>
  </div>

  <VncModal ref="vncModal"></VncModal>

  <a-modal v-model:visible="modal.visible" title="批量申请场景集授权"
    :footer="null" :destroyOnClose="true">
      <a-form ref="modalForm" class="modal-content" :model="modal" 
        :labelCol ="{ style: { width: '100px' } }" 
        style="padding-bottom: 0px"
        @finish="onConfirm">
        <span>已选择{{ checkedItems.length }}个场景集，请填写申请原因：</span>
        <a-form-item label="" name="reason"
          :rules="[{ required: true, message: '请输入申请原因'} ]">
          <ch-input type="textarea" v-model:value="modal.reason" 
            :maxlength="255" placeholder="请输入申请原因" rows="4"></ch-input>
        </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="modal.visible = false">取消</a-button>
        <a-button @click="onConfirm" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
import { gotoSubPage } from '@/utils/tools'

const vncModal = ref()
const currentApi = api.scene
const user = store.user
const selectedSceneset = ref() // 逻辑场景跳转的默认场景集

const loadSceneset = async () => {
  const scenesetId = useRoute().query.pid
  if (scenesetId) {
    const data = await api.scenesets.get(scenesetId)
    selectedSceneset.value = data
    store.catalog.sceneCatalog = data
    query.value = { scene_set: data.id}
  }
}
loadSceneset()

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入具体场景ID或名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'tree-select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tree: 1, tag_type: 3, size: 100 }, // tree无法分页，一次性获取所有
    placeholder: '请选择标签，最多选择9个',
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: [''],
    multiple: true
  },
  // { label: '创建时间', key: 'create_time', type: 'range-picker' }
])

const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const sceneCatalog = selectedSceneset.value
  query.value = { ...data, scene_set: sceneCatalog?.id }
}

/****** 表格区域 */
const loading = ref(false)
const modal = reactive({
  visible: false,
  reason: ''
})
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 120 },
  { title: '场景名称', dataIndex: 'adsName', width: 200, ellipsis: true },
  { title: '场景标签', dataIndex: 'labels_detail', apiField: 'display_name',width: 250, ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 300,
    actions: {
      申请授权: (data: any) => gotoSubPage('/apply/' + data.id),
      查看: (data: any) => gotoSubPage('/view/' + data.id),
      编辑: (data: any) => gotoSubPage('/edit/' + data.id),
      编辑场景: (data: any) => gotoVnc({ action: 1, value: data.id }, loading, null, () => vncModal.value.show()),
      场景预览: (data: any) => gotoSubPage('/preview/' + data.id),
      删除: {
        tip: '场景删除后不可恢复，您确定要删除场景吗？',
        handler: async ({ id }: { id: string }) => await currentApi.delete(id)
      }
    }
  }
]

const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  await currentApi.batchDelete({ scenes_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}

const cloneForm = ref()
const submitting = ref(false)
const onConfirm = async () => {
  cloneForm.value.validate().then(() => {
    try {
      submitting.value = true
    } finally {
      submitting.value = false
    }
  })
}
</script>
