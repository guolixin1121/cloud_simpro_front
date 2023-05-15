<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">场景集管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/sceneset/edit/0')">创建场景集</a-button>
    </div>

    <Table :api="scenesetApi" :query="query" :columns="columns" :scroll="{ y: 'auto' }" :pagination="false">
    </Table>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.scenesets
const scenesetApi = (args: object) => currentApi.getList({ ...args })
const tagsApi = (args: object) => api.tags.getList({ tag_type: 2, ...args })

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: tagsApi,
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: ['']
  }
])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景集名称', dataIndex: 'name', width: 200, ellipsis: true },
  // { title: '标签', dataIndex: 'labels_detail', ellipsis: true },
  // { title: '路径', dataIndex: 'path', width: 200, ellipsis: true },
  { title: '场景数量', dataIndex: 'count', width: 100 },
  // { title: '创建时间', dataIndex: 'create_time', width: 180 },
  // {
  //   title: '操作',
  //   dataIndex: 'actions',
  //   fixed: 'right',
  //   width: 100,
  //   actions: {
  //     查看: {
  //       validate: (data: RObject) => data.isLeaf === 1,
  //       handler: (data: any) => router.push('/sceneset/view/' + data.id)
  //     },
  //     编辑: {
  //       validate: (data: RObject) => data.isLeaf === 1,
  //       handler: (data: any) => router.push('/sceneset/edit/' + data.id),
  //     },
  //     删除: async ({ id }: { id: string }) => await currentApi.delete(id)
  //   }
  // }
]
</script>
