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
      <tree-table
        :query="searchQuery"
        :api="api" 
        :lazy="lazy"
        :columns="columns"
        :tree-node="treeNode"
        :is-tree="true"
        @select="onSelect" 
      >
      <template #default="{ row }">
        <div style="white-space: nowrap;">
            <svg-icon icon="folder" class="mr-1" v-if="!row.isLeaf"></svg-icon>
            <span v-if="row.id == (selectedNode as any).id" class="text-blue">{{ row[treeNode] }}</span>
            <span v-else>{{ row[treeNode] }}</span>
          </div>
        </template>
    </tree-table>
    </div>
  </div>
</template>

<script setup lang="ts">
// import tree from './tree.vue'
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
  treeNode: {
    type: String,
    default: () => 'name'
  },
  lazy: {
    type: Boolean,
    default: () => false
  }
})
const emites = defineEmits(['select'])
const searchQuery = ref()

const routeName = useRoute().path.replaceAll('/', '')
// const searchValue = useSessionStorage(routeName + ': tree-search', '')

const searchValue = useSessionStorage(routeName + ': tree-search', props.query.name || '') 
const columns = [ { title: '', dataIndex: props.treeNode },]

const onSearch = () => {
  searchQuery.value = {
    ...props.query,
    name: searchValue.value,
  }
  delete searchQuery.value.baidu_id
}

// 选中的树节点
const selectedNode = useSessionStorage(routeName + ': tree-select', {})
const onSelect = (data: any) => {
  selectedNode.value = data
  emites('select', data)
}

onMounted(() => {
  searchQuery.value = props.query
  if(!isEmpty(selectedNode.value)) {
    emites('select', selectedNode.value)
  }
})
</script>