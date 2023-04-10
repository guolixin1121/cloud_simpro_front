<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore } from '../store/user'
import { useConfigApi } from '@/apis/config';
const store = useUserStore()
const api = useConfigApi()
let state = reactive({
  topMenus: {}
})

api.getTopMenu().then(data => {
  state.topMenus = data
})
</script>

<template>
  <div class="flex justify-between w-full">
    <div>
      <a v-for="[key, value] in Object.entries(state.topMenus)" 
        :key="key"
        :href="value as string"
        class=" ml-7"
        target="_blank">
        {{ key }} 
      </a>
    </div>
    <div>
      <span>{{ store.user?.name }}</span>
      <a class=" ml-5" @click="store.logout">退出登录</a>
    </div>
  </div>
</template>

<style scoped></style>
