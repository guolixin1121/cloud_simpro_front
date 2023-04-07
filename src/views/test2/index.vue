<!-- eslint-disable no-undef -->
<template>
  <a-button class="home" @click="f">btn</a-button>
  <p>
    <svg-icon iconName="icon-chengbenfa"></svg-icon>
    <svg-icon iconName="icon-jiahao" color="red"></svg-icon>
  </p>
</template>

<script setup lang="ts">
import { getTest } from '@/apis/test'

const f = async () => {
  const data = await getTest()
  console.log(data)
}
// console.log(ref)
// console.log(process.env.VITE_BASE_STATIC_URL)
</script>

<style lang="less">
.home {
  color: red;
}
</style>
