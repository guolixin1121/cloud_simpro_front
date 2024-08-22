<script setup lang="ts">
// import { getToken, LStorage } from '@/utils/storage'
const props = defineProps({
  menus: {
    type: Array<Permission>,
    required: true
  }
})
const isSubmenu = (children: Permission[] | undefined) => !children ? false : !!children.find((child: Permission) => child.visible)
const isOuterlink = (url: string) => url.indexOf('http') > -1
const openOuterlink = (url: string) => {
  // const params = '?token=' + getToken() + '&X-Project-Id=' + LStorage.get('X-Project-Id')
  window.open(url, 'traffic')
}
</script>

<template>
  <template v-for="menu in props.menus">
    <template v-if="menu.visible">
      <a-sub-menu v-if="isSubmenu(menu.children)" :key="menu.path">
        <template #title>
          <svg-icon class="ant-menu-item-icon" :icon="menu.icon || ''"></svg-icon>
          <span>{{ menu.title }}</span>
        </template>
        <Menu :menus="menu.children" />
      </a-sub-menu>
      <template v-else>
        <a-menu-item :key="menu.path">
          <!-- icon的class在菜单缩放隐藏菜单名称时需要 -->
          <svg-icon class="ant-menu-item-icon" :icon="menu.icon || ''"></svg-icon>
          <span>
            <a v-if="isOuterlink(menu.path)" @click="openOuterlink(menu.path)">{{ menu.title }}</a>
            <router-link  v-else :to="menu.path + '?clear'">{{ menu.title }}</router-link>
          </span>
        </a-menu-item>
      </template>
    </template>
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
