<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import Header from './header.vue'
import Menu from './menu.vue'

// folder or unfolder the left menu
let collapsed = ref(false)
const updateCollapsed = () => collapsed.value = !collapsed.value

// default menu
const route = useRoute()
const selectedKeys = ref<string[]>([route.path])

// menus for current login user
let menus = [
  { title: '首页', path: '/home'},
  { 
    title: '二级', 
    path: '/erji',
    children: [
      { title: '测试', path: '/test2' }
    ]
  }
]

// open parent menu of submenu
const openKeys = getParentKeys(menus)
function getParentKeys (list: MenuItem[], keys: string[] = []): string[] {
  let result: string[] = []
  for(let item of list) {
    if(item.path === route.path) {
      result = [...keys]
    } else if(item.children && item.children.length) {
      result = getParentKeys(item.children, [...keys, item.path])
    }
  }
  return result
}
</script>

<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <img src="../assets/images/logo.png" class="m-5" style="width: 160px;"/>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
        <Menu :menus="menus"></Menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="flex justify-between">
        <menu-unfold-outlined v-if="collapsed" class="hover:text-blue-500" @click="updateCollapsed"/>
        <menu-fold-outlined v-else class="hover:text-blue-500" @click="updateCollapsed" />
        <Header />
      </a-layout-header>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
