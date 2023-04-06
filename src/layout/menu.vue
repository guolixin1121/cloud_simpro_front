<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';

interface MenuItem {
  title: string,
  path: string,
  children?: MenuItem[]
}

const props = defineProps({
    menus: {
      type: Array<MenuItem>,
      required: true
    }
  })
</script>

<template>
    <template v-for="menu in props.menus">
      <template v-if="!menu.children || !menu.children.length">
        <a-menu-item :key="menu.path">
          <user-outlined />
          <span><router-link :to="menu.path">{{ menu.title }}</router-link></span>
        </a-menu-item>
      </template>
      <a-sub-menu v-else :key="menu.path">
        <template #title>
          <user-outlined />
          <span>{{menu.title}}</span>
        </template>
        <Menu :menus="menu.children" />
      </a-sub-menu>
    </template>
</template>

<style scoped></style>