<template>
  <div class="relative" style="height: calc(100% - 24px)">
  <a-spin :spinning="loading">
    <vxe-table stripe ref="table" 
      style="margin-top: 16px;"
      :scroll-x="{enabled: true, gt: 0 }"
      :border="isTree ? 'none' : 'full'" :show-header="isTree ? false : true" 
      :row-config="{ isHover: true, keyField: 'id' }" 
      :tree-config="{ transform: true, reserve: true, rowField: 'id', lazy: lazy, loadMethod: loadMethod }" 
      :data="tableData" @toggle-tree-expand="onTreeExpand" @cell-click="onCellClick">
      <vxe-column v-for="column in columns" :key="column.dataIndex" show-overflow
      :field="column.dataIndex" :title="column.title" :width="column.width" 
      :tree-node="column.dataIndex === treeNode"
      v-bind="column">
        <template #default="{ row }">
          <template v-if="column.dataIndex == 'operation'">
            <template v-for="action in Object.keys(column.actions || {})" :key="action">
              <template v-if="hasPermission(column, row, action)">
                <a-popconfirm v-if="action === '删除'" title="是否删除？" @confirm="onHandler(column, row, action)">
                  <a class="text-link mr-2">删除</a>
                </a-popconfirm>
                <a v-else class="text-link mr-2" @click="onHandler(column, row, action)">
                  {{ action }}
                </a>
              </template>
            </template>
          </template>
          <template v-else>
            <slot :column="column" :row="row">
              <svg-icon icon="folder-light" class="mr-1" v-if="!row.isLeaf && column.dataIndex == treeNode"></svg-icon>
              <a-tooltip placement="topLeft" :title="row[column.dataIndex]" v-if="column['show-overflow']">
                <span>{{ row[column.dataIndex] }}</span>
              </a-tooltip>
              <span v-else>{{ row[column.dataIndex] }}</span>
            </slot>
          </template>
        </template>
      </vxe-column>
    </vxe-table>
  </a-spin>
  <a-pagination v-if="page.hasPagination" :total="page.total" :show-total="(total: number) => `共 ${total} 条`" :page-size="page.size" v-model:current="current" @change="onPageChange" />
  </div>
</template>

<script setup lang="ts">
import 'vxe-table/lib/style.css'
import { VxeTable, VxeColumn } from 'vxe-table'
import { useSessionStorage } from '@vueuse/core'
import { isEmpty } from '@/utils/tools'

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
  treeNode: {
    // 展开icon所在的字段
    type: String,
    default: () => 'name'
  },
  lazy: {
    // 是否懒加载数据
    type: Boolean,
    default: () => false
  },
  isTree: {
    // 是否显示为树
    type: Boolean,
    default: () => false
  },
  isOnlyCreator: {
    // 是否只允许创建者编辑，删除
    type: Boolean,
    default: () => false
  }
})

watch(
  () => props.query,
  () => {
    // page默认使用session里缓存的数据，
    // 除非明确指定
    if (props.query?.page) {
      current.value = props.query.page
    }
    refresh()
  },
  {
    deep: true
  }
)

const route = useRoute()
const routeName = route.path.replaceAll('/', '')
const expandRowKeys = useSessionStorage<number[]>(routeName + ':tree-expand', [])
const current = useSessionStorage(routeName + ':table-page', 1)
const table = ref()
const loading = ref(false)
const tableData = ref([])

// 分页
const page = reactive({
  size: 10,
  current: current.value,
  total: 0,
  hasPagination: false // 是否需要分页
})

const refresh = async () => {
  loading.value = true
  page.hasPagination = false
  try {
    tableData.value = []
    const { total, hasPagination, data } = await fetchTableData()
    page.total = total
    page.hasPagination = hasPagination
    tableData.value = data

    const { query, lazy } = props
    if (!lazy) {
      // 获取当前搜索节点的所有父节点展开
      if (query?.name) {
        const current: any = tableData.value.find((item: any) => item.name == query.name)
        current && setParentExpand(current.parentId)
      }
    }

    table.value?.setTreeExpand(expandRowKeys.value, true)
  } finally {
    loading.value = false
  }
}

