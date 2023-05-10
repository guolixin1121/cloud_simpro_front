<template>
  <a-tree-select
    placeholder="请选择"
    treeDefaultExpandAll
    showSearch
    treeNodeFilterProp="title"
    :treeData="treeData"
    :not-found-content="null"
  >
  </a-tree-select>
</template>
<script setup lang="ts">
// 自定义字段
interface FieldName {
  label: string
  value: string
}
interface TreeItem {
  title: string
  value: string
  children: TreeItem[]
}
const props = defineProps({
  api: {
    type: Function
  },
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ label: 'name', value: 'id' })
  },
  checkLeaf: {
    type: Boolean,
    default: () => true
  }
})
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

const getOptions = async () => {
  if (props.api) {
    const res = await props.api()
    const data = treeTransfer(res.results || res)
    treeData.value.push(...data)
  }
}

const treeTransfer = (data: any): TreeItem[] => {
  const { label, value } = props.fieldNames
  const options = data.map((item: any) => ({
    title: item[label],
    value: item[value],
    key: item[value],
    selectable: props.checkLeaf ? !!item.isLeaf : true,
    children: treeTransfer(item.children || [])
  }))
  return options
}

initOptions()
getOptions()
</script>
