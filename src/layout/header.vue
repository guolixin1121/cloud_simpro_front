<script setup lang="ts">
import { useUserStore } from '../store/user'
const store = useUserStore()
</script>

<template>
  <div>
   <span>{{ store.user?.name }}</span>
   <a class=" ml-5" @click="store.logout">退出登录</a>
  </div>
</template>

<style scoped></style>
