<script setup lang="ts">

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
        <SvgIcon :icon="menu.icon"></SvgIcon>
        <span>
          <router-link :to="menu.path">{{ menu.title }}</router-link>
        </span>
      </a-menu-item>
    </template>
    <a-sub-menu v-else :key="menu.path">
      <template #title>
        <SvgIcon :icon="menu.icon"></SvgIcon>
        <span>{{ menu.title }}</span>
      </template>
      <Menu :menus="menu.children" />
    </a-sub-menu>
  </template>
</template>

<style scoped lang="less">
.ant-menu-item:hover, 
.ant-menu-submenu-title:hover, 
.ant-menu-submenu-selected .ant-menu-submenu-title, 
.ant-menu-item-selected {
  .icon {
    svg *[stroke="#60656E"] {
      stroke: #1664FF 
    }
    svg path[fill="#60656E"] {
      fill: #1664FF
    }
  }
}
</style>
