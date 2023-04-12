<script setup lang="ts">
import { useUserStore } from '../store/user'
import { useUserApi } from '@/apis/user';
const store = useUserStore()
const api = useUserApi()

interface MenuItem {
  title: string, 
  path: string
}
let topMenus = ref<MenuItem[]>([])
api.getTopMenu().then(data => topMenus.value = data)
</script>

<template>
  <div class="flex justify-between w-full">
    <div>
      <a v-for="(menu, index) in topMenus" 
        :key="index"
        :href="menu.path"
        class=" ml-7"
        target="_blank">
        {{ menu.title }} 
      </a>
    </div>
    <div>
      <span>{{ store.user?.nickName }}</span>
      <a class=" ml-5" @click="store.logout">退出登录</a>
    </div>
  </div>
</template>

<style scoped></style>
