<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#409eff'
  }
})
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.icon}`
})
</script>
<style scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  position: relative;
  fill: currentColor;
}
</style>
