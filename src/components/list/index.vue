<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <!-- button lines -->
  <slot></slot> 
  
  <Table :api="api" :query="query" :columns="columns" @on-select="onSelect" :isSelectable="isSelectable" :isOnlyCreator="isOnlyCreator">
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
      <slot :name="item" :scope="scope" v-bind="scope || {}"></slot>
    </template>
  </Table>
</template>
 
<script setup lang="ts">
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
 