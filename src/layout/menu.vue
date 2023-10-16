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
          <!-- 通过 -->
          <router-link :to="menu.path + '?clear'">{{ menu.title }}</router-link>
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
@import "@/assets/styles/variable.less";
.ant-menu-item, .ant-menu-submenu-title {
  .icon {
    position: relative;
    top: 2px;
    margin-right: 3px
  }
}
.ant-menu-item:hover,
.ant-menu-item-selected,
// .ant-menu-submenu-title:hover, 
.ant-menu-submenu:hover,
.ant-menu-submenu-selected .ant-menu-submenu-title {
  .icon {
    svg *[stroke="#60656E"] {
      stroke: @primary-color 
    }
    svg path[fill="#60656E"], svg rect[fill="#60656E"] {
      fill: @primary-color 
    }
  }
}
</style>
