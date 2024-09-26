<template>
  <a-layout>
    <a-layout-header class="flex justify-between items-center">
      <!-- <i class="logo"></i> -->
       <svg-icon icon="home" style="display: flex;"></svg-icon>
      <!-- <img src="../assets/images/icon_navlogo_home.png" alt="logo"/> -->
      <Header />
    </a-layout-header>
    <a-layout class="layout-main">
      <div class="sidebar" :class="{'collapsed': collapsed}">
        <div class="menu">
          <a-menu
            mode="inline"
            :inline-collapsed="collapsed"
            :style="{ height: '100%', borderRight: 0 }"
            v-model:selectedKeys="selectedKeys"
            v-model:openKeys="openKeys"
          >
            <Menu :menus="menus"></Menu>
        </a-menu></div>
        <div class="toggle-menu" :class="{'collapsed': collapsed}" @click="toggleCollapsed">
          <svg-icon icon="collapse"></svg-icon>
        </div>
      </div>
      <!-- layout-sider临时占位,解决右侧table宽度一直自动增加的bug。原因未知 -->
      <a-layout-sider style="display: none;">
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
  if(collapsed.value) return []

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

const collapsed = ref(false);
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

</script>

<style scoped lang="less">
.layout-main {
  flex-direction: row;
}
.sidebar {
  width: 235px !important;
  min-width: 235px !important;
  max-width: 235px !important;
  position: relative; 
  background-color: #fff; 
  padding-top: 16px; 
  transition: all 0.5s;

  &.collapsed {
    width: 64px !important;
    min-width: 64px !important;
    max-width: 64px !important;

    .ant-menu.ant-menu-inline-collapsed {
      width: 64px;
    }
  }
}
.menu {
  overflow-y: auto;
  height: calc(100% - 50px) !important;
}
.toggle-menu {
  position: absolute;
  bottom: 2px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #e6e7eb;
  background-color: #fff;

  .icon {
    cursor: pointer; 
    margin-left: 24px;
    line-height: 1;
  }

  &.collapsed {
    .icon{
      transform: rotate(180deg);
      position: relative;
      top: -2px;
    }
  }
}
</style>
