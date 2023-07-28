<template>
  <div class=" inline-block text-center m-5 border border-gray-50"  v-for="icon in icons" :key="icon">
    <p>{{icon}}</p>
    <svg-icon :icon="icon"></svg-icon>
  </div>
</template>

<script setup lang="ts">

let icons = ref<string[]>()

const getIcon = async () => {
  const iconFiles = import.meta.glob('../../assets/icons/*.svg')
  const results = []
  for(const icon in iconFiles) {
    const iconName = icon.replace('../../assets/icons/', '').replace(/\/|.svg/g,'')
    results.push(iconName)
  }
  console.log(results)
  icons.value = results
}

getIcon()

</script>

<style lang="less">

</style>
