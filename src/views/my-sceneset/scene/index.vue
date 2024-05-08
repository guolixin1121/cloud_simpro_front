<template>
  <div class="breadcrumb">
    <span>我的场景</span>
    <a @click="goback()">具体场景</a>
    <span>场景集{{ selectedSceneset?.name }}</span>
  </div>

  <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">场景列表</span>
      <div>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('add')" :api="onBatchDelete" label="复制"></batch-button>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
        <a-button type="primary" v-if="user.hasPermission('add')"
            @click="router.push('/my-sceneset/my-scene/edit/0')">大模型生成场景</a-button>
        <a-button type="primary" :disabled="checkedItems.length > 0" v-if="user.hasPermission('add')"
            @click="gotoSubPage('/edit/0')">上传具体场景</a-button>
      </div>
    </div>
    <a-spin :spinning="loading">
      <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" />
    </a-spin>
  </div>

  <VncModal ref="vncModal"></VncModal>

  <a-modal v-model:visible="modal.cloneVisible" title="复制场景"
    :footer="null" :destroyOnClose="true">
      <div class="modal-content">
        <p>请选择泛化生成的具体场景的保存路径</p>
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
                <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
                :fieldNames="{ label: 'groupName', value: 'id' }" placeholder="请输入场景集名称">
                </scroll-select>
            </a-form-item>
        </a-form>
      </div>
      <div class="modal-buttons">
        <a-button @click="modal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmClone" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { MySceneSourceOptions, getMySceneSourceName } from '@/utils/dict'
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
import { gotoSubPage, goback } from '@/utils/tools'

const vncModal = ref()
const currentApi = api.scene
const scenesetApi = api.scenesets.getList
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
const modal = reactive({
  cloneVisible: false,
  sourceData: {},
  scenesetType: 1, // 1: 新建， 2: 已有
  targetSceneset: '' // 另存为的场景集
})
const router = useRouter()
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
    width: 300,
    actions: {
      查看: (data: any) => gotoSubPage('/view/' + data.id),
      编辑: (data: any) => gotoSubPage('/edit/' + data.id),
      编辑场景: (data: any) => gotoVnc({ action: 1, value: data.id }, loading, null, () => vncModal.value.show()),
      场景预览: (data: any) => gotoSubPage('/preview/' + data.id),
      复制: (data: any) => {
        modal.sourceData = data
        modal.targetSceneset = ''
        modal.cloneVisible = true
      },
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
