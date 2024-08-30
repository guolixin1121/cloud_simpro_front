<template>
  <div class="main-tree">
    <tree ref="scenesetTreeRef" :title="'场景集'" :api="scenesetApi" :lazy="true" :button-handlers="treeBtnHandlers" 
      @select="onTreeSelect" />
    <div class="main-right table-container">
      <a-spin  :spinning="loadingSceneset">
        <sceneset :sceneset="selectedSceneset"></sceneset>
      </a-spin>
      <search-form class="scene-form" :colsPerline="3" :manual="true" v-model:items="formItems" @search="onSearch"></search-form>

      <div class="main">
        <page-title title="逻辑场景列表">
          <a-button :disabled="!selectedItems.length" v-if="user.hasPermission('saveAs')" @click="onBatchClone()">另存为</a-button>
          <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"
            :tips="'已勾选' + selectedItems.length+ '个场景，是否删除所有勾选场景？'"></batch-button>
          <a-button type="primary" :disabled="selectedItems.length > 0" v-if="user.hasPermission('add') && selectedSceneset?.isEditable" @click="gotoSubPage('/scene/edit/0')">上传逻辑场景</a-button>
        </page-title>

        <Table 
          ref="tableRef" 
          :api="currentApi.getList" 
          :query="query" 
          :columns="columns" 
          :scroll="{ x: 1300, y: 'auto' }"
          @select="onSelect">
        </Table>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="generateModal.visible" title="泛化" 
      :footer="null"  :destroyOnClose="true">
      <template v-if="generateModal.step == 1">
        <template v-if="generateModal.sourceData.config_result_count <= 10000">
          <div class="modal-content">
              是否要对此逻辑场景进行泛化？泛化结果为{{ generateModal.sourceData.config_result_count }}个具体场景。
          </div>
          <div class="modal-buttons">
            <a-button @click="closeRunConfirm">取消</a-button>
            <a-button @click="generateModal.step = 2" :loading="isSubmitting" type="primary">下一步</a-button>
          </div>
        </template>
        <template v-else>
          <div class="modal-content">
            <svg-icon style="color: #faad14" icon="alert"></svg-icon>
            <span class="modal-title">泛化数量超过上限（10000）</span>
          </div>
          <div class="modal-buttons">
              <a-button @click="closeRunConfirm">关闭</a-button>
            </div>
        </template>
      </template>
      <template v-else>
        <div class="modal-content">
          <p>请选择泛化生成的具体场景的保存路径</p>
          <select-sceneset ref="generateSceneset" v-model:value="generateModal.targetSceneset"></select-sceneset>
        </div>
        <div class="modal-buttons">
            <a-button @click="generateModal.step = 1">上一步</a-button>
            <a-button @click="runConfirm" :loading="isSubmitting" type="primary">确定</a-button>
          </div>
      </template>
  </a-modal>

  <a-modal v-model:visible="cloneModal.cloneVisible" :title="cloneModal.title"
    :footer="null" :destroyOnClose="true">
      <div class="modal-content">
        <p><span v-if="cloneModal.desc">{{ cloneModal.desc }}</span>请选择场景的保存路径</p>
        <select-sceneset ref="cloneSceneset" :isLogicSceneset="true" v-model:value="cloneModal.targetSceneset"></select-sceneset>
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
          :rules="[{ required: true, message: '请输入场景集名称'},
          { validator: () => checkChName(scenesetModal.cloneName, 160)  }
           ]">
          <span class="mr-2">我的场景-逻辑场景</span>
          <ch-input v-model:value="scenesetModal.cloneName" :maxlength="50" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="scenesetModal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmCloneSceneset" :loading="scenesetSubmitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { gotoSubPage, checkChName } from '@/utils/tools'
import { MyLogicSceneSourceOptions, isMyLogicSceneEditable, isMyLogicScenesetEditable, getMyLogicSceneSourceName, getMyLogicScenesetSourceName, isDefaultMyLogicSceneset } from '@/utils/dict'

const user = store.user
const currentApi = api.logicScene
const selectedSceneset = ref() 
const scenesetApi = api.logicScenesets.getList

