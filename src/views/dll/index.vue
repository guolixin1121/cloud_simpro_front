<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">动力学动态库列表</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/dll/edit/0')">创建动态库</a-button>
    </div>
    <Table :api="dllApi.getList" :query="query" 
      :columns="columns" :scroll="{ x: 1000, y: 'auto' }"
      :isOnlyCreator="true"> </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const dllApi = api.dll
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入动态库名称或所属用户' },
  { label: '修改时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => {
  query.value = data
}
/****** 表格区域 */
const router = useRouter()
// const preRoute = router.currentRoute.value.path
const columns = [
  { title: '动态库ID', dataIndex: 'id', width: 150 },
  { title: '动态库名称', dataIndex: 'name' },
  { title: '描述', dataIndex: 'desc' },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 130 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/dll/view/' + data.id),
      编辑: (data: any) => router.push('/dll/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await dllApi.delete(id)
    }
  }
]
</script>
