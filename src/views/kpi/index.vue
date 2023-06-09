<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">评测指标管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/kpi/edit/0')">创建评测指标</a-button>
    </div>

    <Table :api="currentApi.getList" :query="query" 
      :columns="columns" :scroll="{ x: 1100, y: 'auto' }"
      :isOnlyCreator="true"> </Table>
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
  { title: '评测指标ID', dataIndex: 'id', width: 120 },
  { title: '评测指标名称', dataIndex: 'name', ellipsis: true },
  { title: '指标类型', dataIndex: 'category_name', width: 150 },
  { title: '创建时间', dataIndex: 'create_date', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 100 },
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
</script>
