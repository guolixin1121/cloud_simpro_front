<!-- eslint-disable no-undef -->
<template>
  <a-button class="home" @click="f">btn</a-button>
  <p>
    <svg-icon iconName="icon-chengbenfa"></svg-icon>
    <svg-icon iconName="icon-jiahao" color="red"></svg-icon>
  </p>
  <!-- <a-date-picker v-model:value="value" /> -->
  <a-calendar v-model:value="value" :fullscreen="false" />
</template>

<script setup lang="ts">
import { getTest } from '@/apis/test'
import { Moment } from 'moment'
// import moment from 'moment'
const value = ref<Moment>()
// const value = ref(moment('2015 -01-01', 'YYYY-MM-DD'))
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
