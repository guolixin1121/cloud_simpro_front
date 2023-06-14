<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search
        allowClear
        v-model:value="searchValue"
        style="margin-bottom: 8px"
        @search="onSearch"
      />
    <div class="tree-container"> 
      <a-spin :spinning="loading">
        <a-tree
          :loading="loading"
          :load-data="lazy ? loadData : null"
          :tree-data="treeData"
          @select="onSelect">
        </a-tree>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import { TreeDataItem } from 'ant-design-vue/lib/tree';
import { isEmpty } from 'lodash';

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
const emites = defineEmits(['select'])
const searchQuery = ref()

const routeName = useRoute().path.replaceAll('/', '')
const searchValue = useSessionStorage(routeName + ': tree-search', props.query.name || '') 
const onSearch = () => {
  searchQuery.value = {
    ...props.query,
    name: searchValue.value,
  }
  delete searchQuery.value.baidu_id
}

onMounted(() => {
  searchQuery.value = props.query
  if(!isEmpty(selectedNode.value)) {
    emites('select', selectedNode.value)
  }
})

// 选中的树节点
const selectedNode = useSessionStorage(routeName + ': tree-select', [] as any)
const onSelect = (keys: string[], {selectedNodes}: any) => {
  selectedNode.value = selectedNodes[0]
  emites('select', selectedNodes[0])
}

/******* table ******/
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
    id: item[value],
    key: item[value],
    title: item[label],
    name: item[label],
    isLeaf: item.isLeaf === 1,
    selectable: item.isLeaf == 1
  }))
  return data
}

const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    getOptions({parent: treeNode.key}).then((res) => {
      treeNode.dataRef.children = res 
      treeData.value = [...treeData.value];
      resolve()
    })
  })
}

refresh()
</script>