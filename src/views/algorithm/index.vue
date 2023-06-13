<template>
  <search-form :items="formItems" @search="onSearch"></search-form>
  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">算法管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/algorithm/edit/0')">创建算法</a-button>
    </div>
    <Table :api="algorithmApi.getList" :query="query" :columns="columns" :scroll="{ x: 1000, y: 'auto' }"> </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const algorithmApi = api.algorithm
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([{ label: '算法名称', key: 'name', type: 'input', placeholder: '请输入算法名称' }])
const query: Query = ref({})
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '算法ID', dataIndex: 'id', width: 80 },
  { title: '算法名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '算法版本', dataIndex: 'version', width: 100, ellipsis: true },
  { title: '描述', dataIndex: 'desc', ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 100, ellipsis: true },
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
</script>
