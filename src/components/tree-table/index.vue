<template>
   <vxe-table
        ref="table"
        height="100%"
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
          :tree-node="column.dataIndex === 'name'">
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
  isOnlyCreator: {
    // 是否只允许创建者编辑，删除
    type: Boolean,
    default: () => false
  }
})

watch(() => props.query, 
  () => {
    fetchTableData(props.query)
  })

const route = useRoute()
const routeName = route.path.replaceAll('/', '')
const expandRowKeys = useSessionStorage<number[]>(routeName + '-tree', [])
const table = ref()
const loading = ref(false)
const tableData = ref([])
const fetchTableData = async (params: any = {}) => {
  loading.value = true
  try {
    const res = await props.api(params)
    tableData.value = transformTreeToArray(res.results)
    table.value.setTreeExpand(expandRowKeys.value, true)
  } finally {
    loading.value = false
  }
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

const onTreeExpand = ({ expanded, row }: any) => {
  // const id = row.id
  if(expanded) {
    expandRowKeys.value = expandRowKeys.value.length ? [...expandRowKeys.value, row] : [row]
  } else {
    expandRowKeys.value = expandRowKeys.value.filter((item: number) => item != row.id)
  }
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
    fetchTableData(props.query?.value)
  } else {
    handler(record)
  }
}
</script>