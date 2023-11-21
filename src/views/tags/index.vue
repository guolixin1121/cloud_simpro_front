<template>
  <search-form :items="formItems" @search="onSearch"></search-form>
  <div class="main" style="height: calc(100% - 80px)">
    <div class="flex justify-between items-center">
      <span class="title">标签列表</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/tags/edit/0?tag_type=' + query.tag_type)">创建标签</a-button>
    </div>

    <div class="mt-4 overflow-auto">
      <tree-table :query="query" :columns="columns" :api="currentApi.getList" :tree-node="'display_name'">
        <template #default="{ column, row }">
          <template v-if="column.dataIndex == 'isTag'">
            {{ row.isTag ? '标签' : '标签目录' }}
          </template>
        </template>
      </tree-table>
    </div>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.tags

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入标签名称' },
  {
    label: '标签类型',
    key: 'tag_type',
    type: 'select',
    allowClear: false,
    api: () => currentApi.getType({ tree: 1 }),
    fieldNames: { label: 'value', value: 'key' },
    defaultValue: 2
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query = ref<any>({})
const onSearch = (params: RObject) => {
  query.value = { ...params, tree: 1 }
}

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '标签名称', dataIndex: 'display_name' },
  { title: '标签英文名称', dataIndex: 'name' },
  { title: '标签类别', dataIndex: 'isTag', width: 100 },
  { title: '创建时间', dataIndex: 'create_time', width: 200 },
  { title: '所属用户', dataIndex: 'create_user', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    actions: {
      查看: ({ id }: RObject) => router.push('/tags/view/' + id),
      编辑: ({ id }: RObject) => router.push('/tags/edit/' + id + '?tag_type=' + query.value.tag_type),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
</script>
