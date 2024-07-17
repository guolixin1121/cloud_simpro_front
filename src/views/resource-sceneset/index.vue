<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">具体场景集列表</span>
      <div>
        <template v-if="isAdmin">
          <batch-button :disabled="!checkedItems.length" :api="onBatchDelete"
            :tips="'已勾选' + checkedItems.length+ '个场景集，是否删除所有勾选场景集及其关联数据？'"></batch-button>
          <a-button type="primary" @click="gotoSubPage('/edit/0')">创建场景集</a-button>
        </template>
        <a-button v-else :disabled="!checkedItems.length" @click="modal.visible = true">申请授权</a-button>
        <a-button type="primary" @click="gotoSubPage('/apply-manage/')">授权任务管理</a-button>
      </div>
    </div>
    <div>
      <Table ref='tableRef' :query="query" :columns="columns" :api="currentApi.getScenesetList"
        :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" >
      </Table>
    </div>
  </div>

  <a-modal v-model:visible="modal.visible" title="批量申请场景集授权"
    :footer="null" :destroyOnClose="true">
      <a-form ref="modalForm" class="modal-content" :model="modal" 
        :labelCol ="{ style: { width: '100px' } }" 
        style="padding-bottom: 0px"
        @finish="onBatchApply">
        <span>已选择{{ checkedItems.length }}个场景集，请填写申请原因：</span>
        <a-form-item label="" name="reason" style="margin-top: 8px">
          <ch-input type="textarea" v-model:value="modal.reason" 
            :maxlength="255" placeholder="请输入申请原因" rows="5"></ch-input>
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

/****** api */
const user = store.user
const isAdmin = user.isAdmin()
const currentApi = api.sceneResource

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称' },
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

/****** 表格区域 */
const modal = reactive({
  visible: false,
  reason: '' // 另存为的名字
})
const columns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: any) => isAdmin ? data.delete_enable : data.apply_enable },
  { title: '场景集ID', dataIndex: 'id', width: 150 },
  { title: '场景集名称', dataIndex: 'name', ellipsis: true },
  { title: '场景集标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '场景数量', dataIndex: 'scene_count', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      申请授权: {
        validator: (data : RObject) => !isAdmin && data.apply_enable,
        handler: ({ id }: RObject) => gotoSubPage('/apply/' + id)
      },
      查看: {
        handler: ({ id }: RObject) => gotoSubPage('/scene/?pid=' + id)
      },
      编辑: {
        validator: (data : RObject) => isAdmin && data.edit_enable,
        handler: ({ id }: RObject) => gotoSubPage('/edit/' + id)
      },
      删除: {
        tip: '场景集删除后，关联数据（场景、地图）将会一起删除，是否删除？',
        validator: (data : RObject) => isAdmin && data.delete_enable,
        handler: async ({ id }: { id: string }) => await currentApi.deleteSceneset({id: [id]})
      },
    }
  }
]

const modalForm = ref()
const submitting = ref(false)
const onBatchApply = () => {
  modalForm.value.validate().then(async () => {
    try {
      submitting.value = true
      await api.grant.apply({
        id: checkedItems.value,
        type: 3,
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
const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  await currentApi.deleteSceneset({ id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
</script>
