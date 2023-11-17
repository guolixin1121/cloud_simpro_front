<template>
  <search-form :items="formItems" @search="onSearch"></search-form>
  <div class="main">
    <page-title title="算法列表">
      <batch-button :disabled="!selectedRows.length" v-if="user.hasPermission('delete')" :api="batchDelete"></batch-button>
      <a-button type="primary" :disabled="selectedRows.length > 0"  v-if="user.hasPermission('add')" @click="router.push('/algorithm/edit/0')">创建算法</a-button>
    </page-title>
    <Table 
      ref="tableRef"
      :api="algorithmApi.getList" 
      :query="query" 
      :columns="columns" 
      :scroll="{ x: 1300, y: 'auto' }"
      @select="onSelect">
    </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const algorithmApi = api.algorithm
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入算法名称' },
  { label: '控制在环', key: 'is_in_ring', type: 'select', 
    options: [{ label: '全部' , value: '' }, { label: '是' , value: 1 }, { label: '否', value: 0 }],
    defaultValue: ''
  },
  { label: '创建者', key: 'username', type: 'input', placeholder: '请输入创建者' },
])
const query: Query = ref({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 60 }, 
  { title: '算法ID', dataIndex: 'id', width: 120 },
  { title: '算法名称', dataIndex: 'name', width: 250, ellipsis: true },
  { title: '控制在环', dataIndex: 'is_in_ring', width: 120, formatter: (value: string) => value ? '是' : '否' },
  { title: '感知在环', dataIndex: 'perception', width: 120, formatter: (value: string) => value ? '是' : '否' },
  { title: '描述', dataIndex: 'desc', width: 250, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 200 },
  { title: '创建者', dataIndex: 'create_user', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/algorithm/view/' + data.id),
      编辑: (data: any) => router.push('/algorithm/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await algorithmApi.delete(id)
    }
  }
]

const tableRef = ref()
const selectedRows = ref([])
const onSelect = (keys: any) => (selectedRows.value = keys)
const batchDelete = async () => {
  await algorithmApi.batchDelete({ algorithms: selectedRows.value })
  tableRef.value.refresh({ deletedRows: selectedRows.value.length })
}
</script>
