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
        <!-- icon的class在菜单缩放隐藏菜单名称时需要 -->
        <svg-icon class="ant-menu-item-icon" :icon="menu.icon || ''"></svg-icon>
        <span>
          <router-link :to="menu.path + '?clear'">{{ menu.title }}</router-link>
        </span>
      </a-menu-item>
    </template>
    <a-sub-menu v-else :key="menu.path">
      <template #title>
        <svg-icon class="ant-menu-item-icon" :icon="menu.icon || ''"></svg-icon>
        <span>{{ menu.title }}</span>
      </template>
      <Menu :menus="menu.children" />
    </a-sub-menu>
  </template>
</template>

<style lang="less">
.ant-menu-item,
.ant-menu-submenu-title {
  .icon {
    position: relative;
    top: 2px;
    margin-right: 3px;
  }
}
</style>
