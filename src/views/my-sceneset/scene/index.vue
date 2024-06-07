<template>
  <div class="breadcrumb">
    <span>场景管理</span>
    <span>我的场景</span>
    <router-link to="/my-sceneset/">具体场景</router-link>
    <span>{{ selectedSceneset?.name }}</span>
  </div>

  <sceneset :sceneset="selectedSceneset"></sceneset>

  <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>
  <div class="main">
    <div class="title-section">
      <span class="title">具体场景列表</span>
      <div>
        <a-button :disabled="!checkedItems.length" v-if="user.hasPermission('add')" @click="onBatchClone()">另存为</a-button>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"
           :tips="'您已勾选' + checkedItems.length+ '个场景，确定要删除所有勾选的场景吗？'"></batch-button>
        <a-button type="primary" :disabled="checkedItems.length > 0" v-if="user.hasPermission('add') && selectedSceneset?.isEditable"
            @click="gotoSubPage('/edit/')">上传具体场景</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
    </a-spin>
  </div>

  <VncModal ref="vncModal"></VncModal>

  <a-modal v-model:visible="cloneModal.cloneVisible" :title="cloneModal.title"
    :footer="null" :destroyOnClose="true">
      <div class="modal-content">
        <p><span v-if="cloneModal.desc">{{cloneModal.desc}}</span>请选择场景的保存路径</p>
        <select-sceneset ref="cloneSceneset" v-model:value="cloneModal.targetSceneset"></select-sceneset>
      </div>
      <div class="modal-buttons">
        <a-button @click="cloneModal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmClone" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { MySceneSourceOptions, isMyScenesetEditable, isMySceneEditable, getMySceneSourceName, getMyScenesetSourceName } from '@/utils/dict'
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
import { gotoSubPage, openLink } from '@/utils/tools'

const vncModal = ref()
const currentApi = api.scene
const user = store.user
const selectedSceneset = ref() 
const scenesetId = useRoute().query.pid

const loadSceneset = async () => {
  if (scenesetId) {
    const data = await api.scenesets.get(scenesetId)
    selectedSceneset.value = data
    selectedSceneset.value.isEditable = isMyScenesetEditable(data.source)
    selectedSceneset.value.sourceName = getMyScenesetSourceName(data.source)
    store.catalog.sceneCatalog = data
    query.value = { scene_set: data.id}
  }
}
loadSceneset()

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入具体场景ID或名称' },
  {
    label: '来源',
    key: 'adsSource',
    type: 'select',
    options: MySceneSourceOptions,
    placeholder: '请选择场景来源',
    defaultValue: ''
  },
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
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])

const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const sceneCatalog = selectedSceneset.value
  query.value = { ...data, scene_set: sceneCatalog?.id }
}

/****** 表格区域 */
const loading = ref(false)
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 120 },
  { title: '场景名称', dataIndex: 'adsName', width: 200, ellipsis: true },
  { title: '场景标签', dataIndex: 'labels_detail', apiField: 'display_name',width: 250, ellipsis: true },
  { title: '来源', dataIndex: 'adsSource', formatter: getMySceneSourceName, width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 250,
    actions: {
      查看: (data: any) => gotoSubPage('/view/' + data.id),
      场景预览: (data: any) => openLink('/scene-simulation-client/#/overview/?type=2&id=' + data.id),
      编辑: { 
        validator: ({status}: any) => isMySceneEditable(status),
        handler: (data: any) => gotoSubPage('/edit/' + data.id)
      },
      编辑场景: {
        validator: ({status}: any) => isMySceneEditable(status),
        handler: (data: any) => gotoVnc({ action: 1, value: data.id }, loading, null, () => vncModal.value.show()),
      },
      另存为: (data: any) => {
        cloneModal.title = '另存为'
        cloneModal.desc = ''
        cloneModal.sourceData = [data.id]
        cloneModal.cloneVisible = true
      },
      删除: {
        handler: async ({ id }: { id: string }) => await currentApi.delete(id)
      }
    }
  }
]

const cloneSceneset = ref()
const cloneModal = reactive({
  title: '',
  desc: '',
  cloneVisible: false,
  sourceData: {},
  targetSceneset: { sceneset: '', scenesetType: 1 } // 另存为的场景
})
const submitting = ref(false)
const onConfirmClone = () => {
  cloneSceneset.value.validate().then(async () => {
    try {
      submitting.value = true
      const { sceneset, scenesetType } = cloneModal.targetSceneset
      const params = scenesetType == 1 ? { scene_set_name: sceneset} : { scene_set_id: sceneset }

      await currentApi.clone({
        id: cloneModal.sourceData,
        ...params
      })
      message.success('已另存')
      cloneModal.cloneVisible = false
      tableRef.value.refresh()
    } finally {
      submitting.value = false
    }
  })
}

// 批量另存为
const onBatchClone = () => {
  cloneModal.title = '批量另存为'
  cloneModal.desc = '您已选择' + checkedItems.value.length + '个场景，'
  cloneModal.cloneVisible = true
  cloneModal.sourceData = checkedItems.value
}

// 批量删除
const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  await currentApi.batchDelete({ scenes_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}

</script>