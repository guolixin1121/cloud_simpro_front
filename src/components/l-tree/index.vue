<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search
      :value="searchValue"
      style="margin-bottom: 8px"
      :placeholder="placeholder"
      @change="onChange"
      @search="onSearch"
    />
    <div class="tree-container">
      <v-tree :searchValue="val" :api="api" :showCheckbox="showCheckbox" :onSelect="onSelect" :treeSelectId="treeSelectId" />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchValue = ref('')
const val = ref('')
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入名称搜索'
  },
  select: {
    type: Function
  },
  api: {
    type: Function
  },
  showCheckbox: {
    type: Boolean
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
const { title, placeholder, treeSearchName } = toRefs(props)
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
