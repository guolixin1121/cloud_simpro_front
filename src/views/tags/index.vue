<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main" style="height: calc(100% - 100px)">
    <div class="flex justify-between items-center">
      <span class="title">标签管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/tags/edit/0')">创建标签</a-button>
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
          :width="column.width"
          :tree-node="column.dataIndex === 'display_name'">
        </vxe-column>
        <vxe-column title="类型">
          <template #default="{ row }">
            <span>{{ row.isTag ? '标签' : '标签目录'}}</span>
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
const currentApi = api.tags
const listApi = (args: object) => currentApi.getList({tree: 1, ...args })

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入标签名称' },
  {
    label: '标签类型',
    key: 'tag_type',
    type: 'select',
    api: () => currentApi.getType({ tree: 1 }),
    fieldNames: { label: 'value', value: 'key' },
    defaultValue: 2
  },
])
const query = ref({})
const onSearch = (params: RObject) => query.value = params
watch(query, () => fetchTableData(query.value))

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '标签名称', dataIndex: 'display_name' },
  { title: '标签英文名称', dataIndex: 'name'},
  { title: '创建时间', dataIndex: 'create_time', width: 200 },
  { title: '修改时间', dataIndex: 'update_time', width: 200 }
]

const onDelete = async (row: RObject) => {
   await currentApi.delete(row.id)
   fetchTableData(query.value)
}
const onView = ({id} : RObject) => router.push('/tags/view/' + id)
const onEdit = ({id} : RObject) => router.push('/tags/edit/' + id)

const loading = ref(false)
const tableData = ref([])
const fetchTableData = async (params: any = {}) => {
  loading.value = true
  try {
  const res = await listApi(params)
  tableData.value = transformTreeToArray(res)
  } finally {
    loading.value = false
  }
}

const transformTreeToArray = (data: [], parentId = '-1') => {
  let results: any = []
  if(!isEmpty(data)) {
    data.forEach((item: RObject) => {
      const children = transformTreeToArray(item.children, item.id)
      results.push({ ...item, parentId })
      results.push(...children)
    })
  }
  return results
}

// fetchTableData()
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
