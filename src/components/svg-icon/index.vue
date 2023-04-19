<template>
  <i class="icon" v-html="icon"></i>
</template>
<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  }
})

const getIcon = async () => {
  const iconFiles = import.meta.glob('../../assets/icons/*.ts')
  const iconFile = iconFiles?.['../../assets/icons/' + props.icon + '.ts']

  if(iconFile) {
    const iconModule = (await iconFile()) as { default: string }
    return iconModule?.default
  }
  return ''
}

let icon = ref(props.icon)
getIcon().then(i => icon.value = i)
</script>

<style lang="less">
.icon {
  vertical-align: middle;
}

.icon:hover {
  svg *[stroke="#60656E"] {
    stroke: #1664FF 
  }
  svg path[fill="#60656E"] {
    fill: #1664FF
  }
}
</style>

