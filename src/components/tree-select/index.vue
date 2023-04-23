<template>
  <a-tree-select :tree-data="treeData" showSearch></a-tree-select>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

// 自定义字段
interface FieldName {
  title: string
  id: string | number
}
const props = defineProps({
  api: {
    type: Function,
    default: () => ({})
  },
  params: {
    type: Object,
    default: () => ({})
  },
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ title: '' })
  }
})
const treeData = ref([])

const getTreeData = async () => {
  const { params = {} } = props
  const res = await props.api(params)
  treeData.value = res.results
  dealData(res.results)
}

const dealData = (data: string | any[]) => {
  const { fieldNames = { title: '', id: '' } } = props
  for (let i = 0; i < data.length; i++) {
    data[i].title = data[i][fieldNames.title]
    data[i].value = data[i][fieldNames.id]
    if (data[i].children) {
      dealData(data[i].children)
    }
  }
}

getTreeData()
</script>
