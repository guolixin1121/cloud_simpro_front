<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider :locale="locale" :autoInsertSpaceInButton="false">
    <router-view />
  </a-config-provider>
</template>

<style>
#app {
  min-width: 1440px;
  overflow: hidden;
  display: flex;
}
</style>
