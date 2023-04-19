<template>
  <div class=" inline-block text-center m-5 border border-gray-50"  v-for="icon in icons" :key="icon">
    <p>{{icon}}</p>
    <SvgIcon :icon="icon"></SvgIcon>
  </div>
</template>

<script setup lang="ts">

let icons = ref<string[]>()

const getIcon = async () => {
  const iconFiles = import.meta.glob('../../assets/icons/*.ts')

  const list = []
  for(const path in iconFiles) {
    const paths = path.split('/')
    const fileName = paths[paths.length - 1].split('.')[0]
    list.push(fileName)
  }
  icons.value = list
}

getIcon()

</script>

<style lang="less">

</style>
