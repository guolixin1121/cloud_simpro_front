

<template>
  <a-layout>
    <a-layout-header class="flex justify-between items-center" style="background-color: #1E2229; color: #fff">
      <menu-unfold-outlined v-if="collapsed" class="hover:text-blue-500" @click="updateCollapsed"/>
      <menu-fold-outlined v-else class="hover:text-blue-500" @click="updateCollapsed" />
      <Header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <i class="block mx-5 my-4 h-10 logo"></i>
        <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
          <Menu :menus="menus"></Menu>
        </a-menu>
      </a-layout-sider>
      
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import Header from './header.vue'
import Menu from './menu.vue'

// folder or unfolder the left menu
let collapsed = ref(false)
const updateCollapsed = () => collapsed.value = !collapsed.value

// menus for current login user
let menus: Permission[] =  store.user.user.permissions

// set selected menu, and open its parent menu
const route = useRoute()
let selectedKeys = computed(() => [route.path])
let openKeys = computed(() => {
  const keys = getParentKeys(menus)
  return !keys ? [] : keys
})

/**
 * 递归获取当前路由的所有父节点的key
 * @param list 要检索的路由列表
 * @param currentRoute 当前路由
 * @param keys 父节点key集合
 */
function getParentKeys (list: Permission[], keys: string[] = []): string[] | boolean {
  for(let item of list) {
    if(item.path === route.path) {
      return [...keys]
    } else if(item.children && item.children.length) {
      const parentKeys = getParentKeys(item.children,[...keys, item.path])
      if(parentKeys !== false) {
        return parentKeys
      }
    }
  }
  return false
}

</script>

<style scoped>
.logo {
  background-image: url(../assets/images/logo.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.ant-layout-sider-collapsed .logo{
  background-image: url(../assets/images/logo-small.png);
}
</style>
