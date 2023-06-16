<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main" style="height: calc(100% - 80px)">
    <div class="flex justify-between items-center">
      <span class="title">地图集管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/mapset/edit/0')">创建地图集</a-button>
    </div>
   
    <div style="height: calc(100% - 50px);" class="mt-4 overflow-auto">
      <tree-table
        :query="query"
        :columns="columns"
        :api="currentApi.getList"
        >
        <template #default="{ column, row }">
          <template v-if="column.dataIndex == 'isLeaf'">
            {{ row.isLeaf ? '地图集' : '地图目录' }}
          </template>
        </template>
      </tree-table>
    </div>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.mapsets

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入地图集名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tag_type: 2 },
    fieldNames: { label: 'display_name', value: 'name' },
    placeholder: '请选择标签，最多选择9个'
  }
])
const query = ref({})
const onSearch = (params: Query) => query.value = params

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '地图集名称', dataIndex: 'name', ellipsis: true },
  { title: '类型', dataIndex: 'isLeaf', width: 150 },
  { title: '操作', dataIndex: 'operation', width: 150,
    actions: {
      查看: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({id, name} : RObject) => router.push('/mapset/view/' + id + '?name=' + name)
      } ,
      编辑: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({id, name} : RObject) => router.push('/mapset/edit/' + id + '?name=' + name)
      } ,
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
     }
  }
]
</script>

<style scoped>
:deep(.vxe-table--render-default) .vxe-body--row.row--stripe {
  background: #f7f8fa;
}
:deep(.vxe-table--render-default) .vxe-cell--title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85)
}
</style>
