<!-- 封装了操作列：有操作权限时才展示操作按钮 -->
<template>
  <a-table 
    v-bind="$attrs"
    v-on="$attrs"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :rowSelection="isSelectable ? {
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange
    } : null "
    :pagination="pagination"
    @change="onChange">
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
        <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>
        <slot v-else :name="item" :scope="scope" v-bind="scope || {}" >
          <template v-if="scope.column.key == 'actions'">
            <Action :scope="scope"></Action>
          </template>
        </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <template v-if="scope.column.key == 'actions'">
        <Action :scope="scope"></Action>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { Service, useRequest} from 'vue-request'
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
  isOnlyCreator: { // 是否只允许创建者编辑，删除 
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['onSelect', 'onChange'])

const current = ref(1)
const { data, loading, run } = useRequest(props.api as Service<{results: [], count: number}, any>)
const dataSource = computed(() => data.value?.results)
const pagination = computed(() => ({ current: current.value, total: data.value?.count }))

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('onSelect', selectedKeys)
}

// page event handler
const onChange = (params: any) => current.value = params.current
watch(() => props.query, (newVal) => {
  current.value = 1
  run({...newVal, page: 1})
})
watch(current, (newVal) => {
  run({...props.query, page: newVal})
})
</script>