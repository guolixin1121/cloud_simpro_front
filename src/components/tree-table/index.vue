<template>
   <vxe-table
    ref="table"
    :row-config="{isHover: true, keyField: 'id'}"
    :tree-config="{transform: true, reserve: true, accordion: true}"
    :loading="loading"
    :data="tableData"
    @toggle-tree-expand="onTreeExpand">
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
      v-if="page.total > page.size"
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
import { isEmpty } from '@/utils/tools'
import { useSessionStorage } from '@vueuse/core';
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
    type: String,
    default: () => 'name'
  },
  isOnlyCreator: {
    // 是否只允许创建者编辑，删除
    type: Boolean,
    default: () => false
  }
})

watch(() => props.query, 
  () => {
    fetchTableData()
  })

const route = useRoute()
const routeName = route.path.replaceAll('/', '')
const expandRowKeys = useSessionStorage<number[]>(routeName + '-tree-table', [])
const table = ref()
const loading = ref(false)
const tableData = ref([])

const fetchTableData = async () => {
  loading.value = true
  try {
    const res = await props.api({...props.query, page: page.current, size: page.size} )
    page.total = res.count
    tableData.value = transformTreeToArray(res.results || res)
    table.value?.setTreeExpand(expandRowKeys.value, true)
  } finally {
    loading.value = false
  }
}

// 数据转换成一维数组，组件的渲染性能高
const transformTreeToArray = (data: [], parentId: string | number = '') => {
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

const onTreeExpand = ({ expanded, row }: any) => {
  expandRowKeys.value = expanded ? [row] : []
  // if(expanded) {
  //   expandRowKeys.value = expandRowKeys.value.length ? [...expandRowKeys.value, row] : [row]
  // } else {
  //   expandRowKeys.value = expandRowKeys.value.filter((item: number) => item != row.id)
  // }
}

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

const onHandler = async (column: any, record: RObject, key: string) => {
  const action = column.actions[key]
  const handler = action.handler || action
  const isAync = handler.constructor.name === 'AsyncFunction'
  if(isAync) {
    await handler(record)
    message.info(key + '成功')
    fetchTableData()
  } else {
    handler(record)
  }
}

onMounted(() => {
  debugger
  let height = document.getElementsByClassName('top')?.[0]?.clientHeight
  height = isNaN(height) ? 0 : height + 20 // + 20的padding高度
  const tableScrollBody = document.getElementsByClassName('vxe-table--body-wrapper')?.[0] as HTMLElement
  if (tableScrollBody) {
    tableScrollBody.style.maxHeight = 'calc(100vh - ' + (40 + height + 230) + 'px)'
  }
  const mainContent = document.getElementsByClassName('main')?.[0] as HTMLElement
  if (mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
})

// 分页
const page = reactive({
  size: 10,
  current: 1,
  total: 0
})
const onPageChange = (val: number) => {
  page.current = val
  fetchTableData()
}
</script>