<script setup lang="ts">
interface MenuItem {
  title: string, 
  path: string
}
const user = store.user.user
let topMenus = ref<MenuItem[]>([])
apis.user.getTopMenu().then(data => topMenus.value = data)
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
      <span>{{ user?.nickname }}</span>
      <a class=" ml-5" @click="user.logout">退出登录</a>
    </div>
  </div>
</template>

<style scoped></style>
