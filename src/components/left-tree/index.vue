<template>
  <div class="left-tree">
    <span class="title">{{ title }}</span>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="placeholder" />
    <div class="tree-container">
      <Tree :searchValue="searchValue" v-bind="$attrs" />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchValue = ref<string>('')
// const emits = defineEmits(['select'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择...'
  },
  select: {
    type: Function
  }
})

const { title, placeholder } = toRefs(props)
</script>
