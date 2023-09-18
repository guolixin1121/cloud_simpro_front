<template>
  <a-layout>
    <a-layout-header class="flex justify-between items-center">
      <i class="logo"></i>
      <Header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="235" style="background-color: #fff; padding-top: 10px; overflow: auto">
        <a-menu
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
        >
          <Menu :menus="menus"></Menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from './header.vue'
import Menu from './menu.vue'

// menus for current login user
let menus: Permission[] = store.user.user.permissions

// set selected menu, and open its parent menu
const route = useRoute()
let selectedKeys = computed(() => menuPath.value)
let openKeys = computed(() => {
  const keys = getParentKeys(menus)
  return !keys ? [] : keys
})

// 获取当前路由对应的菜单
// 二级页面以一级页面为根路径
// 兼容/menu/,/menu两种路径格式
const menuPath = computed(() => {
  const path: string = route.path.split('/')[1]
  return [`/${path}`, `/${path}/`] 
})

/**
 * 递归获取当前路由的所有父节点的key
 * @param list 要检索的路由列表
 * @param currentRoute 当前路由
 * @param keys 父节点key集合
 */
function getParentKeys(list: Permission[], keys: string[] = []): string[] | boolean {
  for (let item of list) {
    if (menuPath.value.indexOf(item.path) > -1) {
      return [...keys]
    } else if (item.children && item.children.length) {
      const parentKeys = getParentKeys(item.children, [...keys, item.path])
      if (parentKeys !== false) {
        return parentKeys
      }
    }
  }
  return false
}
</script>

<style scoped>
.logo {
  display: block;
  background-image: url(../assets/images/logo.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 290px;
  height: 36px;
}
</style>
