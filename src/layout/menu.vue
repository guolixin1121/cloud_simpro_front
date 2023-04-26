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
        <svg-icon :icon="menu.icon || ''"></svg-icon>
        <span>
          <router-link :to="menu.path">{{ menu.title }}</router-link>
        </span>
      </a-menu-item>
    </template>
    <a-sub-menu v-else :key="menu.path">
      <template #title>
        <svg-icon :icon="menu.icon || ''"></svg-icon>
        <span>{{ menu.title }}</span>
      </template>
      <Menu :menus="menu.children" />
    </a-sub-menu>
  </template>
</template>

<style lang="less">
.ant-menu-item, .ant-menu-submenu-title {
  .icon {
    position: relative;
    top: 2px;
    margin-right: 3px
  }
}
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
