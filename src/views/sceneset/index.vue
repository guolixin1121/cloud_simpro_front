<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main" style="height: calc(100% - 100px)">
    <div class="flex justify-between items-center">
      <span class="title">场景集管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/sceneset/edit/0')">创建场景集</a-button>
    </div>
    <div style="height: calc(100% - 50px);" class="mt-4 overflow-auto">
      <tree-table
        :query="query"
        :columns="columns"
        :api="scenesetApi"
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
const currentApi = api.scenesets
const scenesetApi = (args: object) => currentApi.getList({tree: 1, ...args })

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集名称' }
])
const query = ref({})
const onSearch = (params: RObject) => query.value = params
// watch(query, () => { query.value = query })

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景集名称', dataIndex: 'name', ellipsis: true },
  { title: '路径', dataIndex: 'path', ellipsis: true },
  { title: '场景数量', dataIndex: 'count', width: 150 },
  { title: '类型', dataIndex: 'isLeaf', width: 150 },
  { title: '操作', dataIndex: 'operation', width: 150,
    actions: {
      查看: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({id} : RObject) => router.push('/sceneset/view/' + id)
      } ,
      编辑: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({id} : RObject) => router.push('/sceneset/edit/' + id)
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
