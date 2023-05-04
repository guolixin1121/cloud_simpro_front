<!-- 封装了 - 日期格式化、操作列（有操作权限时才展示操作按钮） -->
<!-- tree table默认展开只支持首次赋值，所以增加v-if="$attrs['tree-default-expand-all'] != '' || dataSource?.length" -->
<template>
  <a-table
    style="height: calc(100% - 40px); overflow: auto;"
    v-if="$attrs['tree-default-expand-all'] != '' || dataSource?.length"
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
        <column :scope="scope" :is-only-creator="isOnlyCreator" @refresh="refresh"/>
      </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <column :scope="scope" :is-only-creator="isOnlyCreator" @refresh="refresh"/>
    </template>
  </a-table>
  <a-spin v-else  style="padding-top: 100px; width: 100%;">
  </a-spin>
</template>

<script setup lang="ts">
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
const emits = defineEmits(['onSelect'])
const rowSelection: any = useAttrs()['row-selection'] || {}

const current = ref(1)
const { data, loading, run } = useRequest(props.api as Service<{ results: []; count: number; datalist: [] }, any>, { manual: true})
const dataSource = computed(() => {
  const results = data.value?.results || data.value?.datalist
  addKeysToData(results)
  return results
})
const pagination = computed(() => ({
  current: current.value,
  total: data.value?.count,
  'show-total': (total: number) => `共 ${total} 条`
}))
const size = 10

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('onSelect', selectedKeys)
}

// 页面切换 event handler
const onChange = (params: any) => (current.value = params.current)
watch(
  () => props.query,
  newVal => {
    current.value = 1
    run({ ...newVal, page: 1, size: 10 })
  }
)
watch(current, newVal => run({ ...props.query, page: newVal, size }))

// 动态计算表格父容器高度
onMounted(() => {
  const height = document.getElementsByClassName('ant-form')?.[0]?.clientHeight + 20
  const mainContent = document.getElementsByClassName('main')?.[0] as HTMLElement
  if(mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
})

// 用于删除等操作后，重新加载table
const refresh = () => run({ ...props.query, page: current.value, size })

// 为了兼容树状的table，为每个数据增加key
const addKeysToData = (data: any) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    item.key = item.id
    addKeysToData(item.children)
  })
}

refresh()
defineExpose({ refresh })
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) td,
.ant-table-thead > tr > th {
  background: #f7f8fa;
}
</style>
