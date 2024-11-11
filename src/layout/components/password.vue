<template>
    <a-form ref="formRef" :labelCol="{ style: { width: '75px' } }" :model="formData" style="margin: 24px">
      <a-form-item name="origin_password" label="原密码" :rules="[
          { required: true, message: '请填写原密码' },
          { validator: () => validatePassword(formData.origin_password) } ]">
        <a-input-password maxLength="16" name="origin_password" autocomplete="new-password" v-model:value="formData.origin_password" placeholder="请填写原密码"></a-input-password>
      </a-form-item>
      <a-form-item name="password" label="新密码" :rules="[{ required: true, message: '请填写新密码' },
        { validator: () => validatePassword(formData.password) }
      ]">
        <a-input-password maxLength="16" name="password" v-model:value="formData.password" placeholder="请填写新密码" autocomplete="new-password"></a-input-password>
      </a-form-item>
      <a-form-item name="confirm_password" label="确认密码"
        :rules="[{ required: true, message: '请填写确认密码' }, 
          { validator: () => comparePassword(formData) }]">
        <a-input-password maxLength="16" name="confirm_password" v-model:value="formData.confirm_password" placeholder="两次密码必须一致" autocomplete="new-password"></a-input-password>
      </a-form-item>
    </a-form>
    <div class="modal-buttons">
      <a-button @click="resetPasswordForm">重置</a-button>
      <a-button class="login-btn" type="primary" :loading="loading" @click="ok">提交</a-button>
    </div>
</template>

<script lang="ts" setup>
import { validatePassword, comparePassword } from '@/utils/validate'

const user = store.user

const formRef = ref()
const formData = reactive({
  origin_password: '',
  password: '',
  confirm_password: ''
})
const loading = ref(false)
const ok = () => {
  formRef.value?.validate().then(async () => {
    try {
        loading.value = true
        const res = await api.auth.changePassword({ 
          oldPassword: formData.origin_password, 
          newPassword: formData.password, 
          confirmPassword: formData.confirm_password
        })
        if(!res.code) {
          message.success('密码修改成功，请重新登录')
          user.logout()
        }
    } finally {
        loading.value = false
    }
  })
}
const resetPasswordForm = () => formRef.value.resetFields()
</script>