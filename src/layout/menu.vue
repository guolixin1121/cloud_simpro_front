<!-- eslint-disable no-undef -->
<script setup lang="ts">
import * as Icons from '@ant-design/icons-vue'

const props = defineProps({
    menus: {
      type: Array<Permission>,
      required: true
    }
  })
</script>

<template>
  <template v-for="menu in props.menus">
    <template v-if="!menu.children || !menu.children.length">
      <a-menu-item :key="menu.path">
        <component :is="Icons[(menu.icon || 'UserOutlined') as keyof typeof Icons]"></component>
        <span
          ><router-link :to="menu.path">{{ menu.title }}</router-link></span
        >
      </a-menu-item>
    </template>
    <a-sub-menu v-else :key="menu.path">
      <template #title>
        <component :is="Icons[(menu.icon || 'UserOutlined') as keyof typeof Icons]"></component>
        <span>{{ menu.title }}</span>
      </template>
      <Menu :menus="menu.children" />
    </a-sub-menu>
  </template>
</template>

<style scoped></style>
