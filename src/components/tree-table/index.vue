<template>
  <vxe-table
   ref="table"
   :border="isTree ? 'none' : 'full'"
   :show-header="isTree ? false : true"
   :row-config="{isHover: true, keyField: 'id'}"
   :tree-config="{transform: true, reserve: true, lazy: lazy, loadMethod: loadMethod}"
   :loading="loading"
   :data="tableData"
   @toggle-tree-expand="onTreeExpand"
   @cell-click="onCellClick">
   <vxe-column
     v-for="column in columns"
     :key="column.dataIndex"
     :field="column.dataIndex"
     :title="column.title"
     :width="column.width"
     :tree-node="column.dataIndex === treeNode">
     <template #default="{ row }">
       <template v-if="column.dataIndex == 'operation'">
         <template v-for="action in Object.keys(column.actions || {})" :key="action">
           <template v-if="hasPermission(column, row, action)">
             <a-popconfirm
               v-if="action === '删除'"
               title="你确定要删除吗？"
               ok-text="是"
               cancel-text="否"
               @confirm="onHandler(column, row, action)"
             >
               <a class="text-blue mr-2">删除</a>
             </a-popconfirm>
             <a v-else class="text-blue mr-2" @click="onHandler(column, row, action)">
               {{ action }}
             </a>
           </template>
         </template>
       </template>
       <template v-else >
         <slot :column="column" :row="row">
           <span>{{ row[column.dataIndex] }}</span>
         </slot>
       </template>
     </template>
   </vxe-column>
 </vxe-table>
 <div class=" float-right mt-4 mr-4">
   <a-pagination
     v-if="!isTree && page.total > tableData?.length"
     :total="page.total"
     :show-total="(total: number) => `共 ${total} 条`"
     :page-size="page.size"
     v-model:current="page.current"
     @change="onPageChange"
   />
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
 columns: {
   type: Array<any>,
   required: true
 },
 treeNode: { // 展开icon所在的字段
   type: String,
   default: () => 'name'
 },
 lazy: { // 是否懒加载数据
   type: Boolean,
   default: () => false
 },
 isTree: { // 是否显示为树
  type: Boolean,
  default: () => false
 },
 isOnlyCreator: {
   // 是否只允许创建者编辑，删除
   type: Boolean,
   default: () => false
 }
})

watch(() => props.query, 
 () => {
   refresh()
 }, {
  deep: true
})

const route = useRoute()
const routeName = route.path.replaceAll('/', '')
const expandRowKeys = useSessionStorage<number[]>(routeName + ': tree-table', [])
const table = ref()
const loading = ref(false)
const tableData = ref([])

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
 const res = await props.api({
   ...props.query, 
   ...params,
   page: page.current, 
   size: page.size
 } )
 results.total = res.count
 results.data = (res.results || res).map((item: any) => ({ ...item, hasChild: !item.isLeaf}))
 results.data = props.lazy ? results.data : transformTreeToArray(results.data)
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


const onTreeExpand = () => {
 expandRowKeys.value = table.value.getTreeExpandRecords()
}

const emits = defineEmits(['select'])
const onCellClick = ({ row, $event }: any) => {
 // 叶子节点和展开收起图标，不做处理
 const nodeName = $event.target.nodeName
 if(nodeName == 'I' || nodeName == 'A' ) return
  if(row.isLeaf) {
    emits('select', row)
  } else {
    const expanded = expandRowKeys.value?.findIndex((item: any) => item.id == row.id) > -1
    table.value.setTreeExpand(row, !expanded)
    expandRowKeys.value = table.value.getTreeExpandRecords()
  }
}

const onHandler = async (column: any, record: RObject, key: string) => {
 const action = column.actions[key]
 const handler = action.handler || action
 const isAync = handler.constructor.name === 'AsyncFunction'
 if(isAync) {
   await handler(record)
   message.info(key + '成功')
   refresh()
 } else {
   handler(record)
 }
}

const loadMethod = async ({ row }: any) => {
 const data = await fetchTableData({ parent: row.id })
 expandRowKeys.value.push(row)
 return Promise.resolve(data.data)
}

onMounted(() => {
 if(props.isTree) return
 let height = document.getElementsByClassName('top')?.[0]?.clientHeight
 height = isNaN(height) ? 0 : height + 20 // + 20的padding高度
 const tableScrollBody = document.getElementsByClassName('vxe-table--body-wrapper')?.[0] as HTMLElement
 if (tableScrollBody) {
   tableScrollBody.style.maxHeight = 'calc(100vh - ' + (40 + height + 200) + 'px)'
 }
})

const hasPermission = (column: RObject, row: RObject, key: string) => {
 const action = column.actions[key]
 const data = row
 // 是否配置了该页面的操作权限
 const userStore = store.user
 let permission = userStore.hasPermission(key as DataAction)

 // 是否只允许自己操作
 if (props.isOnlyCreator && ['编辑', '删除'].includes(key)) {
   const isOwner = data.createUser === userStore.user.username || data.create_user === userStore.user.username
   permission = permission && isOwner
 }

 // 自定义的验证
 if(action.validator) {
   permission = permission && action.validator(data)
 }

 return permission
}

// 分页
const page = reactive({
 size: 10,
 current: 1,
 total: 0
})
const onPageChange = (val: number) => {
 page.current = val
 refresh()
}

defineExpose({ refresh })
</script>