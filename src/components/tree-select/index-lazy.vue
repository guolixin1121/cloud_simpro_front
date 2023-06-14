<template>
  <a-tree-select
    placeholder="请选择"
    showSearch
    :treeDefaultExpandAll="true"
    :tree-data-simple-mode="lazy? true : false"
    :treeNodeFilterProp="lazy ? '' : 'title'"
    :dropdownMatchSelectWidth="false"
    :tree-data="treeData"
    :load-data="lazy ? onLoadData : null"
    :not-found-content=" loading ? '数据加载中...' : '暂无数据'"
    :tree-icon="true"
    @search="onSearch"
    @select="onSelect"
  >
  <!-- <template #title="data">
    <svg-icon icon="folder" v-if="!data.selectable"></svg-icon>
    {{ data.title  }}
  </template> -->
  </a-tree-select>
</template>
<script setup lang="ts">
import { TreeDataItem } from 'ant-design-vue/lib/tree';

const props = defineProps({
  api: {
    type: Function
  },
  lazy: {
    type: Boolean,
    default: () => false
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
  // 获取节点的源数据，包含了api返回的所有字段
  selectNode: {
    type: Object
  }
})
const emits = defineEmits(['update:selectNode'])
const attrs = useAttrs()
const allOption: TreeDataItem = { title: '全部', value: '', key: '', children: [] }
const treeData = ref<TreeDataItem[]>([])

// 根据defaultValue是否为空，判断是否需要加‘全部’的option
// 一般在列表页搜索时需要加，在编辑页是不需要加
const initOptions = () => {
  treeData.value = []

  const defaultValue = attrs.defaultValue
  const hasAllOption = defaultValue === '' || (Array.isArray(defaultValue) && defaultValue.toString() === '')
  hasAllOption && treeData.value.push(allOption)
}

const loading = ref(false)
const refresh = async () => {
  if (props.api) {
    try {
      loading.value = true
      const options = await getOptions()
      treeData.value.push(...options)
    } finally {
      loading.value = false
    }
  }
}
const getOptions = async (query: any = {}) => {
  if (props.api) {
      const res = await props.api({ ...props.query, ...query})
      return treeTransfer(res.results || res)
  } else {
    return []
  }
}

const treeTransfer = (data: any): TreeDataItem[] => {
  let parents = data
  const apiFilter = props.apiFilter
  if(apiFilter) {
    parents = parents.filter((item: any) => apiFilter(item))
  }
  const { label, value } = props.fieldNames
  const options = parents.map((item: any) => {
    const data = {
      title: item[label],
      value: item[value],
      key: item[value],
      level: item.level,
      id: item.nodeId || item.id,
      pId: item.parentId,
      selectable: props.checkLeaf ? (item.isLeaf == 1) : true,
      isLeaf: item.isLeaf == 1
    } as any
    // lazy时在data中加children，多层时展示会报错
    if(!props.lazy) {
      data.children = treeTransfer(item.children || [])
    }
    return data
  })
  return options
}

const onLoadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    getOptions({parent: treeNode.id}).then((res) => {
      treeNode.dataRef.children = res 
      treeData.value.push(...res)
      resolve()
    })
  })
}

const onSelect = (value: string, node: any) => {
  emits('update:selectNode', node)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSearch = async (input: string) => {
  if(props.lazy) {
    loading.value = true
    const options = await getOptions({name: input})
    treeData.value.push(...options)
    loading.value = false
  }
}

watch(
 ()=> props.api,
 () => {
  treeData.value = []
  refresh()
 }
)

initOptions()
refresh()
</script>
