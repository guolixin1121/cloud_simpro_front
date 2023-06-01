<!-- 封装了 - 日期格式化、操作列（有操作权限时才展示操作按钮） -->
<!-- tree table默认展开只支持首次赋值，所以增加v-if="$attrs['tree-default-expand-all'] != '' || dataSource?.length" -->
<template>
  <a-table
    bordered
    class="ant-table-striped mt-2"
    v-bind="$attrs"
    v-on="$attrs"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
    :rowSelection="
      isSelectable
        ? {
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            ...rowSelection
          }
        : null
    "
    :defaultExpandAllRows="true"
    :pagination="pagination"
    @change="onChange"
  >
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
      <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>
      <slot v-else :name="item" :scope="scope" v-bind="scope || {}">
        <column :scope="scope" :pagination="pagination" :is-only-creator="isOnlyCreator" @refresh="refresh" />
      </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <column :scope="scope" :pagination="pagination" :is-only-creator="isOnlyCreator" @refresh="refresh" />
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash'
import Column from './column.vue'
const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object
  },
  columns: {
    type: Array,
    required: true
  },
  isSelectable: {
    type: Boolean,
    default: () => false
  },
  isOnlyCreator: {
    // 是否只允许创建者编辑，删除
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['select'])
const rowSelection: any = useAttrs()['row-selection'] || {}

const current = ref(1)
const { data, loading, run } = useRequest(props.api as Service<{ results: []; count: number; datalist: [] }, any>, {
  manual: true
})
const dataSource: any = computed(() => {
  const results = data.value?.results || data.value?.datalist
  addKeysToData(results)
  return results
})
const pagination = computed(() => ({
  size: 10,
  current: current.value,
  total: data.value?.count,
  'show-total': (total: number) => `共 ${total} 条`
}))
const size = pagination.value.size

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('select', selectedKeys)
}

// 页面切换 event handler
const onChange = (params: any) => (current.value = params.current)
watch(
  () => props.query,
  newVal => {
    current.value = 1
    run({ ...newVal, page: 1, size })
  }
)
watch(current, newVal => run({ ...props.query, page: newVal, size }))

// 动态计算表格父容器高度
onMounted(() => {
  let height = document.getElementsByClassName('top')?.[0]?.clientHeight
  height = isNaN(height) ? 0 : height + 20 // + 20的padding高度
  const tableScrollBody = document.getElementsByClassName('ant-table-body')?.[0] as HTMLElement
  if (tableScrollBody) {
    tableScrollBody.style.maxHeight = 'calc(100vh - ' + (40 + height + 230) + 'px)'
  }
  const mainContent = document.getElementsByClassName('main')?.[0] as HTMLElement
  if (mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
})

// 用于删除等操作后，重新加载table
const refresh = () => {
  // 判断是否还剩一条，剩一条删除成功后请求上一页
  if (dataSource?.value?.length === 1) {
    run({ ...props.query, page: current.value > 1 ? current.value - 1 : current.value, size })
    return
  }
  run({ ...props.query, page: current.value, size })
}

// 为了兼容树状的table，为每个数据增加key
const addKeysToData = (data: any) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    item.key = item.id
    if (isEmpty(item.children)) {
      delete item.children
    } else {
      addKeysToData(item.children)
    }
  })
}
// refresh()
defineExpose({ refresh })
</script>

<style scoped>
/* .ant-table-striped :deep(.ant-table-body) {
  max-height: calc(100vh - 360px) !important;
} */
.ant-table-striped :deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0 0 0 !important;
}
.ant-table-striped :deep(.table-striped) td,
.ant-table-thead > tr > th {
  background: #f7f8fa;
}
</style>
