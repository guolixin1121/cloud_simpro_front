<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">具体场景集列表</span>
      <div>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"
          :tips="'已勾选' + checkedItems.length+ '个场景集，是否删除所有勾选场景集及其关联数据？'"></batch-button>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="gotoSubPage('/edit/')">创建场景集</a-button>
      </div>
    </div>
    <div>
      <Table ref="tableRef" :query="query" :columns="columns" :api="listApi"
        :scroll="{ x: 1800, y: 'auto' }" @select="onSelect" >
      </Table>
    </div>
  </div>

  <a-modal v-model:visible="modal.cloneVisible" title="另存为"
    :footer="null" :destroyOnClose="true">
      <a-form ref="cloneForm" class="modal-content" :model="modal" 
        :labelCol ="{ style: { width: '100px' } }" 
        style="padding-bottom: 0px"
        @finish="onConfirmClone">
          <a-form-item name="cloneName" style="width: 74%"
            :rules="[{ required: true, message: '请输入另存为场景集名称'},
            { validator: () => checkChName(modal.cloneName, 160) } ]">
            <span>我的场景-具体场景</span>
            <ch-input v-model:value="modal.cloneName" :maxlength="160" placeholder="请输入另存为场景集名称"></ch-input>
          </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="modal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmClone" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { MyScenesetSourceOptions, isMyScenesetEditable, getMyScenesetSourceName, isMyScenesetBuildin } from '@/utils/dict'
import { gotoSubPage, checkChName } from '@/utils/tools'

/****** api */
const user = store.user
const currentApi = api.scenesets
const listApi = api.scenesets.getListV2

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称', defaultValue: useRoute().query.name || '' },
  {
    label: '来源',
    key: 'source',
    type: 'select',
    options: MyScenesetSourceOptions,
    placeholder: '请选择场景来源',
    defaultValue: ''
  },
  {
    label: '标签',
    key: 'labels',
    type: 'tree-select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tree: 1, tag_type: 2, size: 100 }, // tree无法分页，一次性获取所有
    placeholder: '请选择标签',
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: [''],
    multiple: true
  }])
const query = ref({})
const onSearch = (data: Query) => (query.value = data)

const modal = reactive({
  cloneVisible: false,
  sourceData: {} as RObject,
  cloneName: '' // 另存为的名字
})

// 判断是否为旧的场景集，不可被删除和编辑
const columns = [
  { 
    dataIndex: 'checkbox', width: 60,
    validator: (data: any) => !isMyScenesetBuildin(data),
   },
  { title: '场景集ID', dataIndex: 'id', width: 120 },
  { title: '场景集名称', dataIndex: 'groupName', ellipsis: true },
  { title: '场景集标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'source', formatter: getMyScenesetSourceName, width: 150 },
  { title: '场景数量', dataIndex: 'count', width: 120 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '创建者', dataIndex: 'create_user', width: 200, ellipsis: true },
  { title: '修改者', dataIndex: 'update_user', width: 200, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200,
    actions: {
      查看: {
        handler: ({ id }: RObject) => gotoSubPage('/scene/?pid=' + id)
      },
      编辑: {
        validator: (data: any) => isMyScenesetEditable(data),
        handler: ({ id }: RObject) => gotoSubPage('/edit/' + id)
      },
      另存为: (data: RObject) => {
        modal.cloneVisible = true
        modal.sourceData = data
        modal.cloneName = ''
      },
      删除: {
        tip: "场景集删除后，关联数据（场景、地图）将会一起删除，是否删除？",
        validator: (data: any) => !isMyScenesetBuildin(data),
        handler: async ({ id }: { id: string }) => await currentApi.delete(id)
      }
    }
  }
]

const cloneForm = ref()
const submitting = ref(false)
const onConfirmClone = () => {
  cloneForm.value.validate().then(async () => {
    try {
      submitting.value = true

      await currentApi.clone({
        name: modal.cloneName,
        id: modal.sourceData.id
      })
      modal.cloneVisible = false
      tableRef.value.refresh()
    } finally {
      submitting.value = false
    }
  })
}
const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => checkedItems.value = data

const onBatchDelete = async () => {
  await currentApi.batchDelete({ scene_set_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
</script>
