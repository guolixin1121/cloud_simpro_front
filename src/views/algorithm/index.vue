<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>
  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">算法管理</span>
    </div>
    <Table :api="algorithmApi.getList" :query="query" :columns="columns" :scroll="{ x: 1200 }"> </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const algorithmApi = api.algorithm
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([{ label: '算法名称', key: 'name', type: 'input', placeholder: '请输入算法名称或ID' }])
const onSearch = (data: Query) => (query.value = data)
/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '算法ID', dataIndex: 'id', width: 80 },
  { title: '算法名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '算法版本', dataIndex: 'version', width: 80, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 100, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 40,
    actions: {
      查看: (data: any) => router.push('/algorithm/edit/' + data.id)
    }
  }
]
</script>
