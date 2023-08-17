<template>
  <div class="login-container">
    <span class="pro-name">智驾云平台</span>
    <a-form style="margin: 0 auto" @finish="login" :model="formData" autocomplete="off">
      <span class="title">登录</span>
      <label className="label">账户</label>
      <a-form-item name="username" :rules="[{ required: true, message: '请输入账户' }]" autocomplete="off">
        <a-input name="username" v-model:value="formData.username" placeholder="请输入账户" autocomplete="off"></a-input>
      </a-form-item>
      <label className="label">密码</label>
      <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]" autocomplete="off">
        <a-input-password
          name="password"
          placeholder="请输入密码"
          v-model:value="formData.password"
          autocomplete="off"
        ></a-input-password>
      </a-form-item>
      <a-checkbox v-model:checked="checked" @change="handleChange">记住密码</a-checkbox>
      <a-form-item>
        <a-button class="login-btn" type="primary" html-type="submit" :loading="loading">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const loading = ref<any>(false)
const checked = useLocalStorage('remind_psd', false)
const formData = useLocalStorage('auth', { username: '', password: ''})

const login = async () => {
  loading.value = true
  try {
    const { username, password } = formData.value
    const res = await api.user.login({ username, password })
    handleChange()
    location.href = '/?token=' + res.token
  } finally {
    loading.value = false
  }
}
const handleChange = () => {
  if (!checked.value) {
    // clear auth data
    formData.value = {
      username: '',
      password: ''
    }
  }
}
</script>
<style scoped lang="less">
.pro-name {
  position: absolute;
  left: 40%;
  top: 40%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 60px;
  font-weight: 600;
}
:deep(.ant-layout .ant-layout-content) {
  padding: 0;
}
:deep(body) {
  background: #f0f2f5;
}
.login-container {
  background: url('../../assets/images/login-bg.png') no-repeat center center;
  background-size: cover;
  height: 100%;
  width: 100%;
  .ant-form {
    width: 380px;
    height: 480px;
    position: absolute;
    background: #ffffff;
    border-radius: 4px;
    right: 230px;
    top: 50%;
    transform: translate(0, -50%);
    padding: 32px 40px 0;
    .title {
      font-size: 36px;
      font-weight: 500;
      color: #1e2229;
      line-height: 54px;
      display: block;
      margin-bottom: 16px;
    }
    .label {
      margin-bottom: 4px;
      display: block;
    }
  }
  .ant-checkbox-wrapper {
    transform: translate(0, -10px);
  }
  .ant-input-affix-wrapper {
    padding: 0 11px 0 0;
  }
  .ant-input,
  .ant-input-affix-wrapper {
    height: 48px;
    font-size: 16px;
    :deep(input) {
      font-size: 16px;
      padding: 4px 0 4px 11px;
    }
  }
  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    margin-top: 60px;
  }
}
:deep(input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill) {
  box-shadow: inset 0 0 0 1000px #fff;
  -webkit-box-shadow: 0 0 0 1000px white inset; /* 设置为透明 */
}
</style>
