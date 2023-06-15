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
      <a-spin :spinning="loading" class=" w-full">
      </a-spin>
      <!-- 刷新数据需要重新渲染，否则展开节点会有bug -->
      <a-tree
        v-if="!loading"
        :loading="loading"
        :load-data="lazy ? loadData : null"
        :tree-data="treeData"
        :expandedKeys="expandRowKeys"
        :selectedKeys="selectedRowKeys"
        @expand="onExpand"
        @select="onSelect">
      </a-tree>
    </div>
    <div class=" float-right mt-2">
      <svg-icon icon="add" class="cursor-pointer mr-1" @click="onClick('add')"></svg-icon>
      <svg-icon icon="edit" class="cursor-pointer mr-1"
        :class="isEmptySelected || !selectedNode.isLeaf ? 'icon--disable' : ''"
         @click="onClick('edit')"></svg-icon>
      <svg-icon icon="delete" class="cursor-pointer mr-1" 
        :class="isEmptySelected ? 'icon--disable' : ''"
        @click="onClick('delete')"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
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
const emits = defineEmits(['select', 'btn-click'])

const routeName = useRoute().path.replaceAll('/', '')
const searchValue = useSessionStorage(routeName + ': tree-search', props.query.name || '') 
const searchQuery = ref()

const onSearch = () => {
  searchQuery.value = { ...props.query, name: searchValue.value,}
  delete searchQuery.value.baidu_id
}

onMounted(() => {
  searchQuery.value = {...props.query, name: searchValue.value}
  if(!isEmpty(selectedNode.value)) {
    emits('select', selectedNode.value)
  }
})

const onClick = (type: string) => {
  if(type != 'add' && isEmpty(selectedNode.value)) return
  emits('btn-click', { type, data: selectedNode.value })
}

/******* table ******/
const loading = ref(false)
const treeData = ref([])

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
  const res = await props.api({
    ...searchQuery.value, 
    ...query
  } )
  return transformData(res.results)
}

const transformData = (data: any = []) => {
  const { label, value } = props.filedNames
  return data.map((item: any) => ({
    id: item[value],
    key: item[value],
    title: item[label],
    name: item[label],
    isLeaf: item.isLeaf === 1,
    // selectable: item.isLeaf == 1,
    children: props.lazy ? null : transformData(item.children)
  }))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve();
      return;
    }
    getOptions({parent: treeNode.key}).then((res) => {
      treeNode.dataRef.children = res 
      treeData.value = [...treeData.value]
      resolve()
    })
  })
}

// 选中的树节点
const selectedNode = useSessionStorage(routeName + ': tree-select', {} as any)
const selectedRowKeys = ref([selectedNode.value.id])
const isEmptySelected = ref(false)

const onSelect = (keys: string[], {selected, selectedNodes}: any) => {
  if(!selected) return

  const node = selectedNodes[0]
  if(node.id == selectedNode.value.id) return

  selectedNode.value = node
  selectedRowKeys.value = [node.id]

  if(selectedNode.value.isLeaf == 1) {
    emits('select', node)
  }
}

const expandRowKeys = useSessionStorage<string[]>(routeName + ': tree-expand', [])
const onExpand = (expandedKeys: string[]) => {
  expandRowKeys.value = expandedKeys
}

watch(searchQuery, () => {
  // expandRowKeys.value = []
  // selectedRowKeys.value = []
  // selectedNode.value = {}
  refresh()
})
watch(selectedNode, () => {
  isEmptySelected.value = isEmpty(selectedNode.value)
})

defineExpose({ refresh })
</script>

<style lang="less" scoped>
.icon--disable {
  color: #d9d9d9
}
</style>