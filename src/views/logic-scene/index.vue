<template>
  <search-form class="reactive-form" :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <page-title title="逻辑场景列表">
      <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
      <a-button type="primary" :disabled="selectedItems.length > 0" v-if="user.hasPermission('add')" @click="router.push('/logic-scene/edit/0')">上传逻辑场景</a-button>
    </page-title>

    <Table 
      ref="tableRef" 
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns" 
      :scroll="{ x: 1300, y: 'auto' }"
      @select="onSelect">
    </Table>

    <a-modal v-model:visible="showRunConfirm" 
      :closable="false"
      :footer="null">
        <template v-if="runScene.config_result_count <= 10000">
          <div class="modal-content">
            <div>
              <svg-icon style="color: #faad14; width: 16px;" icon="alert"></svg-icon>
              <span class="modal-title">是否要对此逻辑场景进行泛化？</span>
            </div>
            <p class="description">泛化结果为{{ runScene.config_result_count }}个具体场景</p>
          </div>
          <div class="modal-buttons">
            <a-button @click="closeRunConfirm" class="marginR-16">取消</a-button>
            <a-button @click="runConfirm" :loading="isSubmitting" type="primary">确定</a-button>
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
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { SStorage } from '@/utils/storage'

const user = store.user
const currentApi = api.logicScene

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入逻辑场景名称' },
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
const showRunConfirm = ref(false)
const runScene = ref<any>() // 要运行的数据
const tableRef = ref()
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '逻辑场景名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '关联场景数', dataIndex: 'result_scene_count', width: 120 },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'source', width: 100, formatter: (source: number) => source == 0 ? '云平台' : 'SOTIF' },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 250,
    actions: {
      泛化: (data: any) => {
        showRunConfirm.value = true
        runScene.value = data
      },
      泛化结果: (data: any) => {
        const versionUrlPath = '/logic-scene/result/' + data.id
        SStorage.remove(versionUrlPath + ':table-page')
        router.push('/logic-scene/result/' + data.id +'?name=' + data.name)
      },
      查看: (data: any) => router.push('/logic-scene/view/' + data.id),
      编辑: (data: any) => router.push('/logic-scene/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
const isSubmitting = ref(false)
const closeRunConfirm = () => showRunConfirm.value = false
const runConfirm = async () => {
  try {
    isSubmitting.value = true
    await currentApi.run({
      source: 0,
      data: [{
        logic_scene_version_id: runScene.value.logic_scene_version_id
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
</script>
