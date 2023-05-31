<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" :placeholder="placeholder" />
    <div class="tree-container">
      <v-tree :searchValue="searchValue" :api="api" :showCheckbox="showCheckbox" :onSelect="onSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchValue = ref<string>('')
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
  },
  api: {
    type: Function
  },
  showCheckbox: {
    type: Boolean
  },
  onSelect: {
    type: Function
  }
})

const { title, placeholder } = toRefs(props)
</script>