const onTreeSelect = (sceneset: any) => {
  if(sceneset.id == selectedSceneset.value?.id) return

  query.value = { ...query.value, page: 1 } // 切换到第一页
  selectedSceneset.value = sceneset
  loadSceneset(sceneset.id)
}

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景ID或名称' },
  {
    label: '来源',
    key: 'source',
    type: 'select',
    options: MyLogicSceneSourceOptions,
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

const loadingSceneset = ref(false)
const loadSceneset = async (scenesetId: string) => {
  if (scenesetId) {
    try {
      loadingSceneset.value = true
      const data = await api.logicScenesets.get(scenesetId)
      selectedSceneset.value = data
      selectedSceneset.value.sourceName = getMyLogicScenesetSourceName(data.source)
      selectedSceneset.value.isEditable = isMyLogicScenesetEditable(data.source)
      store.catalog.sceneCatalog = data
      query.value = { 
        ...query.value,
        logic_scene_set_id: data.id
      }
      
    } finally {
      loadingSceneset.value = false
    }
  }
}
const query: Query = ref({})
const onSearch = (data: Query) => (query.value = { ...data, logic_scene_set_id: selectedSceneset.value.id })

/****** 表格区域 */
const tableRef = ref()
const generateModal = reactive({
  visible: false,
  step: 1,
  targetSceneset: { sceneset: '', scenesetType: 1 }, // 另存为的场景
  sourceData: { logic_scene_version_id: '', config_result_count: 0 }
}) // 泛化
const cloneModal = reactive({
  title: '',
  desc: '',
  cloneVisible: false,
  sourceData: [{id: ''}],
  targetSceneset: { sceneset: '', scenesetType: 1 } // 另存为的场景
})
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '场景名称', dataIndex: 'name', width: 250, ellipsis: true },
  { title: '关联场景数', dataIndex: 'result_scene_count', width: 150 },
  { title: '场景标签', dataIndex: 'labels_detail', width: 200,  apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'source', width: 120, formatter: getMyLogicSceneSourceName },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '创建者', dataIndex: 'create_user', width: 180, ellipsis: true  },
  { title: '修改者', dataIndex: 'update_user', width: 180, ellipsis: true  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 300,
    actions: {
      查看: (data: any) => gotoSubPage('/scene/view/' + data.id),
      泛化: {
        validator: ({ source }: any) => source !== 1,
        handler: (data: any) => {
          generateModal.visible = true
          generateModal.sourceData = data
      }},
      泛化结果: {
        validator: ({ source }: any) => source !== 1,
        handler: (data: any) => gotoSubPage('/scene/result/' + data.id +'?name=' + data.name)
      },
      编辑: {
        validator:  ({source}: any) => isMyLogicSceneEditable(source),
        handler: (data: any) => gotoSubPage('/scene/edit/' + data.id)
      },
      另存为: (data: any) => {
        cloneModal.title = '另存为'
        cloneModal.desc = ''
        cloneModal.sourceData = [data.id]
        cloneModal.cloneVisible = true
      },
      删除: {
        tip: '场景删除后不可恢复，是否删除？',
        // validator: ({createUser}: any) => user.user.username == createUser,
        handler: async ({ id }: { id: string }) => await currentApi.delete(id)
      }
    }
  }
]

// 泛化
const generateSceneset = ref()
const isSubmitting = ref(false)
const closeRunConfirm = () => generateModal.visible = false
const runConfirm = () => {
  generateSceneset.value.validate().then(async () => {
    try {
      isSubmitting.value = true
      const { sceneset, scenesetType } = generateModal.targetSceneset
      const params = scenesetType == 1 ? { result_scene_set_name: sceneset } 
          : { result_scene_set_id: sceneset }
        
      await currentApi.run({
        source: 0,
        ...params,
        data: [{
          logic_scene_version_id: generateModal.sourceData.logic_scene_version_id
      }]})
      closeRunConfirm()
      tableRef.value.refresh()
      message.success('泛化成功')
    } finally {
      isSubmitting.value = false
    }
  })
}

// 另存为
const cloneSceneset = ref()
const submitting = ref(false)
const onConfirmClone = () => {
  cloneSceneset.value.validate().then(async() => {
    try {
      submitting.value = true
    
      const { sceneset, scenesetType } = cloneModal.targetSceneset
      const params = scenesetType == 1 ? { logic_scene_set_name: sceneset} 
        : { logic_scene_set_id: sceneset }
      await currentApi.clone({
        logic_scene_ids: cloneModal.sourceData,
        ...params
      })
      message.success('已另存')
      cloneModal.cloneVisible = false
      scenesetTreeRef.value.refresh()
    } finally {
      submitting.value = false
    }
  })
}

// 批量另存为
const onBatchClone = () => {
  cloneModal.title = '批量另存为'
  cloneModal.desc = '您已选择' + selectedItems.value.length + '个场景，'
  cloneModal.cloneVisible = true
  cloneModal.sourceData = selectedItems.value
  scenesetTreeRef.value.refresh()
}

// 批量删除
const selectedItems = ref([])
const onSelect = (data: any) => selectedItems.value = data
const onBatchDelete = async () => {
  await currentApi.batchDelete({logic_scene_ids: selectedItems.value})
  tableRef.value.refresh({ deletedRows: selectedItems.value.length })
}

// 场景集
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
      await api.logicScenesets.clone({
        name: scenesetModal.cloneName,
        logic_scene_set_id: scenesetModal.sourceData.id
      })
      message.success('已另存')
      scenesetModal.cloneVisible = false
      scenesetTreeRef.value.refresh()
    } finally {
      scenesetSubmitting.value = false
    }
  })
}
const router = useRouter()
const treeBtnHandlers = {
  add: () => router.push('/my-logic-sceneset/edit/0'),
  edit: {
    validator: (data: any) => isMyLogicScenesetEditable(data.source),
    handler: (data: any) => router.push('/my-logic-sceneset/edit/' + data.id)
  },
  saveAs: (data: RObject) => {
    scenesetModal.cloneVisible = true
    scenesetModal.sourceData = data
    scenesetModal.cloneName = ''
  },
  delete: {
    validator: (data: any) => !isDefaultMyLogicSceneset(data),
    handler: async (id: String) => await api.logicScenesets.delete({id: [id]})
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