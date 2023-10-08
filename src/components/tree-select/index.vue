<template>
  <a-tree-select
    placeholder="请选择"
    showSearch
    :treeNodeFilterProp="'title'"
    :treeData="treeData"
    :not-found-content="loading ? '数据加载中...' : '暂无数据'"
    @select="onSelect"
  >
  </a-tree-select>
</template>
<script setup lang="ts">
const props = defineProps({
  api: {
    type: Function
  },
  // api结果的过滤器
  apiFilter: {
    type: Function
  },
  query: {
    type: Object,
    default: () => ({})
  },
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ label: 'name', value: 'id' })
  },
  // 是否限定只能选择叶子节点
  checkLeaf: {
    type: Boolean,
    default: () => true
  },
  select: {
    type: Function
  },
  // 默认只返回节点的值，该属性返回节点的对象
  selectNode: {
    type: Object
  }
})
const emits = defineEmits(['update:selectNode'])
const attrs = useAttrs()
const allOption: TreeItem = { title: '全部', value: '', children: [] }
const treeData = ref<TreeItem[]>([])

// 根据defaultValue是否为空，判断是否需要加‘全部’的option
// 一般在列表页搜索时需要加，在编辑页是不需要加
const initOptions = () => {
  treeData.value = []

  const defaultValue = attrs.defaultValue
  const hasAllOption = defaultValue === '' || (Array.isArray(defaultValue) && defaultValue.toString() === '')
  hasAllOption && treeData.value.push(allOption)
}

const loading = ref(false)
const getOptions = async () => {
  if (props.api) {
    try {
      loading.value = true
      const res = await props.api(props.query)
      const data = treeTransfer(res.results || res)
      treeData.value.push(...data)
    } finally {
      loading.value = false
    }
  }
}

const treeTransfer = (data: any, level: number = 0): TreeItem[] => {
  let parents = data
  const apiFilter = props.apiFilter
  if(apiFilter) {
    parents = parents.filter((item: any) => apiFilter(item))
  }
  const { label, value } = props.fieldNames
  const options = parents.map((item: any) => ({
    title: item[label],
    value: item[value],
    key: item[value],
    level,
    id: item.nodeId || item.id,
    selectable: props.checkLeaf ? (!!item.isLeaf || !!item.isTag) : true,
    children: treeTransfer(item.children || [], level + 1)
  }))
  return options
}

const onSelect = (value: string, node: any) => {
  emits('update:selectNode', node)
}

watch(
  () => props.api,
  () => {
    treeData.value = []
    getOptions()
  })

initOptions()
getOptions()
</script>
