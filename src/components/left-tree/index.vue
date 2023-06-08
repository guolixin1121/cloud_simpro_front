<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search
      allowClear
      :value="searchValue"
      style="margin-bottom: 8px"
      @change="onChange"
      @search="onSearch"
    />
    <div class="tree-container">
      <Tree :searchValue="val" :api="api" :treeSelectId="treeSelectId" :onSelect="onSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import Tree from './tree.vue'

const routeName = useRoute().path.replaceAll('/', '')
const searchValue = useSessionStorage(routeName + ': tree-search', '')
const val = ref('')
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  api: {
    type: Function
  },
  onSelect: {
    type: Function
  },
  treeSearchName: {
    type: String,
    default: ''
  },
  treeSelectId: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:treeSearchName'])
const { title, treeSearchName } = toRefs(props)
searchValue.value = treeSearchName.value
val.value = treeSearchName.value
const onChange = (e: { target: { value: string } }) => {
  searchValue.value = e.target.value
}
const onSearch = (value: any) => {
  emits('update:treeSearchName', value)
  val.value = value
}
</script>
<style></style>