const fetchTableData = async (params: any = {}) => {
  const results = { total: 0, data: [], hasPagination: false }
  const res = await props.api({
    ...props.query,
    ...params,
    page: current.value,
    size: page.size
  })
  results.total = res.count
  results.data = (res.results || res).map((item: any) => ({ ...item, hasChild: !item.isLeaf }))
  // results.hasPagination = results.total > results.data.length
  results.hasPagination = true
  results.data = props.lazy ? results.data : transformTreeToArray(results.data)
  return results
}

// 数据转换成一维数组，组件的渲染性能高
const transformTreeToArray = (data: any[], parentId: string | number = '') => {
  let results: any = []
  if (!isEmpty(data)) {
    data.forEach((item: RObject) => {
      const itemObj = { ...item }
      if (!itemObj.parentId) {
        itemObj.parentId = parentId
      }
      if (!itemObj.id) {
        itemObj.id = '-1'
      }
      // eslint-disable-next-line no-prototype-builtins
      itemObj.isLeaf = item.hasOwnProperty('isLeaf') ? item.isLeaf == 1 : item.isTag
      const children = transformTreeToArray(itemObj.children, itemObj.id)
      results.push(itemObj)
      results.push(...children)
    })
  }
  return results
}

const setParentExpand = (parentId: String | Number) => {
  const parent: any = tableData.value.find((item: any) => item.id == parentId)
  if (parent) {
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
  if (nodeName == 'I' || nodeName == 'A') return
  table.value.toggleTreeExpand(row)
  expandRowKeys.value = table.value.getTreeExpandRecords()
  if (row.isLeaf) {
    emits('select', row)
  }
}

const onHandler = async (column: any, record: RObject, key: string) => {
  const action = column.actions[key]
  const handler = action.handler || action
  const isAync = handler.constructor.name === 'AsyncFunction'
  if (isAync) {
    await handler(record)
    message.success(key + '成功')
    refresh()
  } else {
    handler(record)
  }
}

const loadMethod = async ({ row }: any) => {
  const { data } = await fetchTableData({ parent: row.id })
  if (data.length == 0) {
    row.hasChild = false // 子节点为空
  }
  row.children = data
  expandRowKeys.value.push(row)
  return Promise.resolve(data)
}

const calcateHeight = () => {
  if (props.isTree) return

  let height = 0
  let tops = document.querySelectorAll('.table-container > div:not(:last-child)')
  if(tops.length == 0) {
    tops = document.querySelectorAll('.ant-layout-content > div:not(:last-child)')
  }
  tops.forEach((top) => height += isNaN(top.clientHeight) ? 0 : (top.clientHeight + 16))

  // 设置表格内容的高度
  let tableHeight = height + 278
  if(document.body.scrollWidth <= 1360) {
    // App.vue定义的页面最小宽度1360
    // 小于这个宽度出现滚动条时，计算表格高度时要加上滚动条高度，以确保分页符离底部总是最小24px
    tableHeight += 8
  }
  const tableScrollBody = document.getElementsByClassName('vxe-table--body-wrapper')?.[0] as HTMLElement
  if (tableScrollBody) {
    tableScrollBody.style.maxHeight = 'calc(100vh - ' + tableHeight + 'px)'
  }

  // 页面右侧内容区域的高度
  const mainContent = document.getElementsByClassName('main')?.[0] as HTMLElement
  if (mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
}

const hasPermission = (column: RObject, row: RObject, key: string) => {
  const action = column.actions[key]
  const data = row
  // 是否配置了该页面的操作权限
  const userStore = store.user
  let permission = userStore.hasPermission(key)

  // 是否只允许自己操作
  if (props.isOnlyCreator && ['编辑', '删除'].includes(key)) {
    const isOwner = data.createUser === userStore.user.username || data.create_user === userStore.user.username
    permission = permission && isOwner
  }

  // 自定义的验证
  if (action.validator) {
    permission = permission && action.validator(data)
  }

  return permission
}

const onPageChange = (val: number) => {
  current.value = val
  refresh()
}

onMounted(() => {
  nextTick(calcateHeight)
  window.addEventListener('resize', calcateHeight)
})

defineExpose({ refresh })
</script>
