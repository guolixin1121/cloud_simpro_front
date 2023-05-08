<template>
  <a-form style="margin: 0 auto" class="pt-20 w-1/2">
    <a-form-item label="用户名">
      <a-input v-model:value="username"></a-input>
    </a-form-item>
    <a-form-item label="密码">
      <a-input-password v-model:value="password"></a-input-password>
    </a-form-item>
    <a-form-item>
      <a-button @click="login">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
const username = ref('admin')
const password = ref('admin')

// const router = useRouter()

const login = async () => {
  const res = await api.user.login({ username: username.value, password: password.value })
  // await store.user.login({ username: username.value, password: password.value })
  // router.push('/')
  location.href = '/?token=' + res.token
}
</script>
