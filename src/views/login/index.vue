<template>
  <a-form style="margin: 0 auto" class="pt-20 w-1/2">
    <a-form-item label="用户名">
      <a-input v-model:value="username"></a-input>
    </a-form-item>
    <a-form-item label="密码">
      <a-input v-model:value="password"></a-input>
    </a-form-item>
    <a-form-item>
      <a-button @click="login">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const username = ref('')
const password = ref('')

const router = useRouter()

const login = async () => {
  await useUserStore().login({ username: username.value, password: password.value })
  router.push('/')
}
</script>
