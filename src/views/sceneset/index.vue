<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main" style="height: calc(100% - 80px)">
    <div class="flex justify-between items-center">
      <span class="title">场景集列表</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/sceneset/edit/0')">创建场景集</a-button>
    </div>
    <div style="height: calc(100% - 50px)" class="mt-4 overflow-auto">
      <tree-table tree-node="groupName" :lazy="true" :query="query" :columns="columns" :api="currentApi.getList" :fieldNames="{ label: 'groupName', value: 'id' }">
        <template #default="{ column, row }">
          <template v-if="column.dataIndex == 'isLeaf'">
            {{ row.isLeaf ? '场景集' : '场景目录' }}
          </template>
        </template>
      </tree-table>
      <!-- <tree-table
        :query="query"
        :columns="columns"
        :api="currentApi.getList"
        >
        <template #default="{ column, row }">
          <template v-if="column.dataIndex == 'isLeaf'">
            {{ row.isLeaf ? '场景集' : '场景目录' }}
          </template>
        </template>
      </tree-table> -->
    </div>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.scenesets
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([{ label: '名称', key: 'name', type: 'input', placeholder: '请输入场景集名称' }])
const query = ref({})
// const onSearch = (params: RObject) => query.value = { ...params }
const onSearch = (params: RObject) => (query.value = { ...params, version: 2 })

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景集名称', dataIndex: 'groupName', ellipsis: true },
  // { title: '路径', dataIndex: 'path', ellipsis: true },
  // { title: '场景数量', dataIndex: 'count', width: 150 },
  { title: '类型', dataIndex: 'isLeaf', width: 150 },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 150,
    actions: {
      查看: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({ id }: RObject) => router.push('/sceneset/view/' + id)
      },
      编辑: {
        validator: ({ isLeaf }: any) => isLeaf == 1,
        handler: ({ id }: RObject) => router.push('/sceneset/edit/' + id)
      },
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
</script>
