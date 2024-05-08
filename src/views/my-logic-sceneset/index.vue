<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="title-section">
      <span class="title">逻辑场景集列表</span>
      <div>
        <batch-button :disabled="!checkedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="gotoSubPage('/edit/0')">创建场景集</a-button>
      </div>
    </div>
    <div>
      <Table :query="query" :columns="columns" :api="currentApi.getList" :fieldNames="{ label: 'groupName', value: 'id' }"
        :scroll="{ x: 1500, y: 'auto' }" @select="onSelect" >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex == 'count'">
              <a @click="gotoSubPage('/scene/?pid=' + record.id)">{{ record.count }}</a>
          </template>
        </template>
      </Table>
    </div>
  </div>

  <a-modal v-model:visible="modal.cloneVisible" title="复制场景集"
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
import { SceneSourceOptions, getSceneSourceName } from '@/utils/dict'
import { gotoSubPage } from '@/utils/tools'

/****** api */
const user = store.user
const currentApi = api.scenesets

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集ID或名称' },
  {
    label: '来源',
    key: 'source',
    type: 'select',
    options: SceneSourceOptions,
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
  }])
const query = ref({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const modal = reactive({
  cloneVisible: false,
  sourceData: {} as RObject,
  cloneName: '' // 另存为的名字
})
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景集ID', dataIndex: 'id', width: 150 },
  { title: '场景集名称', dataIndex: 'groupName', ellipsis: true },
  { title: '场景集标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '来源', dataIndex: 'adsSource', formatter: getSceneSourceName, width: 180 },
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
        handler: ({ id }: RObject) => router.push('/my-logic-sceneset/view/' + id)
      },
      编辑: {
        handler: ({ id }: RObject) => router.push('/my-logic-sceneset/edit/' + id)
      },
      复制: (data: RObject) => {
        modal.cloneVisible = true
        modal.sourceData = data
      },
      删除: {
        tip: '场景集删除后，场景集内场景也会被删除，你确定要删除场景集吗？',
        handler: async ({ id }: { id: string }) => await currentApi.delete(id)
      }
    }
  }
]

const cloneForm = ref()
const submitting = ref(false)
const onConfirmClone = async () => {
  cloneForm.value.validate().then(() => {
    try {
      submitting.value = true
      // const { id, groupName } = modal.sourceData
      // const { code, message } = await currentApi.clone(id, modal.cloneName)
      // if (code === 200) {
      //   message.success('复制成功')
      //   modal.cloneVisible = false
      //   modal.cloneName = ''
      // } else {
      //   message.error(message)
      // }
    } finally {
      submitting.value = false
    }
  })
}
const tableRef = ref()
const checkedItems = ref([])
const onSelect = (data: any) => (checkedItems.value = data)
const onBatchDelete = async () => {
  // await currentApi.batchDelete({ scenes_id: checkedItems.value })
  tableRef.value.refresh({ deletedRows: checkedItems.value.length })
}
</script>
