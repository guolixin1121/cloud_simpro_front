<template>
  <div class="main-tree">
    <tree ref="scenesetTreeRef" :title="'场景集'" :api="scenesetApi" :lazy="true" 
      :filedNames="{ label: 'groupName', value: 'id' }" :button-handlers="treeBtnHandlers" 
      :default-value="selectedSceneset" @select="onTreeSelect" />
    <div class="main-right table-container">
      <a-spin :spinning="scenesetLoading">
        <sceneset :sceneset="selectedSceneset"></sceneset>
      </a-spin>
      <search-form class="scene-form" v-model:items="formItems" :colsPerline="3" :manual="true" @search="onTableSearch" @show-more="onTableSearch"></search-form>
      <div class="main">
        <div class="title-section">
          <span class="title">具体场景列表</span>
          <div>
            <a-button v-if="user.hasPermission('add')"
              :disabled="!checkedItems.length"  @click="onBatchClone()">另存为</a-button>
            <batch-button v-if="user.hasPermission('delete')" 
              :disabled="!checkedItems.length" :api="onBatchDelete"
              :tips="'已勾选' + checkedItems.length+ '个场景，是否删除所有勾选场景？'"></batch-button>
            <a-button v-if="user.hasPermission('add') && selectedSceneset?.isEditable"
              type="primary" :disabled="checkedItems.length > 0"
              @click="gotoSubPage('/scene/edit/')">上传具体场景</a-button>
          </div>
        </div>
        <a-spin :spinning="loading">
          <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
        </a-spin>
      </div>
    </div>
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
  <a-modal v-model:visible="scenesetModal.cloneVisible" title="另存为"
    :footer="null" :destroyOnClose="true">
      <a-form ref="scenesetCloneForm" class="modal-content" :model="scenesetModal" 
        :labelCol ="{ style: { width: '100px' } }" 
        @finish="onConfirmCloneSceneset">
          <a-form-item name="cloneName" style="width: 74%"
            :rules="[{ required: true, message: '请输入另存为场景集名称'},
            { validator: () => checkChName(scenesetModal.cloneName, 160) } ]">
            <span class="mr-2">我的场景-具体场景</span>
            <ch-input v-model:value="scenesetModal.cloneName" :maxlength="160" placeholder="请输入另存为场景集名称"></ch-input>
          </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="scenesetModal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmCloneSceneset" :loading="scenesetSubmitting" type="primary">确定</a-button>
      </div>
  </a-modal>
  <upgrade ref="upgradeModal" module="simulationManage"></upgrade>
</template>

<script setup lang="ts">
import { MySceneSourceOptions, isDefaultMySceneset, isMyScenesetEditable, isMySceneEditable, getMySceneSourceName, getMyScenesetSourceName } from '@/utils/dict'
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
import { gotoSubPage, checkChName } from '@/utils/tools'

const loading = ref(false)
const vncModal = ref()
const currentApi = api.scene
const user = store.user
const selectedSceneset = ref() 
const scenesetApi = api.scenesets.getListV2

const onTreeSelect = (sceneset: any) => {
  if(sceneset.id == selectedSceneset.value?.id) return

  query.value = { ...query.value, page: 1 } // 切换到第一页
  selectedSceneset.value = sceneset
  loadSceneset(sceneset.id)
}

const router = useRouter()
const scenesetLoading = ref(false)
const loadSceneset = async (scenesetId: string) => {
  if (scenesetId) {
    try {
      scenesetLoading.value = true
      const data = await api.scenesets.get(scenesetId)
      selectedSceneset.value = data
      selectedSceneset.value.isEditable = isMyScenesetEditable(data)
      selectedSceneset.value.sourceName = getMyScenesetSourceName(data.source)
      store.catalog.sceneCatalog = data
      query.value = { 
        ...query.value,
        scene_set: data.id
      }
    } finally {
      scenesetLoading.value = false
    }
  }
}

const scenesetIdFromResource = useRoute().query.id as string
if(scenesetIdFromResource) {
  loadSceneset(scenesetIdFromResource)
}

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景ID或名称' },
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
const upgradeModal = ref()
const beforeHandler = () => {
  if(user.isRegisterUser()) {
    upgradeModal.value.show()
    return true
  }
  return false
}
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 120 },
  { title: '场景名称', dataIndex: 'adsName', width: 200, ellipsis: true },
  { title: '场景标签', dataIndex: 'labels_detail', apiField: 'display_name',width: 250, ellipsis: true },
  { title: '来源', dataIndex: 'adsSource', formatter: getMySceneSourceName, width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  { title: '创建者', dataIndex: 'createUser', width: 180, ellipsis: true  },
  { title: '修改者', dataIndex: 'updateUser', width: 180, ellipsis: true  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 250,
    actions: {
      查看: (data: any) => gotoSubPage('/scene/preview/' + data.id),
      编辑: { 
        validator: ({adsSource}: any) => isMySceneEditable(adsSource),
        handler: (data: any) => gotoSubPage('/scene/edit/' + data.id)
      },
      编辑场景: {
        beforeHandler,
        validator: ({adsSource}: any) => isMySceneEditable(adsSource),
        handler: (data: any) => gotoVnc({ action: 1, value: data.id }, loading, null, () => vncModal.value.show()),
      },
      另存为: (data: any) => {
        cloneModal.title = '另存为'
        cloneModal.desc = ''
        cloneModal.sourceData = [data.id]
        cloneModal.cloneVisible = true
      },
      删除: {
        tip: '场景删除后不可恢复，是否删除？',
        // validator: ({create_user}: any) => user.user.username == create_user,
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
      scenesetTreeRef.value.refresh()
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

// 场景集操作
const scenesetModal = reactive({
  cloneVisible: false,
  sourceData: {} as RObject,
  cloneName: '' // 另存为的名字
})
const scenesetTreeRef = ref()
const scenesetCloneForm = ref()
const scenesetSubmitting = ref(false)
const onConfirmCloneSceneset = () => {
  scenesetCloneForm.value.validate().then(async () => {
    try {
      scenesetSubmitting.value = true
      await api.scenesets.clone({
        name: scenesetModal.cloneName,
        id: scenesetModal.sourceData.id
      })
      scenesetModal.cloneVisible = false
      message.success('已另存')
      scenesetTreeRef.value.refresh()
    } finally {
      scenesetSubmitting.value = false
    }
  })
}
const treeBtnHandlers = {
  add: () => router.push('/my-sceneset/edit'),
  edit: {
    validator: (data: any) => isMyScenesetEditable(data),
    handler: (data: any) => router.push('/my-sceneset/edit/' + data.id)
  },
  saveAs: (data: RObject) => {
    scenesetModal.cloneVisible = true
    scenesetModal.sourceData = data
    scenesetModal.cloneName = ''
  },
  delete: {
    validator: (data: any) => !isDefaultMySceneset(data),
    handler: api.scenesets.delete
  }
}
</script>

<style lang="less">
.scene-form {
  .ant-row:not(.last-row) {
    .ant-form-item-label {
      width: 40px !important;
    }
  }
  .ant-row:first-child .ant-form-item-label {
    width: 65px !important;
  }
}
</style>