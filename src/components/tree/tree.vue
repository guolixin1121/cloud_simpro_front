<template>
  <div class="left-tree-wrapper">
    <vxe-table
      border="none"
      ref="table"
      :show-header="false"
      :row-config="{isHover: true, keyField: 'id'}"
      :tree-config="{transform: true, reserve: true, lazy: lazy, loadMethod: loadMethod}"
      :loading="loading"
      :data="tableData"
      @toggle-tree-expand="onTreeExpand"
      @cell-click="onCellClick">
      <vxe-column tree-node>
        <template #default="{row}">
          <div style="white-space: nowrap;">
            <svg-icon icon="folder" class="mr-1" v-if="!row.isLeaf"></svg-icon>
            <span v-if="row.id == selectNode?.id" class="text-blue">{{ row[treeNode] }}</span>
            <span v-else>{{ row[treeNode] }}</span>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
import 'vxe-table/lib/style.css'
import { VxeTable, VxeColumn } from 'vxe-table'
import { useSessionStorage } from '@vueuse/core';
import { isEmpty } from '@/utils/tools';

const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object
  },
  treeNode: {
    type: String,
    default: () => 'name'
  },
  lazy: {
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['select'])

const routeName = useRoute().path.replaceAll('/', '')
const expandRowKeys = useSessionStorage<number[]>(routeName + ': tree', [])
const table = ref()
const loading = ref(false)
const tableData = ref([])
const page = reactive({
  size: 10,
  current: 1,
  total: 0
})
const refresh = async () => {
  loading.value = true
  try {
    tableData.value = []
    const data = await fetchTableData()
    page.total = data.total
    tableData.value = data.data

    const { query, lazy } = props
    if(!lazy ) {
      // 获取当前搜索节点的所有父节点展开
      if(query?.name) {
        const current: any = tableData.value.find(((item: any) => item.name == query.name))
        current && setParentExpand(current.parentId)
      }
    }

    table.value?.setTreeExpand(expandRowKeys.value, true)
  } finally {
    loading.value = false
  }
}
const fetchTableData = async (params: any = {}) => {
  const results = { total: 0, data: []}
  const { query, lazy } = props
  const res = await props.api({
    ...query, 
    ...params,
    page: page.current, 
    size: page.size
  } )
  results.total = res.count
  results.data = (res.results || res).map((item: any) => ({ ...item, hasChild: !item.isLeaf}))
  results.data = lazy ? results.data : transformTreeToArray(results.data)

  return results
}

// 数据转换成一维数组，组件的渲染性能高
const transformTreeToArray = (data: any[], parentId: string | number = '') => {
 let results: any = []
 if(!isEmpty(data)) {
   data.forEach((item: RObject) => {
     const itemObj = {...item}
     if(!itemObj.parentId) {
       itemObj.parentId = parentId
     }
     if(!itemObj.id) {
       itemObj.id = '-1'
     }
     const children = transformTreeToArray(itemObj.children, itemObj.id)
     results.push(itemObj)
     results.push(...children)
   })
 }
 return results
}

const setParentExpand = (parentId: String | Number) => {
   const parent: any = tableData.value.find((item: any) => item.id == parentId)
   if(parent) {
    expandRowKeys.value.push(parent)
    setParentExpand(parent.parentId)
   }
}

const loadMethod = async ({ row }: any) => {
  const data = await fetchTableData({ parent: row.id })
  return Promise.resolve(data.data)
}

const onTreeExpand = () => {
  expandRowKeys.value = table.value.getTreeExpandRecords()
}

const selectNode = ref(props.query)
const onCellClick = ({ row, $event }: any) => {
  // 叶子节点和展开收起图标，不做处理
  if($event.target.nodeName == 'I') return
  if(row.isLeaf) {
    selectNode.value = row
    emits('select', row)
  } else {
    const expanded = expandRowKeys.value?.findIndex((item: any) => item.id == row.id) > -1
    table.value.setTreeExpand(row, !expanded)
    expandRowKeys.value = table.value.getTreeExpandRecords()
  }
}

watch(
  () => props.query,
  () => refresh(),
  { deep: true }
)
refresh()
</script>

<style lang="less">
// .left-tree-wrapper {
//   :deep(.vxe-table .vxe-tree-cell)
//    { 
//     // .vxe-body--column {
//     //   background-image: none
//     // }
//   }
// }
</style>