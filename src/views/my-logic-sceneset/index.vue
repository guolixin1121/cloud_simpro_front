<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">逻辑场景集列表</span>
      <div>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"
          :tips="'您已勾选' + checkedItems.length+ '个场景集，确定要删除所有勾选的场景集吗？'"></batch-button>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="gotoSubPage('/edit/0')">创建场景集</a-button>
      </div>
    </div>
    <div>
      <Table ref="tableRef" :query="query" :columns="columns" :api="currentApi.getList" :fieldNames="{ label: 'groupName', value: 'id' }"
        :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'count'">
              <a class="text-blue inline-block w-full" @click="gotoSubPage('/scene/?pid=' + record.id)">{{ record.count }}</a>
          </template>
        </template>
      </Table>
    </div>
  </div>

  <a-modal v-model:visible="modal.cloneVisible" title="场景集另存为"
    :footer="null" :destroyOnClose="true">
      <a-form ref="cloneForm" class="modal-content" :model="modal" 
        :labelCol ="{ style: { width: '100px' } }" 
        style="padding-bottom: 0px"
        @finish="onConfirmClone">
        <a-form-item label="场景集名称" name="cloneName" 
          :rules="[{ required: true, message: '请输入场景集名称'} ]">
          <ch-input v-model:value="modal.cloneName" :maxlength="50" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
      </a-form>
      <div class="modal-buttons">
        <a-button @click="modal.cloneVisible = false">取消</a-button>
        <a-button @click="onConfirmClone" :loading="submitting" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
import { MyLogicSceneSourceOptions, IsMyLogicScenesetFromResource, getMyLogicScenesetSourceName } from '@/utils/dict'
import { gotoSubPage } from '@/utils/tools'

/****** api */
const user = store.user
const currentApi = api.logicScenesets

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称' },
  {
    label: '来源',
    key: 'source',
    type: 'select',
    options: MyLogicSceneSourceOptions,
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
    placeholder: '请选择标签，最多选择9个',
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: [''],
    multiple: true
  }])
const query = ref({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const modal = reactive({
  cloneVisible: false,
  sourceData: {} as RObject,
  cloneName: '' // 另存为的名字
})
const columns = [
  { dataIndex: 'checkbox', width: 60,validator: (data: any) => data.name !== 'SOTIF', },
  { title: '场景集ID', dataIndex: 'id', width: 150 },
  { title: '场景集名称', dataIndex: 'name', ellipsis: true },
  { title: '场景集标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'source', formatter: getMyLogicScenesetSourceName, width: 180 },
  { title: '场景数量', dataIndex: 'count', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200,
    actions: {
      查看: {
        handler: ({ id }: RObject) => gotoSubPage('/view/' + id)
      },
      编辑: {
        validator: ({source}: RObject) => !IsMyLogicScenesetFromResource(source),
        handler: ({ id }: RObject) => gotoSubPage('/edit/' + id)
      },
      另存为: (data: RObject) => {
        modal.cloneVisible = true
        modal.sourceData = data
        modal.cloneName = ''
      },
      删除: {
        validator: (data: any) => data.name !== 'SOTIF',
        tip: '场景集删除后，场景集内场景也会被删除，你确定要删除场景集吗？',
        handler: async ({ id }: { id: string }) => await currentApi.delete({id: [id]})
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
        logic_scene_set_id: modal.sourceData.id
      })
      message.success('已另存')
      modal.cloneVisible = false
      tableRef.value.refresh()
    } finally {
      submitting.value = false
    }
  })
}
const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  await currentApi.delete({ id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
</script>
