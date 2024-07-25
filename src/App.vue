<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
// import loading from './utils/loading'
// import { LStorage } from './utils/storage'

dayjs.locale('zh-cn')

// const checkProject = async () => {
//   const project = await api.user.project(LStorage.get('X-Priject-ID'))
//   if(project?.data_config_status != '2') {
//     loading()
//   }
// }
// checkProject()
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
