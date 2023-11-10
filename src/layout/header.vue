<script setup lang="ts">
interface MenuItem {
  title: string
  path: string
}
const user = store.user.user
let topMenus = ref<MenuItem[]>([])
api.user.getTopMenu().then(data => (topMenus.value = data))

const logout = store.user.logout
</script>

<template>
  <div class="flex justify-between w-full">
    <div>
      <a v-for="(menu, index) in topMenus" :key="index" :href="menu.path" class="ml-16" style="display: none" target="_blank">
        {{ menu.title }}
      </a>
    </div>
    <div class="flex items-center justify-center">
      <!-- <div class="alert mr-5">
        <i class="alert-icon"></i>
        <i class="alert-circle"></i>
      </div> -->
      <a-dropdown>
        <a class="username">
          <span style="margin-right: 8px;">{{ user?.username || '管理员' }}</span>
          <svg-icon icon="arrow"/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="logout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a href="/helper/" target="_blank">
        <img src="../assets//images/icon_explain.png" class="cursor-pointer" style="width: 24px; margin-left: 16px" />
      </a>
    </div>
  </div>
</template>

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
