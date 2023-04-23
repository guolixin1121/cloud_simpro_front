<!-- 封装了操作列：有操作权限时才展示操作按钮 -->
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
            onChange: onSelectChange
          }
        : null
    "
    :pagination="pagination"
    @change="onChange"
  >
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
      <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>
      <slot v-else :name="item" :scope="scope" v-bind="scope || {}">
        <!-- 封装操作列 -->
        <template v-if="scope.column.dataIndex == 'actions'">
          <Action :scope="scope" @delete="refresh"></Action>
        </template>
        <!-- 格式化时间 -->
        <template v-else-if="scope.column.dataIndex.indexOf('Time') > -1 || scope.column.dataIndex.indexOf('_time') > -1">
          {{ dayjs(scope.record[scope.column.dataIndex]).format('YYYY-MM-DD HH:MM:ss') }}
        </template>
        <!-- hover时加tooltip -->
        <template v-else-if="scope.column.dataIndex != 'actions'">
          <a-tooltip :title="scope.text">
            {{ scope.text }}
          </a-tooltip>
        </template>
      </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <!-- 封装操作列 -->
      <template v-if="scope.column.dataIndex == 'actions'">
        <Action :scope="scope" @delete="refresh"></Action>
      </template>
      <!-- 格式化时间 -->
      <template v-else-if="scope.column.dataIndex.indexOf('Time') > -1 || scope.column.dataIndex.indexOf('_time') > -1">
        {{ dayjs(scope.record[scope.column.dataIndex]).format('YYYY-MM-DD HH:MM:ss') }}
      </template>
      <!-- hover时加tooltip -->
      <template v-else-if="scope.column.dataIndex != 'actions'">
        <a-tooltip :title="scope.text">
          {{ scope.text }}
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Action from './action.vue'

const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object
  },
  columns: {
    type: Array<Object>,
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
const emits = defineEmits(['onSelect', 'onChange'])

const current = ref(1)
const { data, loading, run } = useRequest(props.api as Service<{ results: []; count: number }, any>)
const dataSource = computed(() => {
  const results = data.value?.results
  addKeysToData(results)
  return results
})
const pagination = computed(() => ({
  current: current.value,
  total: data.value?.count,
  'show-total': (total: number) => `共 ${total} 条`
}))

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('onSelect', selectedKeys)
}

// page event handler
const onChange = (params: any) => (current.value = params.current)
watch(
  () => props.query,
  newVal => {
    current.value = 1
    run({ ...newVal, page: 1 })
  }
)
watch(current, newVal => run({ ...props.query, page: newVal }))

const refresh = () => run({ ...props.query, page: current.value })

// 为了兼容树状的table，为每个数据增加key
const addKeysToData = (data: any) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    item.key = item.id
    addKeysToData(item.children)
  })
}
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) td,
.ant-table-thead > tr > th {
  background: #f7f8fa;
}
</style>
