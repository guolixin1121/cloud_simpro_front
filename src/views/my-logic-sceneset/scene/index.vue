<template>
  <div class="breadcrumb">
    <span>我的场景</span>
    <a @click="goback()">逻辑场景</a>
    <span>场景集{{ selectedSceneset?.name }}</span>
  </div>

  <search-form class="reactive-form" :manual="true" :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <page-title title="逻辑场景列表">
      <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete" label="复制"></batch-button>
      <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
      <a-button type="primary" :disabled="selectedItems.length > 0" v-if="user.hasPermission('add')" @click="gotoSubPage('/edit/0')">上传逻辑场景</a-button>
    </page-title>

    <Table 
      ref="tableRef" 
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns" 
      :scroll="{ x: 1300, y: 'auto' }"
      @select="onSelect">
    </Table>

    <a-modal v-model:visible="generateModal.visible"
      title="泛化" :footer="null">
      <template v-if="generateModal.step == 1">
        <template v-if="generateModal.sceneset.config_result_count <= 10000">
          <div class="modal-content">
            <div class="flex items-center">
              <svg-icon style="color: #faad14; width: 16px;" icon="alert"></svg-icon>
              <span class="modal-title">是否要对此逻辑场景进行泛化？</span>
            </div>
            <p class="description">泛化结果为{{ generateModal.sceneset.config_result_count }}个具体场景</p>
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
          <a-radio-group v-model:value="generateModal.save_path_type" name="radioGroup">
            <a-radio value="1">新建场景集</a-radio>
            <a-radio value="2">已有场景集</a-radio>
          </a-radio-group>
          <a-form ref="modalForm" :model="generateModal" style="margin-top: 16px;"
            :labelCol ="{ style: { width: '140px' } }" @finish="runConfirm">
            <a-form-item label="我的场景-具体场景" name="targetSceneset" 
              :rules="[{ required: true, message: '请选择已有场景集'} ]" v-if="generateModal.save_path_type == '1'">
              <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
                :fieldNames="{ label: 'groupName', value: 'id' }" placeholder="请选择已有场景集">
              </scroll-select>
            </a-form-item>
            <a-form-item label="我的场景-具体场景" name="targetSceneset" 
              :rules="[{ required: true, message: '请输入场景集名称'} ]" v-else>
              <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
                :fieldNames="{ label: 'groupName', value: 'id' }" placeholder="请输入场景集名称">
              </scroll-select>
            </a-form-item>
          </a-form>
        </div>
        <div class="modal-buttons">
            <a-button @click="generateModal.step = 1">上一步</a-button>
            <a-button @click="runConfirm" :loading="isSubmitting" type="primary">确定</a-button>
          </div>
      </template>
    </a-modal>

    <a-modal v-model:visible="modal.cloneVisible" title="场景另存为"
    :footer="null" :destroyOnClose="true">
      <div class="modal-content">
        <p>请选择场景的保存路径</p>
        <a-radio-group v-model:value="modal.scenesetType" name="radioGroup">
            <a-radio :value="1">新建场景集</a-radio>
            <a-radio :value="2">已有场景集</a-radio>
        </a-radio-group>
        <a-form ref="modalForm" :model="modal" style="margin-top: 16px;"
            :labelCol ="{ style: { width: '140px' } }">
            <a-form-item label="我的场景-具体场景" name="targetSceneset" 
                :rules="[{ required: true, message: '请选择已有场景集'} ]" v-if="modal.scenesetType == 1">
                <ch-input v-model:value="modal.targetSceneset" placeholder="请输入场景集名称"></ch-input>
            </a-form-item>
            <a-form-item label="我的场景-具体场景" name="targetSceneset" 
                :rules="[{ required: true, message: '请输入场景集名称'} ]" v-else>
                <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" placeholder="请选择场景集名称"></scroll-select>
            </a-form-item>
        </a-form>
      </div>
      <div class="modal-buttons">
        <a-button @click="modal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmClone" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
  </div>
</template>

<script setup lang="ts">
import { gotoSubPage, goback } from '@/utils/tools'

const user = store.user
const currentApi = api.logicScene
const scenesetApi = (arg: any) => api.logicScenesets.getList({...arg, source: 0})

const selectedSceneset = ref() 
const loadSceneset = async () => {
  const scenesetId = useRoute().query.pid
  if (scenesetId) {
    const data = await api.logicScenesets.get(scenesetId)
    selectedSceneset.value = data
    store.catalog.sceneCatalog = data
    query.value = { logic_scene_set_id: data.id}
  }
}
loadSceneset()

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入逻辑场景ID或名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'tree-select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tree: 1, tag_type: 3, size: 100 },// tree无法分页，一次性获取所有
    fieldNames: { label: 'display_name', value: 'name' },
    placeholder: '请选择标签，最多选择9个',
    defaultValue: ['']
  },
  {
    label: '来源',
    key: 'source',
    type: 'select',
    options: [{ label: '全部', value: ''}, { label: '云平台', value: 0}, { label: 'SOTIF', value: 1 }],
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])

const query: Query = ref({})
const onSearch = (data: Query) => (query.value = { ...data })

/****** 表格区域 */
const tableRef = ref()
const generateModal = reactive({
  visible: false,
  save_path_type: '1',
  step: 1,
  sceneset: { logic_scene_version_id: '', config_result_count: 0 }
}) // 泛化
const modal = reactive({
  cloneVisible: false,
  sourceData: {},
  scenesetType: 1, // 1: 新建， 2: 已有
  targetSceneset: '' // 另存为的场景集
})
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '场景名称', dataIndex: 'name', width: 250, ellipsis: true },
  { title: '关联场景数', dataIndex: 'result_scene_count', width: 150 },
  { title: '场景标签', dataIndex: 'labels_detail', width: 200,  apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'source', width: 120, formatter: (source: number) => source == 0 ? '云平台' : 'SOTIF' },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 280,
    actions: {
      泛化: (data: any) => {
        generateModal.visible = true
        generateModal.sceneset = data
      },
      泛化结果: (data: any) => gotoSubPage('/result/' + data.id +'?name=' + data.name),
      查看: (data: any) => gotoSubPage('/view/' + data.id),
      编辑: (data: any) => gotoSubPage('/edit/' + data.id),
      复制: (data: any) => {
        modal.sourceData = data
        modal.targetSceneset = ''
        modal.cloneVisible = true
      },
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
const isSubmitting = ref(false)
const closeRunConfirm = () => generateModal.visible = false
const runConfirm = async () => {
  try {
    isSubmitting.value = true
    await currentApi.run({
      source: 0,
      data: [{
        logic_scene_version_id: generateModal.sceneset.logic_scene_version_id
    }]})
    closeRunConfirm()
    tableRef.value.refresh()
  } finally {
    isSubmitting.value = false
  }
}

// table checkbox
const selectedItems = ref([])
const onSelect = (data: any) => selectedItems.value = data
const onBatchDelete = async () => {
  await currentApi.batchDelete({logic_scene_ids: selectedItems.value})
  tableRef.value.refresh({ deletedRows: selectedItems.value.length })
}


const cloneForm = ref()
const submitting = ref(false)
const onConfirmClone = async () => {
  cloneForm.value.validate().then(() => {
    try {
      submitting.value = true
    } finally {
      submitting.value = false
    }
  })
}
</script>
