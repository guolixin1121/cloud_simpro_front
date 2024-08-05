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
              <a :href="'/cloud_pro_auth/#/manage/' + managerAcl" target="_blank">管理中心</a>
            </a-menu-item>
            <a-menu-item v-if="memberAcl">
              <a :href="'/cloud_pro_auth/#/manage/' + memberAcl" target="_blank">成员管理</a>
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
    </div>
  </div>
  <a-modal title="账户信息" width="500px" v-model:visible="showPersonal" :footer="null" destroy-on-close="true">
    <Personal></Personal>
  </a-modal>
  <a-modal title="修改密码" v-model:visible="showChangePassword" :footer="null" destroy-on-close="true">
    <Password></Password>
  </a-modal>
</template>

<script setup lang="ts">
import Personal from './components/personal.vue'
import Password from './components/password.vue'

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
const memberAcl = user.hasAcl('system:memberManage') ? 'system:memberManage' : ''
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
