<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <page-title title="算法列表">
      <batch-button :disabled="!selectedRows.length" v-if="user.hasPermission('delete')" :api="batchDelete"></batch-button>
      <a-button type="primary" :disabled="selectedRows.length" v-if="user.hasPermission('add')" @click="router.push('/kpi/edit/0')">创建评测指标</a-button>
    </page-title>

    <Table 
      ref="tableRef"
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns" 
      :scroll="{ x: 1000, y: 'auto' }"
      :isOnlyCreator="true"
      @select="onSelect">
    </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.kpi

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入评测指标名称' },
  {
    label: '类别',
    key: 'category',
    type: 'tree-select',
    checkLeaf: false,
    api: currentApi.getTypes,
    fieldNames: { label: 'title', value: 'id' },
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query = ref<Query>({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 60, validator: (data: RObject) => data.custom == 0 }, 
  { title: '评测指标ID', dataIndex: 'id', width: 120 },
  { title: '评测指标名称', dataIndex: 'name', ellipsis: true },
  { title: '指标类型', dataIndex: 'category_name', width: 180 },
  { title: '创建时间', dataIndex: 'create_date', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 120 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: RObject) => router.push('/kpi/view/' + data.id),
      编辑: {
        validator: (data: RObject) => data.custom != 0,  // 内置指标不可编辑
        handler: (data: RObject) => router.push('/kpi/edit/' + data.id)
      },
      删除: {
        validator: (data: RObject) => data.custom !== 0,  // 内置指标不可删除
        handler: async ({ id }: RObject) => await currentApi.delete(id)
      }
    }
  }
]

const tableRef = ref()
const selectedRows = ref([])
const onSelect = (keys: any) => (selectedRows.value = keys)
const batchDelete = async () => {
  await currentApi.batchDelete({ kpi_id: selectedRows.value })
  tableRef.value.refresh()
}
</script>
