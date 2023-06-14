<template>
  <a-spin :spinning="loading">
    <a-tree
      :loading="loading"
      :load-data="loadData"
      :tree-data="treeData">
    </a-tree>
  </a-spin>
</template>

<script setup lang="ts">
import { TreeDataItem } from 'ant-design-vue/lib/tree';

const props = defineProps({
  title: {
    type: String
  },
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object,
    default: () => ({})
  },
  filedNames: {
    type: Object,
    default: () => ({ label: 'name', value: 'id'})
  },
  lazy: {
    type: Boolean,
    default: () => false
  }
})

const loading = ref(false)
const treeData = ref<TreeDataItem[]>([])

const refresh = async () => {
  try{
    loading.value = true
    const data = await getOptions()
    treeData.value = data
  } finally {
    loading.value = false
  }
}

const getOptions = async (query: any = {}) => {
  console.log(props.query)
  const res = await props.api({
    ...props.query, 
    ...query
  } )
  const { label, value } = props.filedNames
  const data =  res.results.map((item: any) => ({
    key: item[value],
    title: item[label],
    isLeaf: item.isLeaf === 1
  }))
  return data
}

const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    getOptions({parent: treeNode.id}).then((res) => {
      treeNode.dataRef.children = res 
      treeData.value = [...treeData.value];
      resolve()
    })
  })
}

refresh()
</script>