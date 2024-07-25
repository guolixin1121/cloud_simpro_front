<template>
  <div class=" right">
    <div class="flex items-center justify-center">
      <a-dropdown>
        <a class="username">
          <span style="margin-right: 8px;">{{ user.user?.username }}</span>
          <svg-icon icon="arrow"/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="showPersonal = true">账号信息</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="showChangePassword = true">修改密码</a>
            </a-menu-item>
            <a-menu-item v-if="managerAcl">
              <a :href="'http://simpro02.saimo.cloud:32450/cloud_pro_auth/#/manage/' + managerAcl" target="_blank">管理中心</a>
            </a-menu-item>
            <a-menu-item v-if="memberAcl">
              <a :href="'http://simpro02.saimo.cloud:32450/cloud_pro_auth/#/manage/' + memberAcl" target="_blank">成员管理</a>
            </a-menu-item>
            <a-menu-item>
              <a href="/helper/" target="_blank">用户手册</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="user.logout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- <a href="/helper/" target="_blank">
        <img src="../assets//images/icon_explain.png" class="cursor-pointer" style="width: 24px; margin-left: 16px" />
      </a> -->
    </div>
  </div>
  <a-modal title="账户信息" width="500px" v-model:visible="showPersonal" :footer="null" destroy-on-close="true">
    <Personal></Personal>
  </a-modal>
  <a-modal title="修改密码" v-model:visible="showChangePassword" :footer="null" destroy-on-close="true">
    <a-form ref="formRef" :labelCol="{ style: { width: '75px' } }"  @finish="ok" :model="formData" style="margin: 24px">
      <a-form-item name="origin_password" label="原密码" :rules="[
          { required: true, message: '请填写原密码' },
          { validator: () => validatePassword(formData.origin_password) } ]">
        <a-input-password autocomplete="new-password" name="origin_password" v-model:value="formData.origin_password" placeholder="请输入密码"></a-input-password>
      </a-form-item>
      <a-form-item name="password" label="新密码" :rules="[{ required: true, message: '请填写原密码' },
        { validator: () => validatePassword(formData.password) }
      ]">
        <a-input-password name="password" v-model:value="formData.password" placeholder="请填写新密码" autocomplete="new-password"></a-input-password>
      </a-form-item>
      <a-form-item name="confirm_password" label="确认密码"
        :rules="[{ required: true, message: '请填写确认密码' }, 
          { validator: () => comparePassword(formData) }]">
        <a-input-password name="confirm_password" v-model:value="formData.confirm_password" placeholder="两次密码必须一致且不能包含空格" autocomplete="new-password"></a-input-password>
      </a-form-item>
    </a-form>
    <div class="modal-buttons">
      <a-button @click="resetPasswordForm">重置</a-button>
      <a-button class="login-btn" type="primary" html-type="submit" :loading="loading">提交</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import Personal from './components/personal.vue'
import { validatePassword, comparePassword } from '@/utils/validate'

const user = store.user
const showChangePassword = ref(false)
const showPersonal = ref(false)

const managerAcl = computed(() => {
  // 有以下其中一个权限，就展示‘管理中心’
   const keys = ['system:systemManage:enterprise', 'system:systemManage:menu', 'system:clueManage']
   for(let i = 0; i < keys.length; i++) {
     if(user.hasAcl(keys[i])) {
       return keys[i]
     }
   }
  return ''
})
const memberAcl = computed(() => user.hasAcl('system:memberManage') ? 'system:memberManage' : '')

const formRef = ref()
const formData = reactive({
  origin_password: '',
  password: '',
  confirm_password: ''
})
const loading = ref(false)
const ok = async () => {
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
}
const resetPasswordForm = () => formRef.value.resetFields()
</script>

<style scoped lang="less">
.username {
  color: #fffc;
  display: flex;
}
:deep(.icon) {
  transform: rotate(90deg);
  svg {
    width: 14px;
    height: 14px;
  }
}
.alert {
  width: 40px;
  height: 40px;
  text-align: center;
  background-color: #30353f;
  position: relative;

  &-icon {
    background-image: url('@/assets/images/alert.png');
    display: inline-block;
    vertical-align: super;
    width: 24px;
    height: 24px;
  }

  &-circle {
    display: inline-block;
    background-color: #ff4040;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
.name:after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border: 2px solid #b1b6c3;
  border-right: transparent;
  border-top: transparent;
  transform: rotate(-45deg);
  margin-left: 10px;
  position: relative;
  top: -4px;
}
</style>
