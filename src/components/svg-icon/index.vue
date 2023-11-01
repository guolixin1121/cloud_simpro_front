<template>
  <div class="icon">
    <component :is="component" />
  </div>
</template>
<script setup lang="ts">
import iconFiles from '@/assets/icons/index'
const props = defineProps({
  icon: {
    type: String,
    required: true
  }
})
let component = ref()
const getIcon = async () => {
  const iconFile = iconFiles[props.icon]
  if (iconFile) {
    component.value = await iconFile()
  }
}
getIcon()
</script>

<style lang="less">
@import '@/assets/styles/variable.less';

.icon {
  vertical-align: middle;
  display: inline-block;
}

// .icon:hover {
//   svg *[stroke='#60656E'] {
//     stroke: var(--primary-color) !important;
//   }
//   svg path[fill='#60656E'],
//   svg rect[fill='#60656E'] {
//     fill: var(--primary-color) !important;
//   }
// }
</style>
