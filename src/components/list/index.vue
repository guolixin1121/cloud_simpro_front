<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <slot></slot>
  
  <Table :api="api" :query="query" :columns="columns" @on-select="onSelect" :isSelectable="isSelectable" :isOnlyCreator="isOnlyCreator">
  </Table>
</template>
 
<script setup lang="ts">
import SearchForm from '../search-form/index.vue'
import Table from '../table/index.vue'

defineProps({
  formItems: {
    // eslint-disable-next-line no-undef
    type: Array<SearchFormItem>,
    required: true
  },
  api: {
    type: Function,
    required: true
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
const emits = defineEmits(['onSelect'])
const query: Record<string, any> = ref(null)

const onSearch = (data: Record<string, any>) => query.value = data
const onSelect = (keys: string[]) => emits('onSelect', keys)
 </script>
 