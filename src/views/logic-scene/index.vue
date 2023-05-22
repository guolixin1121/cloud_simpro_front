<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">逻辑场景管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/logic-scene/edit/0')">上传逻辑场景</a-button>
    </div>

    <Table :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1100, y: 'auto' }" />
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.logicScene
const tagsApi = (args: object) => api.tags.getList({ tag_type: 3, ...args })

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入逻辑场景名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: tagsApi,
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: ['']
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '逻辑场景名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '关联场景数', dataIndex: 'count', width: 150, ellipsis: true },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name' },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      运行: (data: any) => router.push('/scene/view/' + data.id),
      查看: (data: any) => router.push('/scene/view/' + data.id),
      编辑: (data: any) => router.push('/scene/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
</script>
