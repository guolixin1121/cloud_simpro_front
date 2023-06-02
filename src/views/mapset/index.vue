<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main" style="height: calc(100% - 100px)">
    <div class="flex justify-between items-center">
      <span class="title">地图集管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/mapset/edit/0')">创建地图集</a-button>
    </div>
   
    <div style="height: calc(100% - 50px);" class="mt-4 overflow-auto">
      <vxe-table
        stripe
        height="100%"
        :row-config="{isHover: true}"
        :tree-config="{transform: true}"
        :expand-config="{ expandAll: true }"
        :loading="loading"
        :data="tableData">
        <vxe-column
          v-for="column in columns"
          :key="column.dataIndex"
          :field="column.dataIndex"
          :title="column.title"
          :tree-node="column.dataIndex === 'name'">
        </vxe-column>
        <vxe-column title="类型">
          <template #default="{ row }">
            <span>{{ row.isLeaf ? '地图集' : '地图目录'}}</span>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="150">
          <template #default="{ row }">
            <a class="text-blue mr-2" @click="onView(row)">查看</a>
            <a class="text-blue mr-2" @click="onEdit(row)">编辑</a>
            <a-popconfirm
              title="你确定要删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="onDelete(row)"
            >
              <a class="text-blue mr-2">删除</a>
            </a-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vxe-table/lib/style.css'
import { VxeTable, VxeColumn } from 'vxe-table'
import { isEmpty } from '@/utils/tools'

/****** api */
const user = store.user
const currentApi = api.mapsets
const listApi = (args: object) => currentApi.getList({tree: 1, ...args })
const tagsApi = (args: object) => api.tags.getList({ tag_type: 2, ...args })

/****** 搜素区域 */
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
const query = ref({})
const onSearch = (params: RObject) => query.value = params
watch(query, () => fetchTableData(query.value))

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '地图集名称', dataIndex: 'name', ellipsis: true }
]

const onDelete = async (row: RObject) => {
   await currentApi.delete(row.id)
   fetchTableData()
}
const onView = ({id, name} : RObject) => router.push('/mapset/view/' + id + '/?name=' + name)
const onEdit = ({id, name} : RObject) => router.push('/mapset/edit/' + id + '/?name=' + name)

const loading = ref(false)
const tableData = ref([])
const fetchTableData = async (params: any = {}) => {
  loading.value = true
  const res = await listApi(params)
  tableData.value = transformTreeToArray(res.results)
  loading.value = false
}
const transformTreeToArray = (data: []) => {
  let results: any = []
  if(!isEmpty(data)) {
    data.forEach((item: RObject) => {
      const itemObj = {...item}
      const children = transformTreeToArray(item.children)
      delete itemObj.children
      results.push(item)
      results.push(...children)
    })
  }
  return results
}

fetchTableData()
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
