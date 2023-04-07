<template>
  <a-form style="margin: 0 auto" class="pt-20 w-1/2">
    <a-form-item label="用户名">
      <a-input></a-input>
    </a-form-item>
    <a-form-item label="密码">
      <a-input></a-input>
    </a-form-item>
    <a-form-item>
      <a-button @click="login">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/user'
const router = useRouter()

const login = async () => {
  await useUserStore().login()
  router.push('/')
}
</script>
