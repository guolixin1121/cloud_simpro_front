<template>
  <div class="breadcrumb">
    <router-link to="/resource-sceneset/">具体场景</router-link>
    <span>{{ selectedSceneset?.name }}</span>
  </div>
  <a-spin :spinning="loading">
    <sceneset :sceneset="selectedSceneset"></sceneset>
  </a-spin>
  <search-form v-model:items="formItems" :manual="true" @search="onTableSearch"></search-form>
  <div class="main">
    <div class="title-section">
      <span class="title">具体场景列表</span>
      <div>
        <batch-button v-if="user.isAdminProject() && user.hasPermission('delete')" :disabled="!checkedItems.length"
         :tips="'已勾选' + checkedItems.length+ '个场景，是否删除所有勾选场景？'"
         :api="onBatchDelete"></batch-button>
        <a-button v-if="user.hasPermission('apply')" :disabled="!checkedItems.length" @click="modal.visible = true">申请授权</a-button>
        <a-button v-if="user.isAdminProject() && user.hasPermission('add') && selectedSceneset?.add_enable"  type="primary" :disabled="checkedItems.length > 0"
            @click="gotoSubPage('/edit/0')">上传具体场景</a-button>
      </div>
    </div>
    <Table ref="tableRef" :api="currentApi.getSceneList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
  </div>

  <a-modal v-model:visible="modal.visible" title="批量申请场景授权"
    :footer="null" :destroyOnClose="true">
      <a-form ref="modalForm" class="modal-content" :model="modal" 
        :labelCol ="{ style: { width: '100px' } }" 
        style="padding-bottom: 0px"
        @finish="onBatchApply">
        <span>已选择{{ checkedItems.length }}个场景，请填写申请原因：</span>
        <a-form-item label="" name="reason" style="margin-top: 8px">
          <ch-input type="textarea" v-model:value="modal.reason" 
            :maxlength="255" placeholder="请输入申请原因" rows="4"></ch-input>
        </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="modal.visible = false">取消</a-button>
        <a-button @click="onBatchApply" :loading="submitting" type="primary">申请</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { gotoSubPage } from '@/utils/tools'

const currentApi = api.sceneResource
const user = store.user
const selectedSceneset = ref() // 逻辑场景跳转的默认场景集

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景ID或名称', defaultValue: '' },
  {
    label: '标签',
    key: 'labels',
    type: 'tree-select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tree: 1, tag_type: 3, size: 100 }, // tree无法分页，一次性获取所有
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: [''],
    multiple: true
  },
])

const loading = ref(false)
const loadSceneset = async () => {
  const scenesetId = useRoute().query.pid
  if (scenesetId) {
    try {
      loading.value = true
      const data = await api.sceneResource.getSceneset(scenesetId)
      selectedSceneset.value = data
      store.catalog.sceneCatalog = data
      query.value = { 
        scene_set: data.id,
        name: formItems.value[0].cachedValue,
        labels: formItems.value[1].cachedValue,
      }
    } finally {
      loading.value = false
    }
  }
}
loadSceneset()

const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const sceneCatalog = selectedSceneset.value
  query.value = { ...data, scene_set: sceneCatalog?.id }
}

/****** 表格区域 */
const modal = reactive({
  visible: false,
  reason: ''
})
const columns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: any) => data.delete_enable },
  { title: '场景ID', dataIndex: 'id', width: 120 },
  { title: '场景名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '场景标签', dataIndex: 'labels_detail', apiField: 'display_name',width: 250, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      // 申请授权: {
      //   validator: (data: any) => data.apply_enable,
      //   handler: (data: any) => gotoSubPage('/apply/' + data.id)
      // },
      查看: (data: any) => gotoSubPage('/preview/' + data.id),
      编辑: {
        validator: (data: any) => user.isAdminProject() && data.edit_enable,
        handler: (data: any) => gotoSubPage('/edit/' + data.id)
      },
      删除: {
        tip: '场景删除后不可恢复，是否删除？',
        validator: (data: any) => user.isAdminProject() && data.delete_enable,
        handler: async ({ id }: { id: string }) => await currentApi.deleteScene({id: [id] })
      },
    }
  }
]

const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  await currentApi.deleteScene({ id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}

const modalForm = ref()
const submitting = ref(false)
const onBatchApply = () => {
  modalForm.value.validate().then(async () => {
    try {
      submitting.value = true
      await api.grant.apply({
        id: checkedItems.value,
        type: 4,
        reason: modal.reason
      })
      message.success('任务已提交，请前往授权任务管理查看任务状态。')
      modal.visible = false
      tableRef.value.refresh({ deletedRows: checkedItems.value.length })
    } finally {
      submitting.value = false
    }
  })
}
</script>
